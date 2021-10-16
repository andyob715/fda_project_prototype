from flask import Flask, render_template, redirect
import pymongo
import json
from flask_pymongo import PyMongo
import scrape_fda


app = Flask(__name__)

# Use flask_pymongo to set up mongo connection
app.config["MONGO_URI"] = "mongodb://localhost:27017/fda_db"
mongo = PyMongo(app)


@app.route("/")
def index():
    items = mongo.db.items.find()
    return render_template("index.html", items = items)
    
# @app.route("/scrape")
# def scrape():
#     items = mongo.db.items
#     items_data = scrape_fda.scrape()
#     items.update_many({}, items_data, upsert=True)
#     return redirect("/", code=302)


if __name__ == "__main__":
    app.run(debug=True)