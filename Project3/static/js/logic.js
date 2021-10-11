var myMap = L.map("ma p-id", {
  center: [37.09, -95.71],
  zoom: 5
});

// Add a tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);


//FDA URL
var limit = 2
var url = `https://api.fda.gov/food/enforcement.json?limit=${limit}`

// Grab the data with d3
d3.json(url).then(function(fdaresponse) 

  {

  //Loop through data
    for (var i = 0; i < fdaresponse.results.length; i++) 

      {
        
        // Running through the API to pull the features I went to add 
        var country = fdaresponse.results[i].country
        var city = fdaresponse.results[i].city
        var address_1 = fdaresponse.results[i].address_1
        var reason_for_recall = fdaresponse.results[i].reason_for_recall
        // Postal Code comes in as the 5+4, so i needed to trim that
        var postal_code = fdaresponse.results[i].postal_code.substring(0,5)
        var voluntary_mandated = fdaresponse.results[i].voluntary_mandated

        // This is the secondary API URL to pull the postal code
        var zipurl = `https://api.zippopotam.us/us/${postal_code}`  

            // Second D3 to separate out the lat/long
            d3.json(zipurl).then(function(zipresponse) 

                {
                  // Need lat and long to pull the marker coordinates
                  var zip_lat = zipresponse.places[0].latitude;
                  var zip_long = zipresponse.places[0].longitude;
                
                  L.marker([zip_lat,zip_long])          
                  .addTo(myMap)

                })
                console.log(city)
            // L.bindPopup("<h1>" + city + "</h1> <hr> <h3>Reason: " + reason_for_recall + "</h3> <hr> <h3>Type: " + voluntary_mandated)


              
        } 
    }
  );