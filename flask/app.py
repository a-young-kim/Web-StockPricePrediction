import numpy as np
from flask import Flask, request, jsonify
from crawling import *

app = Flask(__name__)

@app.route('/', methods=['POST'])
def get_data():
    company = request.json
    print(crawling(company))

    result = {'message': 'Data received successfully', 'data': company}
    return jsonify(result)

if __name__ == '__main__':   
    app.run(host='localhost', port=5000, debug=True)
