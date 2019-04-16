// Store API 
const baseUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create Features
d3.json(baseUrl, function(data) {
    createFeatures(data.features);
});

// Color selector
function colorMag(mag) {
    if (mag <= 0) {
        color = "#38d807";
    }
    else if (mag <= 1) {
        color = "#c5e874";
    }
    else if (mag <= 2) {
        color = "#dcbb39";
    }
    else if (mag <= 3) {
        color = "#eba611";
    }
    else if (mag <= 4) {
        color = "#da7509";
    }
    else {
        color = "#de4b15";
    };
    return color;
};  

// Create Tooltips
function createFeatures(data) {
     
    let earthquakeData = L.geoJSON(data, {
        onEachFeature: function(feature, layer) {
            layer.bindPopup(
                `<h3>Location: ${feature.properties.place}</h3><hr>
                <h4>Magnitude: ${feature.properties.mag}</h4><hr>
                <h5>Date: ${new Date(feature.properties.time)}</h5>`);
        },
        pointToLayer: function (feature, latlng) {
            return new L.circle(
                latlng, {
                radius: (feature.properties.mag * 20000),
                fillColor: colorMag(feature.properties.mag),
                color: "#000000",
                stroke: true,
                weight: 1,
                fillOpacity: 0.8
                }
            );
        }
    });
  
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakeData);
};

// Create Map  
function createMap(earthquakeData) {
    // Define map layers
    const satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token={accessToken}", {
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });
    const darkMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token={accessToken}", {
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });
    const outdoorsMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token={accessToken}", {
        maxZoom: 18,
        id: "mapbox.outdoors",
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    const baseMaps = {
        "Satellite Map": satelliteMap,
        "Grayscale": darkMap,
        "Outdoors": outdoorsMap
    };

    // Creat a layer for the tectonic plates
    let tectonicPlates = new L.LayerGroup();

    // Create overlay object to hold our overlay layer
    const overlayMaps = {
        "Earthquakes": earthquakeData
    };

    // Create a new map
    const myMap = L.map("map", {
        center: [39.508362, -98.252513],
        zoom: 3,
        layers: [satelliteMap, earthquakeData]
    });

    // Adding tile layer to the map
    L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    }).addTo(myMap);

    // Create a layer control containing our baseMaps
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Set up the legend
    let legend = L.control({
        position: "bottomright"
    });

    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
        let level = [0, 1, 2, 3, 4, 5]

        for (let i = 0, ii = level.length; i < ii; i++) {
            div.innerHTML += 
                '<i style="background:' + colorMag(level[i] + 1) + '"></i> ' + 
                + level[i] + (level[i + 1] ? ' - ' + level[i + 1] + '<br>' : ' + ');
        };
        return div;
    };
    
    // Adding legend to the map
    legend.addTo(myMap);

};

  



    


    