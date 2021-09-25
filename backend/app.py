# import gspread
# from oauth2client.service_account import ServiceAccountCredentials
from flask import Flask, request,Response
from flask_cors import CORS, cross_origin
from pymongo import MongoClient
from random import randint
from dotenv import dotenv_values
import time
import pytest
import json


app = Flask(__name__)
env = dotenv_values(".env")
client = MongoClient("mongodb+srv://"+env["mongoUsr"]+":"+env["mongoPw"]+"@cluster0.4rzpy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
db = client.zona.entries

cors = CORS(app, resources={r"*": {"origins": "*"}})



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
def entry():
    print(request.json)
    result = db.insert_one(request.json)

    print(result)
    return "200"


@app.route('/image', methods = ['POST'])
def image():
    file = request.files['image']
    # TODO BEN DO YOUR THING HERE

    return jsonify({'msg': 'success'})


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
@app.route('/entries/all', methods = ['GET'])
def all():
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

    return str(result)


if __name__ == '__main__':
    app.debug = True
    app.run()
