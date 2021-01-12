// console.log("hello world");
const API_KEY = "pk.eyJ1IjoiZXpnYWxsbzg3IiwiYSI6ImNraWlqOWNkZzBhMTEyeW9kZTFsYWV2eXMifQ.FIAMf-ix0ER-CwPLhc02xg"


var summary_data = "/diversity/diversity_stats";
var topAndLast4 = "/diversity/geo_data";

function init(){
  d3.json(topAndLast4, function(data){ 
    d3.json(summary_data, statsData =>{ 
    
      // console.log(data);
      // console.log(statsData);      
   
      createFeatures("english");
      populateStats("english");

      d3.selectAll("#league").on("change", updateLeague);

    })
  })
}

init();

function updateLeague(){
  
  d3.json(topAndLast4, function(data){
    
    d3.json(summary_data, statsData =>{
      
      // console.log(statsData);
      // console.log(data);

      // reseting map containers and updating
      var container1 = L.DomUtil.get('maptop4');
        if(container1 != null){
          container1._leaflet_id = null;
        }
      var container2 = L.DomUtil.get('maplast4');
        if(container2 != null){
          container2._leaflet_id = null;
        } 
        
      var league = d3.select("#league").node().value;
      // console.log(league);

      createFeatures(league);

      // reseting stats divs and updating
      d3.select("tbody").selectAll('tr').remove();
      d3.select("#top4MapHeader").selectAll('h3').remove();
      d3.select("#last4MapHeader").selectAll('h3').remove();

      populateStats(league);

    })
  })
}

function populateStats(league) {
  // console.log(league);
  d3.json(summary_data, data =>{
   
    
    // console.log(summary_data);

    var topLeagueStat = "";
    var lastLeagueStat = "";

    data.forEach(x => {
      Object.entries(x).forEach(([key, value])=>{
        if (value == league){
          topLeagueStat = x.top4_national_players;
          lastLeagueStat = x.last4_national_players;
        }
      })
    })

    // console.log(topLeagueStat);
    // console.log(lastLeagueStat);
    
    var tbody = d3.select("tbody");
    var row1 = tbody.append('tr');
    var row2 = tbody.append('tr');
    var row3 = tbody.append('tr');

    row1.append('td').text(`The average ${league} nationality percentage for the top4 teams of the ${league} league is`);
    row1.append('td').text(topLeagueStat + "%");

    row2.append('td').text(`The average ${league} nationality percentage for the last4 teams of the ${league} league is`);
    row2.append('td').text(lastLeagueStat + "%");
    row3.append('td');
    row3.append('td');
    
    d3.select("#top4MapHeader").append("h3").text(`${league} League Top Four Teams Data`);
    d3.select("#last4MapHeader").append("h3").text(`${league} League Last Four Teams Data`);
  })
}

function createFeatures(league) {
    
  console.log(league);
  // var league = league.toString();
  
  d3.json(topAndLast4, function(data){
    // console.log(data);

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(features, layer) {

        layer.bindPopup("<p>" + "Nationality: " + features.properties.nationality + "</p><p>" + 
        "Nationality %:  " + features.properties.description  +
        "</p><p>" + "League: " + features.properties.league + "</p>");
    }

    var geojson = data.map((d) => d.features);
    console.log(geojson);

    var topTeamsData = "";
    var lastTeamsData = "";

    geojson.forEach(x => {
      Object.entries(x).forEach(([key, value])=>{
        if (key == "properties"){
          // console.log(value);
          var target = value.league;
          // console.log(target);
          if (league == target) {
            var leagueData = geojson.filter((d) => d.properties.league == league);
            // console.log(leagueData);
            topTeamsData = leagueData.filter((d) => d.properties.classed == "top4");
            lastTeamsData = leagueData.filter((d) => d.properties.classed == "last4");
          }
        }
      })
    })

    // Create a GeoJSON layer containing the features array on the object
    // Run the onEachFeature function once for each piece of data in the array  
    var diversityTop = L.geoJSON(topTeamsData, {
      pointToLayer: function (features, latlng) {
        var geojsonMarkerOptions = {
            radius: features.properties.description/2,
            fillColor: getColour(features.properties.description),
            color: "black",
            weight: 1,
            opacity: 1,
            fillOpacity: 1
        };       
        return L.circleMarker(latlng, geojsonMarkerOptions)    
      },
      
      onEachFeature: onEachFeature
    });
    
    var diversityLast = L.geoJSON(lastTeamsData, {
      pointToLayer: function (features, latlng) {
        var geojsonMarkerOptions = {
            radius: features.properties.description/2,
            fillColor: getColour(features.properties.description),
            color: "black",
            weight: 1,
            opacity: 1,
            fillOpacity: 1
        };
        return L.circleMarker(latlng, geojsonMarkerOptions)
      },
      
      onEachFeature: onEachFeature
    });
    
    // Sending our layer to the createMap function
    createMap(diversityTop, "maptop4");
    createMap(diversityLast, "maplast4");
  })
}

function createMap(diversity, div){

  // Define streetmap and darkmap layers
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

    // Define a baseMaps object to hold our base layers
  var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
      Diversity: diversity
  };
  
  // var map = new L.Map(div);

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map(div, {
      center: [
        14.5994, 28.6731
      ],
      zoom: 2,
      layers: [streetmap, diversity] 
  });
    
  //   Create a layer control
  //   Pass in our baseMaps and overlayMaps
  //   Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
  }).addTo(myMap);
}

function getColour(percentage) {
  var color = "";

  if (percentage > 89) {
    color = "#ef4f4f";
  }
  else if (percentage > 79) {
    color = "#790c5a";
  }
  else if (percentage > 69) {
    color = "#01c5c4";
  }
  else if (percentage > 59) {
    color = "#cc0e74";
  }
  else if (percentage > 49) {
    color = "#c0e218";
  }
  else if (percentage > 39) {
    color = "#6a097d";
  }
  else if (percentage > 29) {
    color = "#5eaaa8";
  }
  else if (percentage > 19) {
    color = "#e6739f";
  }
  else if (percentage > 12) {
    color = "#c060a1";
  }
  else if (percentage > 5) {
    color = "#c060a1";
  }
  else {
    color = "#f1d4d4";
  }

  return color;
}
