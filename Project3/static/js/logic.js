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

document.getElementById('fit').addEventListener('click', () => {
  map.fitBounds([
  [-157.7725, 21.3994444], // southwestern corner of the bounds
  [-56, 49] // northeastern corner of the bounds
  ]);
  });

  map.addControl(new mapboxgl.FullscreenControl());

//FDA URL
var limit = 100;
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
  if (fdaclass == "Class I"){
    var color_ = "#FBFA02"
  } else if (fdaclass == "Class II") {
    var color_ = "#FCC405"
  } else {
    var color_ = "#FC0505"
  }
  console.log(color_)
  var notificationtype =  fdaresponse.results[i].initial_firm_notification;
  // This is the secondary API URL to pull the postal code
  var zipurl_us = `https://api.zippopotam.us/us/${postal_code}`;
  // Starting the second D3 Json section with the ZIP results
  const zipresponse = await d3.json(zipurl_us)

  // Need lat and long to pull the marker coordinates
  var zip_lat = zipresponse.places[0].latitude;
  var zip_long = zipresponse.places[0].longitude;
  
  // Set the marker for reach of the coordinates with the pop-up that provides clarifying information
  var marker = new mapboxgl.Marker({
    color: color_,
    }).setLngLat([zip_long, zip_lat])
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

// added for potential search

(function(document) {
  'use strict';

  var TableFilter = (function(myArray) {
      var search_input;

      function _onInputSearch(e) {
          search_input = e.target;
          var tables = document.getElementsByClassName(search_input.getAttribute('data-table'));
          myArray.forEach.call(tables, function(table) {
              myArray.forEach.call(table.tBodies, function(tbody) {
                  myArray.forEach.call(tbody.rows, function(row) {
                      var text_content = row.textContent.toLowerCase();
                      var search_val = search_input.value.toLowerCase();
                      row.style.display = text_content.indexOf(search_val) > -1 ? '' : 'none';
                  });
              });
          });
      }

      return {
          init: function() {
              var inputs = document.getElementsByClassName('search-input');
              myArray.forEach.call(inputs, function(input) {
                  input.oninput = _onInputSearch;
              });
          }
      };
  })(Array.prototype);

  document.addEventListener('readystatechange', function() {
      if (document.readyState === 'complete') {
          TableFilter.init();
      }
  });

})(document);

// JQuery to bring in pagination
$(document).ready(function() {
  var totalRows = $('#tblData').find('tbody tr:has(td)').length;
  console.log(totalRows);
  var recordPerPage = 10;
  var totalPages = Math.ceil(totalRows / recordPerPage);
  console.log(`total # of pages${totalPages}`);
  var $pages = $('<div id="pages"><p>Pages: </p></div>');
  for (i = 0; i < totalPages; i++) {
    $('<span class="pageNumber">' + (i + 1) + '</span>').appendTo($pages);
  }
  $pages.appendTo('#tblData');

  $('.pageNumber').hover(
    function() {
      $(this).addClass('focus');
    },
    function() {
      $(this).removeClass('focus');
    }
  );

  $('table').find('tbody tr:has(td)').hide();
  var tr = $('table tbody tr:has(td)');
  for (var i = 0; i <= recordPerPage - 1; i++) {
    $(tr[i]).show();
  }
  $('span').click(function(event) {
    $('#tblData').find('tbody tr:has(td)').hide();
    var nBegin = ($(this).text() - 1) * recordPerPage;
    var nEnd = $(this).text() * recordPerPage - 1;
    for (var i = nBegin; i <= nEnd; i++) {
      $(tr[i]).show();
    }
  });
});




// Paste in from AM for circle chart thing
// Create the chart
var chart = am4core.create("chartdiv", am4plugins_sunburst.Sunburst);

// Add multi-level data
chart.data = [
  {
  name: "FDA Mandated",
  children:
  [
    { name: "Ongoing", value: 1 },
    { name: "Terminated", value: 12 },
    { name: "Completed", value: 0 }
  ]
  },
  {
  name: "Voluntary Recall",
  children:
  [
    { name: "Ongoing", value: 38 },
    { name: "Terminated", value: 933 },
    { name: "Completed",value:16}
  ]
  }];

// Define data fields
chart.dataFields.value = "value";
chart.dataFields.name = "name";
chart.dataFields.children = "children";