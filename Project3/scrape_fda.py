
# Import Module
import json
from re import I
import requests
from flask import Flask

# Import our pymongo library, which lets us connect our Flask app to our Mongo database.
import pymongo

# Create an instance of our Flask app.
app = Flask(__name__)

# Create connection variable
conn = 'mongodb://localhost:27017'

# Pass connection to the pymongo instance.
client = pymongo.MongoClient(conn)

# Connect to a database. Will create one if not already available.
db = client.fda_db

def scrape():

# Drops collection if available to remove duplicates
    db.items.drop()


    # Create Dictionarys
    limit = 2
    url = "https://api.fda.gov/food/enforcement.json?limit="
    query_url = f'{url}{limit}'
    # Dictionary to JSON Object using dumps() method
    fda_response = requests.get(query_url)
    fda_response_json = fda_response.json() 

    for i in range(limit):
        country = fda_response_json["results"][i]["country"]
        city = fda_response_json['results'][i]['city'] 
        address_1 = fda_response_json["results"][i]["address_1"]
        reason_for_recall = fda_response_json["results"][i]["reason_for_recall"]
        postal_code = fda_response_json["results"][i]["postal_code"]
        postal_formatted = postal_code[0:5]
        zipurl = f'https://api.zippopotam.us/us/{postal_formatted}'
        voluntary_mandated = fda_response_json["results"][i]["voluntary_mandated"]

        zip_response = requests.get(zipurl)
        zip_response_json = zip_response.json()

        zip_lat = zip_response_json["places"][0]['latitude']     
        zip_long = zip_response_json["places"][0]['longitude']

        # Dictionary to be inserted as a MongoDB document
        post = {
            'country': country,
            'city': city,
            'address': address_1,
            'recall reason': reason_for_recall,
            'postal code':postal_formatted,
            'recall type': voluntary_mandated,
            'latitude' : zip_lat,
            'longitude' : zip_long
        }

    db.items.insert_one(post)
    return

scrape()