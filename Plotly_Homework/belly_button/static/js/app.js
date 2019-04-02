// @TODO: Complete the following function that builds the metadata panel
function buildMetadata(sample) {
  let url = "/metadata/" + sample;
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(url).then(function(data) {
    console.log(data);
    // Use d3 to select the panel with id of `#sample-metadata`
    let table = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    table.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    let meta_sample = Object.entries(data);
    meta_sample.forEach( sample_data =>{
      // Hint: Inside the loop, you will need to use d3 to append new
      table
      .append("li")
      .text(`${sample_data[0]}: ${sample_data[1]}`) // tags for each key-value in the metadata.
    })
  });
};


function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  let url1 = "/samples/" + sample;
  d3.json(url1).then(function(pData) {
    console.log(pData)
    let combined_data = [];

    for(i = 0; i < pData.sample_values.length; i++) {
      combined_data.push({
        "otu_ids": pData.otu_ids[i],
        "labels": pData.otu_labels[i],
        "values": pData.sample_values[i]
      });
    };

    let sorted_data = combined_data.sort(function(first, second) {
      return second.values-first.values;
    });
    sorted_data = sorted_data.slice(0, 10);
    console.log(sorted_data)

    let sorted_ids = [];
    let sorted_values = [];
    let sorted_labels = [];

    for (i = 0; i < sorted_data.length; i++) {
      sorted_ids.push(sorted_data[i].otu_ids)
      sorted_values.push(sorted_data[i].values)
      sorted_labels.push(sorted_data[i].labels)
    };
    console.log(sorted_ids)
    console.log(sorted_values)
    console.log(sorted_labels)

    let pieTrace = {
      "values": sorted_values,
      "labels": sorted_ids,
      "hovertext": sorted_labels,
      "type": "pie"
    };

    let pieData = [pieTrace]
    let pieLayout = {
      "title": "Top 10 Cultured Bacteria"
    };

    Plotly.newPlot("pie", pieData, pieLayout);
  });

  // Bubble Chart
  let url2 = "/samples/" + sample;
  d3.json(url2).then(function(bData) {
    console.log(bData)
    let bubbleTrace = {
      "x": bData.otu_ids,
      "y": bData.sample_values, 
      "mode": "markers",
      "marker": {
      "color": bData.otu_ids,
      "size": bData.sample_values
      },
      "text": bData.otu_labels
    };
    let bubbleData = [bubbleTrace];
    let bubbleLayout = {
      "title": `Patient #${sample} Total Belly Button Cultred Bacteria Bubble Chart`,
      "xaxis": {"title": "Bacteria Sample ID"},
      "yaxis": {"title": "Bacteria Volume"}
    };
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  });

  // BONUS: Build the Gauge Chart
  let url3 = "/metadata/" + sample;
  d3.json(url3).then(function(gResponse) {
    
    let level = gResponse.WFREQ * 20;
    // Trig to calc meter point
    let degrees = 180 - level, 
    radius = .5;
    let radians = degrees * Math.PI / 180;
    let x = radius * Math.cos(radians);
    let y = radius * Math.sin(radians);
    // Path: may have to change to create a better triangle
    let mainPath = "M -.0 -0.025 L .0 0.025 L ",
    pathX = String(x),
    space = " ",
    pathY = String(y),
    pathEnd = " Z";
    let path = mainPath.concat(pathX,space,pathY,pathEnd); 
    let gData = [{
      "type": "scatter",
      "x": [0], 
      "y":[0],
      "marker": {"size": 28, "color":"850000"},
      "showlegend": false,
      "name": "Bacteria Scrubs Per Week",
      "hoverinfo": "text+name"},
      {"values": [2, 2, 2, 2, 2, 2, 2, 2, 2, 18],
      "rotation": 90,
      "text": ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
      "textinfo": "text",
      "textposition": "inside",
      "marker": {"colors":["rgba(14, 127, 0, .5)", "rgba(110, 154, 22, .5)",
      "rgba(170, 202, 42, .5)", "rgba(202, 209, 95, .5)",
      "rgba(210, 206, 145, .5)", "rgba(232, 226, 202, .5)",
      "rgba(102, 185, 153, .3)", "rgba(102, 185, 125, .5)", 
      "rgba(75, 151, 146, .5)", "rgba(255, 255, 255, 0)"]},
      "labels": ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
      "hoverinfo": "label",
      "hole": .5,
      "type": "pie",
      "showlegend": false
    }];
    let gLayout = {
      "shapes":[{
      "type": "path",
      "path": path,
      "fillcolor": "850000",
      "line": {
        "color": "850000"
        }
      }],
      "title": "Belly Button Washing Weekly Frequency",
      "height": 500,
      "width": 500,
      "xaxis": {zeroline:false, showticklabels:false,
        showgrid: false, range: [-1, 1]},
      "yaxis": {zeroline:false, showticklabels:false,
        showgrid: false, range: [-1, 1]}
    };
    Plotly.newPlot("gauge", gData, gLayout);
  });
};
  


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
};

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
};

// Initialize the dashboard
init();
