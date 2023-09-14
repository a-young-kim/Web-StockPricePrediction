import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from crawling import *

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

if __name__ == '__main__':   
    app.run(host='localhost', port=5000, debug=True)
