import datetime
from flask import Flask, request, Response
from flask_cors import CORS, cross_origin
from pymongo import MongoClient
from random import randint
from dotenv import dotenv_values
import time
import pytest
import json
import numpy as np
import cv2
import imutils
import discord
import os
from discord import message
from dotenv import dotenv_values
from discord import user
from discord.ext import tasks
import threading
import asyncio


app = Flask(__name__)
env = dotenv_values(".env")
client = MongoClient("mongodb+srv://"+env["mongoUsr"]+":"+env["mongoPw"]+"@cluster0.4rzpy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
db = client.zona.entries
camdb = client.zona.cameras
roomdb = client.zona.rooms

cors = CORS(app, resources={r"*": {"origins": "*"}})

bot_loop = None

# Initializing the HOG person detector
hog = cv2.HOGDescriptor()
hog.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())


@app.route('/')
def index():
    pass

@app.route('/zona/entry/multiple', methods = ['POST'])
@cross_origin()
def entries():
    for item in request.json:
        entry(item)
    return "200";

@app.route('/zona/entry', methods = ['POST'])
@cross_origin()
def entry():
    entry(request.json)
    return "200"

#Entry for internal use
def entry(entry):
    print(entry)

    #Checking to see if the data has been changed recently
    data = roomdb.find_one({'roomId': entry["roomId"]}, {'lastEntry': 1, 'numberOfCams': 1, 'maxPeople': 1})

    if(time.time()-data["lastEntry"] < 5): #if over 5 seconds have passed, this is a new set of images
        result = roomdb.find_one_and_update({'roomId': entry["roomId"]},
        {'$set': {'lastEntry': time.time()}, '$inc': {'currentPeople': entry["count"]}})
        currentPeople = result["currentPeople"] + entry["count"]
    else:
        result = roomdb.find_one_and_update({'roomId': entry["roomId"]},
        {'$set': {'lastEntry': time.time(), 'currentPeople': entry["count"]}})
        currentPeople = result["currentPeople"]
    print(result)
    
    #Checking if over max
    if(currentPeople >= data["maxPeople"]):
        #Send alert message
        asyncio.run_coroutine_threadsafe(alert(entry['roomName']), bot_loop)

    #Setting number of people to total people for entry
    entry["count"] = currentPeople
    result = db.insert_one(entry)
    print(result)


@app.route('/zona/image', methods = ['POST'])
@cross_origin()
def image():
    #Get image and camera ID from request
    file = request.files['image']
    camID = int(request.args["id"])

    #get room name
    room = camdb.find_one({'camId': camID}, {'roomName' : 1, "roomId" : 1})
    if(not room):
        print("ERROR: 404 Camera does not exist \nCameraID:", camID)
        return Response(404, 'ERROR: 404 Camera does not exist')

    # Reading the Image into buffer then into open-cv
    file = np.fromfile(file)
    image = cv2.imdecode(file, cv2.IMREAD_COLOR)

    # Resizing the Image
    image = imutils.resize(image, width=min(400, image.shape[1]))

    #Sometimes increases detection by turning the image black and white before looking
    imageGray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Detecting all the regions in the image that has a "pedestrian" inside it
    (people, confidences) = hog.detectMultiScale(imageGray,
                                    winStride=(2, 2), #Could also use 1, increases computation cost but is a little better.
                                    padding=(10, 10),
                                    scale=1.02)

    #calculating number of people
    numPeople = len(people)

    #Placing that into a json
    jsonToSend = {
        'time': time.time(), #Timestamp
        'roomName': room["roomName"], 'roomId': room["roomId"], "camId": camID, #Identification
        'count': numPeople} #Number of people

    #Putting it into the database
    entry(jsonToSend)


    return json.dumps({'msg': 'success', 'count': numPeople})


