# Filename: index.py
# Author: Adam Novotny
# Purpose: main routing file for third party API resources

import os
import requests
from flask import Flask, render_template, request
from flask import redirect
from flask import jsonify, json

# variables
app = Flask(__name__)

# show index.html
@app.route('/')
def show_index():
  return render_template('index.html')

# verify city using googleapis
@app.route('/gmaps-json/<city>')
def gmaps_json(city):
  gmaps = requests.get('http://maps.googleapis.com/maps/api/geocode/json?address=' + \
                      city  + '&sensor=true').json()
  return jsonify({'gmaps-json': gmaps})

# return weather json
@app.route('/weather-json', methods=['GET'])
def weather_json():
  lat = request.args.get('lat')
  lon = request.args.get('lon')
  weather = requests.get('http://api.openweathermap.org/data/2.5/forecast/daily?' + 
                      'lat=' + lat + '&lon=' + lon + '&cnt=16&units=imperial&APPID=' + 
                      'ef49a278b6557235d3372d9c5416d4f6').json()
  return jsonify({'weather-json': weather})

# return Wiki json
@app.route('/wiki-json/<city>')
def wiki_json(city):
  wiki = requests.get('https://en.wikipedia.org/w/api.php?action=' + \
                      'opensearch&search=' + city  + '&format=json').json()
  return jsonify({'wiki-json': wiki})

# return NYT json
@app.route('/nyt-json/<city>')
def nyt_json(city):
  key = '532e9278d93c9c359096abdbbf5d65fd:14:74311752';
  nyt = requests.get('http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + \
                      city  + '&sort=newest&api-key=' + key).json()
  return jsonify({'nyt-json': nyt})

# return current time json
@app.route('/time-json')
def time_json():
    import time

    # read latitude and longitude parameters
    lat = request.args.get('lat')
    lng = request.args.get('lng')

    TIMEZONE_DB_KEY = 'ZG48IWJBEN5R'

    url = 'http://api.timezonedb.com/'
    params = {
        'key': TIMEZONE_DB_KEY,
        'lat': lat,
        'lng': lng,
        'format': 'json'
    }

    response = requests.get(url, params=params).json()

    # compute local time at given coordinates
    timestamp = float(response['timestamp'])
    local_time = time.gmtime(timestamp)


    # format time as <hour>:<minute> <AM/PM>
    time_string = time.strftime('%I:%M %p', local_time)

    return jsonify({
        'time':      time_string,
        'timestamp': timestamp,
        'zone_abbr': response['abbreviation'],
        'zone_name': response['zoneName']
    })




if __name__ == '__main__':
  app.debug = True # used for dev only
  host = '0.0.0.0'
  app.run(host)
