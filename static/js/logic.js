// Create the tile layer that will be the background of our map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  tileSize:512,
  zoomOffset:-1,
  accessToken:'pk.eyJ1IjoibWltZXp6eiIsImEiOiJja3didGk2cGswN3Y0MnhsaDd1ODJnYjNxIn0.TEgtHxG4pRwHgqOmd-DJeg'
});


var map = L.map('map').setView([39.742043, -104.991531], 5);

  // Add our 'lightmap' tile layer to the map
lightmap.addTo(map);

var magnitude=[];
var coordinates=[];
var place= [];

function createcircles(response) {
  
    // Pull the magnitude andcoordinates off of response.data
    response.features.forEach((row)=>{
        magnitude.push(row.properties.mag);
        coordinates.push([row.geometry.coordinates[1],row.geometry.coordinates[0]]);
        place.push(row.properties.place);});

    for (var i = 0; i < coordinates.length; i++) {
      var color=[];
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
      L.circle(coordinates[i], {
        fillOpacity: 0.75,
        color: "white",
        weight:0.5,
        fillColor: color,
        // Adjust radius
        radius: Math.abs(magnitude[i]) * 20000
    })
    .bindPopup("<h1>" + place[i] + "</h1> <hr> <h3>Magnitude: " + magnitude[i] + "</h3>").addTo(map);};

    // Set up the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      var grades = ['<=0','0-1','1-2','2-3','3-4','4-5','>5'];
      var colors = ['rgb(144,238,144)',
      'rgb(124,252,0)',
      'rgb(255,255,0)',
      'rgb(255,140,0)',
      'rgb(255,69,0)',
      'rgb(255,0,0)',
      'rgb(220,20,60)'
    ];
      var labels = [];

    grades.forEach(function(grade, index){
      labels.push('<div style="background-color: ' + colors[index] + '"></li>' + grade +"</div>");
  })

  div.innerHTML += "<b>Earthquake Magnitude</b>" + "<ul>" + labels.join("") +"</ul>";
  return div;

};

  // Adding legend to the map
  legend.addTo(map);
};

var geojsonurl='https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

d3.json(geojsonurl).then(function(data) {
    console.log(data);
    createcircles(data);
    // data.features.forEach((row)=>{
    //   magnitude.push(row.properties.mag);
    //   coordinates.push([row.geometry.coordinates[1],row.geometry.coordinates[0]]);
    //   place.push(row.properties.place);});

    //   for (var i = 0; i < coordinates.length; i++) {
    //     console.log(coordinates[i],Math.abs(magnitude[i]),place[i])
    //   };
  });