from flask import Flask, render_template, request, make_response, jsonify
# import gspread
# from oauth2client.service_account import ServiceAccountCredentials
from pymongo import MongoClient
from random import randint
from dotenv import dotenv_values

import time


env = dotenv_values(".env")

# databse init
client = MongoClient("mongodb+srv://"+env["mongoUsr"]+":"+env["mongoPw"]+"@cluster0.4rzpy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
db=client.zona.entries
app = Flask(__name__)

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


@app.route('/entry', methods = ['POST'])
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