<br />
<p align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h1 align="center">ZONA</h1>
</p>

![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white) ![Arduino](https://img.shields.io/badge/-Arduino-00979D?style=for-the-badge&logo=Arduino&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) ![TravisCI](https://img.shields.io/badge/travisci-%232B2F33.svg?style=for-the-badge&logo=travis&logoColor=white) ![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)

[![License: LGPL v3](https://img.shields.io/badge/licence-GPL3-red?style=flat-square)](https://www.gnu.org/licenses/lgpl-3.0) [![Build Status](https://app.travis-ci.com/etinaude/big-sibiling.svg?token=Mg4pYy6vCtZFxREWyExu&branch=main)](https://app.travis-ci.com/etinaude/big-sibiling)

## About
Zona is a system that allows users to remotely monitor foot traffic data within a space. Zona uses AI to detect how many people are within that space using a set of low cost cameras.
This github stores all of the code relating to the project.

## Backend
The uses a Flask server and interfaces with a MongoDB. It also hosts a Discord bot for notifications.

### Prerequisites
Python 3.8 or later and PIP.

### Installing
Run `pip install -r requirements.txt` on the root folder.  
Create a .env file with the following format:
```
mongoPw=[MongoDB password
mongoUsr=[MongoDB username]
token=[Discord bot token]
```

### Usage
Run `app.py`

## Frontend
The Fontend includes the Website.

### Prerequisites
npm 7.2 or later and react-script

### Installing
Run `npm i` in the frontend folder.

### Usage
See frontend readme.

## Esp32
The Esp32 folder contains the code to be loaded onto the Esp32 cameras

### Prerequisites
Arduino

### Installing

### Usage

## Contact

Etienne Naude - software@etinaude.dev

Ben Elwood - belwood4@gmail.com

Jordan Hallows - ?
