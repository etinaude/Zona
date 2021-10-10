import discord
import os
from discord import message
from dotenv import dotenv_values
from discord import user
from discord.ext import tasks
import threading
import asyncio

env = dotenv_values(".env")

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


@tasks.loop(seconds = 1)
async def checkForAlert():
    while True:
        if(os.path.exists('./SendAlertNow.txt')):
            with open('./SendAlertNow.txt', 'r') as f:
                print("Sending Alert")
                lines = f.readlines()
                roomName = lines[0].strip()
                await alert(roomName)
            os.remove('./SendAlertNow.txt')
        await asyncio.sleep(1)

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

import logging, traceback
async def on_error(event, *args, **kwargs):
    print('Something went wrong!')
    logging.warning(traceback.format_exc())

client.loop.create_task(checkForAlert())
client.run(env['token'])