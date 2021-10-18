
# Import Module
import json
import requests
from flask import Flask

# Import our pymongo library, which lets us connect our Flask app to our Mongo database.
import pymongo


def scrape():

        # Create connection variable
    conn = 'mongodb://localhost:27017'

    # Pass connection to the pymongo instance.
    client = pymongo.MongoClient(conn)

    # Connect to a database. Will create one if not already available.
    db = client.fda_db

# Drops collection if available to remove duplicates
    db.items.drop()

    # Create Dictionarys
    limit = 100
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
        recalling_firm = fda_response_json["results"][i]["recalling_firm"]
        recall_class = fda_response_json["results"][i]["classification"]
        recall_init_date = fda_response_json["results"][i]["recall_initiation_date"]
        recall_year = recall_init_date[0:4]
        try:

            zip_response = requests.get(zipurl)
            zip_response_json = zip_response.json()

            zip_lat = zip_response_json["places"][0]['latitude']     
            zip_long = zip_response_json["places"][0]['longitude']

        # Dictionary to be inserted as a MongoDB document
            post = {
            'country': country,
            'city': city,
            'recalling_firm': recalling_firm,
            'address': address_1,
            'recall reason': reason_for_recall,
            'postal code':postal_formatted,
            'recall type': voluntary_mandated,
            'latitude' : zip_lat,
            'longitude' : zip_long,
            'classification': recall_class,
            'recall_year':recall_year
            }
        
            db.items.insert_one(post)
    
        except:
            print(f'{postal_formatted} could not return a result')

    return