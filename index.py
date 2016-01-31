import os
from flask import Flask, render_template, request
from flask import redirect

# variables
app = Flask(__name__)

# show index.html
@app.route("/")
def showIndex():
  return render_template('index.html')

if __name__ == '__main__':
  app.debug = True # used for dev only
  host = '0.0.0.0'
  app.run(host)
