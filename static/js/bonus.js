// Create the tile layer that will be the background of our map
API_KEY='pk.eyJ1IjoibWltZXp6eiIsImEiOiJja3didGk2cGswN3Y0MnhsaDd1ODJnYjNxIn0.TEgtHxG4pRwHgqOmd-DJeg';

//get data for plates





//get data for earthquakes 
var magnitude=[];
var coordinates=[];
var place= [];
var earthquakedata=[];


d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson').then((data)=>{
    console.log(data);
    data.features.forEach((row)=>{
    magnitude.push(row.properties.mag);
    coordinates.push([row.geometry.coordinates[1],row.geometry.coordinates[0]]);
    place.push(row.properties.place)});

    
    for (var i = 0; i < coordinates.length; i++) {
      var color='';
      switch (true) {
        case (magnitude[i]<=0):
          color='rgb(144,238,144)'
          break;
        case (magnitude[i]>0 && magnitude[i]<=1):
          color='rgb(124,252,0)'
          break;
        case (magnitude[i]>1 && magnitude[i]<=2):
          color='rgb(255,255,0)'
          break;
        case (magnitude[i] >2 && magnitude[i]<=3):
          color='rgb(255,140,0)'
          break;
        case (magnitude[i] >3  && magnitude[i]<=4):
          color='rgb(255,69,0)'
          break;
        case (4<magnitude[i]<=5):
          color='rgb(255,0,0)'
          break;  
        case (magnitude[i]>5):
          color='rgb(220,20,60)'
          break;
        };

    // Add circles to map
    earthquakedata.push(
      L.circle(coordinates[i], {
        fillOpacity: 0.75,
        color: "white",
        weight:0.5,
        fillColor: color,
        // Adjust radius
        radius: Math.abs(magnitude[i]) * 20000
    })
    .bindPopup("<h1>" + place[i] + "</h1> <hr> <h3>Magnitude: " + magnitude[i] + "</h3>"));
    };

var earthquakegroup=L.layerGroup(earthquakedata);
console.log(earthquakegroup);

var plates=[]

var mapStyle = {
    color: "white",
    fillColor: "pink",
    fillOpacity: 0.5,
    weight: 1.5
  };

d3.json('static/tectonic_data/PB2002_plates.json').then((data)=>{
    console.log(data);
    plates.push(L.geoJson(data,{
        style:mapStyle
    }));

    console.log(plates);
    var tectonicplates=L.layerGroup(plates);
    console.log(tectonicplates);


// map Layers
var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    // tileSize: 512,
    maxZoom: 18,
    // zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
  });

var outdoormap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    // zoomOffset: -1,
    id: "outdoors-v11",
    accessToken: API_KEY
  });

  var grayscalemap=L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    // zoomOffset: -1,
    id: "light-v10",
    accessToken: API_KEY
  });


// // Create a baseMaps object
var baseMaps = {
    "Satellite Map": satellitemap,
    "Grayscale Map": grayscalemap,
    'Outdoor Map': outdoormap
  };

// // Create an overlay object
var overlayMaps = {
    "Earthquakes": earthquakegroup,
    "Tectonic Plates": tectonicplates
  };

// // Define a map object
var myMap = L.map("map", {
    center: [39.742043, -104.991531],
    zoom: 5,
    layers: [grayscalemap, earthquakegroup,tectonicplates]
  });

// // Pass our map layers into our layer control
// // Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

// Set up the legend
var legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "legend");
  var grades = ['<=0','0-1','1-2','2-3','3-4','4-5','>5'];
  var colors = ['rgb(144,238,144)',
  'rgb(124,252,0)',
  'rgb(255,255,0)',
  'rgb(255,140,0)',
  'rgb(255,69,0)',
  'rgb(255,0,0)',
  'rgb(220,20,60)'
];

div.innerHTML = '<div><b> Magnitude<b></div>';

grades.forEach(function(grade, index){
    div.innerHTML +='<i style="background: ' + colors[index] + '">&nbsp;&nbsp;&nbsp;&nbsp;</i>&nbsp;' + grade +"<br>";});

return div;};


// Adding legend to the map
legend.addTo(myMap);

});
});


