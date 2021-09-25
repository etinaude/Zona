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

@app.route('/zona/entries/all', methods = ['GET'])
@cross_origin()
def all():
    results = list(db.find({}))
    responseData = []
    i = 0
    for entry in results:
        i += 1
        responseData.append(
            {
                "time": entry["time"],
                "rooms": entry["rooms"],
                "id": i
                # "id": str(entry["_id"])
            }
        )

    return Response(json.dumps(responseData),  mimetype='application/json')

@app.route('/zona/entries/time', methods = ['GET'])
def time():
    start = (request.args.to_dict()["start"])
    end = (request.args.to_dict()["end"])
    result = list(db.find({"time": {"$gt": start, "$lt":end}}))
    return str(result)

if __name__ == '__main__':
    app.debug = True
    app.run()


def test_answer():
    return True