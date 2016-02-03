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


@app.route('/wiki/<city>')
def return_wiki_json(city):
  wiki = requests.get('https://en.wikipedia.org/w/api.php?action=' + \
                      'opensearch&search=' + city  + '&format=json').json()
  return jsonify({'res': wiki[1]})


if __name__ == '__main__':
  app.debug = True # used for dev only
  host = '0.0.0.0'
  app.run(host)
