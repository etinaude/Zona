# import gspread
# from oauth2client.service_account import ServiceAccountCredentials
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


app = Flask(__name__)
env = dotenv_values(".env")
client = MongoClient("mongodb+srv://"+env["mongoUsr"]+":"+env["mongoPw"]+"@cluster0.4rzpy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
db = client.zona.entries
camdb = client.zona.cameras
roomdb = client.zona.rooms

cors = CORS(app, resources={r"*": {"origins": "*"}})

# Initializing the HOG person detector
hog = cv2.HOGDescriptor()
hog.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())



# google sheets setup
# scope = [
    # 'https://www.googleapis.com/auth/spreadsheets',
    # 'https://www.googleapis.com/auth/drive'
# ]
# credtails = ServiceAccountCredentials.from_json_keyfile_name("creds.json", scope)
# client = gspread.authorize(credtails)
# sheet = client.open("totally good database")
# entries = sheet.worksheet("Sheet1")

# print(entries.get_all_records())


@app.route('/')
def index():
    pass


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
        #Send alert message ---------------------------------------------------------------------------------- TODO
        pass

    #Setting number of people to total people for entry
    entry["count"] = currentPeople
    result = db.insert_one(entry)
    print(result)


@app.route('/zona/image', methods = ['POST'])
@cross_origin()
def image():
    #Get image and camera ID from request
    file = request.files['image']
    camID = request.args["id"]

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


if __name__ == '__main__':
    app.debug = True
    app.run()
