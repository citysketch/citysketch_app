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


if __name__ == '__main__':
  app.debug = True # used for dev only
  host = '0.0.0.0'
  app.run(host)
