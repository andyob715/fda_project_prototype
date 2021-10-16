document.addEventListener('DOMContentLoaded', function() 
{
  mapboxgl.accessToken = 'pk.eyJ1IjoiYW5kcmV3b2JyeWFuNzE1IiwiYSI6ImNrdTYzaWducjJlaHYyb3M4YzNpZno5ejIifQ.SgFhQv2n7X9enD8orpvISA';
  const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: [-94.91895,39.32746], // starting position [lng, lat]
  zoom: 4, // starting zoom
  trackResize: true 
  });
//FDA URL
var limit = 10;
var url = `https://api.fda.gov/food/enforcement.json?limit=${limit}`;

// Grab the data with d3
d3.json(url).then(async function (fdaresponse) {  

//Loop through data from the FDA
for (var i = 0; i < fdaresponse.results.length; i++) {

// Check to see if the state isn't Puerto Rico (we only want 50 US States due to complexity of mulitple zip API calls)
var state = fdaresponse.results[i].state;

if (state !== "PR") {
  
  // Running through the API to pull the features I went to add 
  var country = fdaresponse.results[i].country;
  var city = fdaresponse.results[i].city;
  var address_1 = fdaresponse.results[i].address_1;
  var reason_for_recall = fdaresponse.results[i].reason_for_recall;
  var firm = fdaresponse.results[i].recalling_firm;
  // Postal Code comes in as the 5+4, so i needed to trim that
  var postal_code = fdaresponse.results[i].postal_code.substring(0, 5);
  var voluntary_mandated = fdaresponse.results[i].voluntary_mandated;
  var fdaclass = fdaresponse.results[i].classification;

  var notificationtype =  fdaresponse.results[i].initial_firm_notification;
  // This is the secondary API URL to pull the postal code
  var zipurl_us = `https://api.zippopotam.us/us/${postal_code}`;

  // Starting the second D3 Json section with the ZIP results
  const zipresponse = await d3.json(zipurl_us)

  // Need lat and long to pull the marker coordinates
  var zip_lat = zipresponse.places[0].latitude;
  var zip_long = zipresponse.places[0].longitude;

  // Set the marker for reach of the coordinates with the pop-up that provides clarifying information
  var marker = new mapboxgl.Marker()
    .setLngLat([zip_long, zip_lat])
    .setPopup(
      new mapboxgl.Popup({ offset: 25 }) // add popups
        .setHTML(`<h3>${firm}</h3><hr><p>Recall Description: ${reason_for_recall}</p><hr><p>${voluntary_mandated}</p><hr><p>${fdaclass}</p>`))
    .addTo(map);
}
else {

  // This prints that the State is Puerto Rico and thus will only be printed to the console (no offense Puerto Rico)
  console.log(`State = ${state}, which is outside of the dataset`);
}
// create legend
const legend = document.getElementById('legend')
}
});

}, false);


