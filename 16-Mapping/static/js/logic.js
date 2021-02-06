// URL Earthquake

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
//console.log(queryUrl);

//-----markerSize function--------------------
function markerSize(magnitude) {
  return magnitude * 5;
}

//-----colorScale function--------------------
function colorScale(magnitude) {
  return magnitude >= 5 ? '#D73027':
         magnitude >= 4 ? '#FC8D59':
         magnitude >= 3 ? '#FEE08B':
         magnitude >= 2 ? '#D9EF8B':
         magnitude >= 1 ? '#91CF60':
                          '#1A9850';
}




function createFeatures(earthquakeData) {
  
  // Function for feature pop-up
  function popUpText(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
      "<p>Magnitude: " + feature.properties.mag + "</p>" +
      "<p>Type: " + feature.properties.type + "</p>");
  }
  
  // Basic marker features
  var baseMarkerOptions = {
    color: '#191919',
    weight: 1,
    fillOpacity: 0.6
  }

  // Create GeoJSON layer containing the features array
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, baseMarkerOptions);
    }, 
    style: function(feature) {
      return {
        radius: markerSize(feature.properties.mag),
        fillColor: colorScale(feature.properties.mag)
      }
    },
    onEachFeature: popUpText
  });

  // Send earthquake layer to the createMap function
  createMap(earthquakes);
}

// GET request for JSON data
d3.json(queryUrl, function(data) {
  createFeatures(data.features);
});



function createMap(earthquakes) {
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    });
  
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "dark-v10",
      accessToken: API_KEY
    });

   var outdoorsmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors,\
      <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.outdoors",
      accessToken: API_KEY
    });
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap,
      "Outdoor Map": outdoorsmap
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      "Earthquakes": earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("mapid", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [streetmap, earthquakes]
    });

    //Layer Control
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);




  var legend = L.control({position: 'bottomright'});
  legend.onAdd = function() {
  
  //create a legend element
  var div = L.DomUtil.create('div', 'legend');

  //create labels and values to find colors
  var labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
  var grades = [0.5, 1.5, 2.5, 3.5, 4.5, 5.5];

  //create legend html
  div.innerHTML = '<div><strong>Magnitude</strong></div>';
  for(var i = 0; i < grades.length; i++) {
      div.innerHTML += '<i style = "background:' + colorScale(grades[i]) + '">&nbsp;</i>&nbsp;&nbsp;'
      + labels[i] + '<br/>';
    };
    return div;
  };

  //add legend to map
  legend.addTo(myMap);

 }