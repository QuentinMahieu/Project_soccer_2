import numpy as np
from flask import Flask, jsonify
from flask import Response,json
from flask_cors import CORS, cross_origin
from flask import Flask, render_template
##if using sql database##
# import sqlalchemy
# from sqlalchemy.ext.automap import automap_base
# from sqlalchemy.orm import Session
# from sqlalchemy import create_engine, func
##if using mongodb##
#!pip install pymongo
#!pip install dnspython
from pymongo import MongoClient
# from config import mongo
mongo = "MonashBootcamp"
#################################################
# Database Setup
#################################################
dbname = "Soccer_db"
#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Flask Routes
#################################################

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/financial")
def financial():
    return  render_template("financial.html")

@app.route("/correlation")
def correlation():
    return  render_template("correlation.html")

@app.route("/scatter/data", methods=["GET"])
def scatterData():
    #create connection
    import time
    start = time.time()
    client = MongoClient(f"mongodb+srv://Quentin:{mongo}@cluster0.ddqv6.mongodb.net/{dbname}?retryWrites=true&w=majority")
    soccer_db = client.get_database('Soccer_db')
    team_stats_col = soccer_db.team_stats.find({},{'_id': False})
    data_scatter = []
    for doc in team_stats_col:
        data_scatter.append(doc)
    client.close()
    end = time.time()
    print(end - start)
    return  (jsonify(data_scatter))

@app.route("/corr/data", methods=["GET"])
def correlationData():
    #create connection
    import time
    start = time.time()
    client = MongoClient(f"mongodb+srv://Quentin:{mongo}@cluster0.ddqv6.mongodb.net/{dbname}?retryWrites=true&w=majority")
    soccer_db = client.get_database('Soccer_db')
    corr_col = soccer_db.correlation.find({},{'_id': False})
    data_corr = []
    for doc in corr_col:
        data_corr.append(doc)
    client.close()
    end = time.time()
    print(end - start)
    return  (jsonify(data_corr))

@app.route("/financials/comparison/data", methods=["GET"])
def comparisonData():
    #create connection
    import time
    start = time.time()
    client = MongoClient(f"mongodb+srv://Louis:{mongo}@cluster0.ddqv6.mongodb.net/{dbname}?retryWrites=true&w=majority")
    soccer_db = client.get_database('Soccer_db')
    table = soccer_db.summary_financials.find({},{'_id': False})
    data = []
    for doc in table:
        data.append(doc)
    client.close()
    end = time.time()
    print(end - start)
    return  (jsonify(data))

@app.route("/financials/hero/data", methods=["GET"])
def heroData():
    #create connection
    import time
    start = time.time()
    client = MongoClient(f"mongodb+srv://Louis:{mongo}@cluster0.ddqv6.mongodb.net/{dbname}?retryWrites=true&w=majority")
    soccer_db = client.get_database('Soccer_db')
    table = soccer_db.transfer_summary.find({},{'_id': False})
    data = []
    for doc in table:
        data.append(doc)
    client.close()
    end = time.time()
    print(end - start)
    return  (jsonify(data))

@app.route("/financials/top4/data", methods=["GET"])
def top4_financialData():
    #create connection
    import time
    start = time.time()
    client = MongoClient(f"mongodb+srv://Louis:{mongo}@cluster0.ddqv6.mongodb.net/{dbname}?retryWrites=true&w=majority")
    soccer_db = client.get_database('Soccer_db')
    table = soccer_db.top4_financials.find({},{'_id': False})
    data = []
    for doc in table:
        data.append(doc)
    client.close()
    end = time.time()
    print(end - start)
    return  (jsonify(data))


if __name__ == '__main__':
    app.run(debug=True)
