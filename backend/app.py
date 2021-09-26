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
    print(request.json)
    result = db.insert_one(request.json)

    print(result)
    return "200"

#Entry for internal use
def entry(jsonToEnter):
    print(jsonToEnter)
    result = db.insert_one(jsonToEnter)

    print(result)


@app.route('/zona/image', methods = ['POST'])
@cross_origin()
def image():
    file = request.files['image']
    
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
        'time': time.time(),
        'roomName': 'Digi Lab', 'roomId': 1, #Need a way to identify the room.
        'count': numPeople}
    
    #Putting it into the database
    entry(jsonToSend)

    return json.dump({'msg': 'success'})


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
    responseData = []
    start = 0;
    end = 9999999999999
    args = request.args



    if("start" in args):
        start = int(args["start"])
    if("end" in args):
        end = int(args["end"])


    if("room" in args):
        result = list(db.find({"roomId": int(args["room"]), "time": {"$gt": start, "$lt":end}}))
        print(result)
    else:
        result = list(db.find({"time": {"$gt": start, "$lt":end}}))

    i = 0
    for entry in result:
        i += 1
        responseData.append(
            {
                "time": entry["time"],
                "roomName": entry["roomName"],
                "roomId": entry["roomId"],
                "count": entry["count"],
                "id": str(entry["_id"])
            }
        )

    return Response(json.dumps(responseData),  mimetype='application/json')


if __name__ == '__main__':
    app.debug = True
    app.run()