'''
    calls eg the following:
    {{URL}}/entries/all --> returns all entries
    {{URL}}/entries/all?room=1 --> returns all entries in room 1
    {{URL}}/entries/all?room=1&start=1631437204333&end=1831437204333 --> returns all entries in room 1 filter by UTC time


    Query params:
    room: room number (int)
    start: start timeDate UTC (int)
    end: end timeDate UTC (int)

    in form:
    [{
        '_id': ObjectId('614e6b777a07751bf72c9ee0'),
        'time': 1631437204333.0,
        'roomName': 'Digi Lab',
        'roomId': 2.0,
        'count': 40.0
    }]
'''
@app.route('/zona/entries/all', methods = ['GET'])
@cross_origin()
def all():
    responseData = {
        "roomName": "",
        "roomId": "",
        "entries":[]
        }
    start = 0;
    end = 9999999999999
    args = request.args
    steps = 20

    if("start" in args):
        start = int(args["start"])
    if("end" in args):
        end = int(args["end"])
    if("increment" in args):
        steps = int(args["increment"])

    #.sort({"time": 1})
    if("room" in args):
        result = list(db.find({"roomId": int(args["room"]), "time": {"$gt": start, "$lt":end}}))
    else:
        return Response("please include a room", 500)
        result = list(db.find({"time": {"$gt": start, "$lt":end}}).sort({"time": 1}))

    if (len(result) == 0):
        return Response("No entries found", 404)

    responseData["roomName"] = result[0]["roomName"]
    responseData["roomId"] = result[0]["roomId"]


    groups = []
    for i in range(steps):
        print(len(groups))
        groups.append({"count": 0, "total": 0, "time": 0})

    for i in range(len(result)):
        # find appropriate cell and adjust for rounding
        currentSteps = groups[round(steps*i/len(result) - 0.5)]
        currentSteps["count"] += 1
        currentSteps["total"] += result[i]["count"]
        currentSteps["time"] += result[i]["time"]
    print(groups)

    for step in groups:
        if(step["count"] == 0):
            continue
        data = {
                "time": step["time"]/step["count"],
                "count": step["total"]/step["count"],
            }
        responseData["entries"].append(data)

    return Response(json.dumps(responseData),  mimetype='application/json')




##Discord bot code:
client = discord.Client()

alertList = []
publicChannel = None

@client.event
async def on_ready():
    print('We have logged in as {0.user}'.format(client))

@client.event
async def on_message(message):
    if message.author == client.user:
        return

    #Command to add to alert list
    elif message.content.startswith('$addMeToAlertList'):
        if(message.author not in alertList):
            alertList.append(message.author)
            await message.channel.send('You have been added to the alert list.')
        else:
            await message.channel.send('You have already been added to the alert list.')
    
    #Command to remove from alert list
    elif message.content.startswith('$removeMeFromAlertList'):
        if(message.author in alertList):
            alertList.remove(message.author)
            await message.channel.send('You have been removed from the alert list.')
        else:
            await message.channel.send('You are not on the alert list.')
    
    #Help command
    elif isinstance(message.channel, discord.channel.DMChannel) or message.content.startswith('$helpZona'):
        await message.channel.send('Use `$addMeToAlertList` to add yourself to the alert list\nUse `$removeMeFromAlertList` to remove yourself from the alert list')

    #Dev Only Commands
    global publicChannel 
    if message.content.startswith('$SendTestAlert') and message.author.id == 145636068060954624: #Change to Env eventualy
        await alert("no room, this is a test of the alert system")
    elif message.content.startswith('$PublicAlerts') and message.author.id == 145636068060954624:
        await message.channel.send("Alerts are now public in this channel")
        publicChannel = message.channel
    elif message.content.startswith('$StopPublicAlerts') and message.author.id == 145636068060954624:
        await message.channel.send("Alerts are now private")
        publicChannel = None



async def alert(roomName):
    if(publicChannel):
        m = "There have been more than the allowed number of people detected in " + roomName + "."
        embed = discord.Embed(title=m)
        await publicChannel.send(embed=embed)
    else:
        for user in alertList:
           m = "There have been more than the allowed number of people detected in " + roomName + "."
           embed = discord.Embed(title=m)
           await user.send(embed=embed)
    
def botThread():
    client.run(env['token'])

def bot_loop_start(loop):
    loop.run_forever()

def appThread():
    app.run()

import logging, traceback
async def on_error(event, *args, **kwargs):
    print('Something went wrong!')
    logging.warning(traceback.format_exc())

if __name__ == '__main__':
    app.debug = False
    app_thread = threading.Thread(target=appThread)
    app_thread.start()
    bot_loop = asyncio.get_event_loop()
    bot_loop.create_task(botThread())
    bot_thread = threading.Thread(target=bot_loop_start, args=(bot_loop,))
    bot_thread.start()