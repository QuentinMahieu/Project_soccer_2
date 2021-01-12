from flask import Flask, jsonify
from flask import Response,json
from flask_cors import CORS, cross_origin
from flask import Flask, render_template, request, redirect

from pymongo import MongoClient
import scrape_ranking

mongo = "MonashBootcamp"

#################################################
# Database Setup
#################################################
dbname = "Soccer_db"
client = MongoClient(f"mongodb+srv://Quentin:{mongo}@cluster0.ddqv6.mongodb.net/{dbname}?retryWrites=true&w=majority")
soccer_db = client.get_database('Soccer_db')
#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Flask Routes
#################################################

@app.route("/",methods=['GET', 'POST'])
def home():
    
    if request.method == 'POST':
        select = request.form.value('league')
    else :
        select = "England"
    # Run the scrape function
    ranking_data = scrape_ranking.scrape(select)
    # for record in ranking_data:
    #     print(record["Ranking"])
    return render_template("index.html", ranking=ranking_data)

@app.route("/financial")
def financial():
    return  render_template("financial.html")

@app.route("/correlation")
def correlation():
    return  render_template("correlation.html")

@app.route("/scatter/data", methods=["GET"])
def scatterData():
    #create connection

    team_stats_col = soccer_db.team_stats.find({},{'_id': False})
    data_scatter = []
    for doc in team_stats_col:
        data_scatter.append(doc)

    return  (jsonify(data_scatter))

@app.route("/corr/data", methods=["GET"])
def correlationData():
    #create connection
    app.config['JSON_SORT_KEYS'] = False

    corr_col = soccer_db.correlation.find({},{'_id': False})
    data_corr = []
    for doc in corr_col:
        data_corr.append(doc)

    return  (jsonify(data_corr))

@app.route("/financials/comparison/data", methods=["GET"])
def comparisonData():
   
    table = soccer_db.summary_financials.find({},{'_id': False})
    data = []
    for doc in table:
        data.append(doc)

    return  (jsonify(data))

@app.route("/financials/hero/data", methods=["GET"])
def heroData():

    table = soccer_db.transfer_summary.find({},{'_id': False})
    data = []
    for doc in table:
        data.append(doc)

    return  (jsonify(data))

@app.route("/financials/top4/data", methods=["GET"])
def top4_financialData():

    table = soccer_db.top4_financials.find({},{'_id': False})
    data = []
    for doc in table:
        data.append(doc)

    return  (jsonify(data))

@app.route("/diversity")
def diversity():

    return  render_template("z.html")

@app.route("/diversity/diversity_stats", methods=["GET"])
def summary_diversity_stats():
    #create connection
    import time
    start = time.time()
    client = MongoClient(f"mongodb+srv://Ezequiel:{mongo}@cluster0.ddqv6.mongodb.net/{dbname}?retryWrites=true&w=majority")
    soccer_db = client.get_database('Soccer_db')
    collection = soccer_db.summary_diversity_stats.find({},{'_id': False})
    data = []
    for doc in collection:
        data.append(doc)
    client.close()
    end = time.time()
    print(end - start)
    return  (jsonify(data))

@app.route("/diversity/geo_data", methods=["GET"])
def geo_data():
    #create connection
    import time
    start = time.time()
    client = MongoClient(f"mongodb+srv://Ezequiel:{mongo}@cluster0.ddqv6.mongodb.net/{dbname}?retryWrites=true&w=majority")
    soccer_db = client.get_database('Soccer_db')
    collection = soccer_db.geo_data.find({},{'_id': False})
    data = []
    for doc in collection:
        data.append(doc)
    client.close()
    end = time.time()
    print(end - start)
    return  (jsonify(data))


if __name__ == '__main__':
    app.run(debug=True)
