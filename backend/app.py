from flask import Flask, render_template, request, make_response
import gspread
from oauth2client.service_account import ServiceAccountCredentials

# flask app setup
app = Flask(__name__)

# google sheets setup
scope = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive'
]
credtails = ServiceAccountCredentials.from_json_keyfile_name("creds.json", scope)
client = gspread.authorize(credtails)
sheet = client.open("totally good database")
members = sheet.worksheet("Sheet1")

print(members.get_all_records())

# @app.route('/')
# def index():
#     if request.authorization and request.authorization.username == 'unleashspace' and request.authorization.password == 'UnleashSpace2017':
#         return render_template('index.html')
#     return make_response('Could not verify!', 401, {'WWW-Authenticate': 'Basic realm="Login Required'})


if __name__ == '__main__':
    app.debug = True
    app.run()