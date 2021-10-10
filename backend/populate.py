import requests
import random
import time
import json

#OPTIONS
DELAY = 600 #seconds
ENDPOINT = "http://localhost:5000/zona/entry/multiple"
startTime = 1632894855 #https://www.epochconverter.com/
endTime = 1635165795
# endTime = 1632897855


headers = {'Content-type': 'application/json'}
time = startTime

def numPeople():
    return random.choice([1,1,1,1,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,5,5,5,5,6,6,7,8,9,10])

while time < endTime:
    count = 0
    jsonToSend =[]
    while count < 100:
        jsonToSend.extend([{
            'time': time,
            'roomName': "Fab Lab", 'roomId': 2, "camId": 2, #Identification
            'count': numPeople()}
            ,{
            'time': time,
            'roomName': "Digi Lab", 'roomId': 1, "camId": 1, #Identification
            'count': numPeople()}, {
            'time': time,
            'roomName': "Lunch Room", 'roomId': 3, "camId": 6, #Identification
            'count': numPeople()}])
        time += DELAY
        count +=1
    print(jsonToSend)
    r = requests.post(url = ENDPOINT, data = json.dumps(jsonToSend), headers=headers)
    print(r.status_code)
