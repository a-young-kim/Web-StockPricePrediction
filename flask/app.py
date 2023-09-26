import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from crawling import *
from kobert import *

app = Flask(__name__)

@app.route('/', methods=['POST'])
def get_data():
    data = request.json

    result = crawling(data["company"])
    print(result)

    data = {
        'title': result[0],
        'company': result[1],
        'date' : result[2],
    }
    
    return jsonify(data)

@app.route('/kobert', methods=['POST'])
def RunModel():
    data = request.json
    result = kobert(data["title"])
    
    result['company'] = data['company']
    result['date'] = data['date']
    
    return jsonify(result)

if __name__ == '__main__':   
    app.run(host='localhost', port=5000, debug=True)
