// from data.js
let tableData = data;

// Build full table
function buildTable(tableData) {
    // Clear current table
    let newTable = d3.select("tbody").remove();
    newTable = d3.select("table").append("tbody");

    tableData.forEach((tData) => {
        let tbody = d3.select("tbody");
        let row = tbody.append("tr");
        row.append("td").text(tData.datetime);
        row.append("td").text((tData.city).toUpperCase());
        row.append("td").text((tData.state).toUpperCase());
        row.append("td").text((tData.country).toUpperCase());
        row.append("td").text(tData.shape);
        row.append("td").text(tData.durationMinutes);
        row.append("td").text(tData.comments);
    });
};

// Execute when click filter button 
let filterButton = d3.select("#filter-btn");

filterButton.on("click", function() {

    /// Get references to  input field
    let dateInput = d3.select("#dateInput").property("value");
    let cityInput = d3.select("#cityList").property("value");
    let stateInput = d3.select("#stateList").property("value");
    let countryInput = d3.select("#countryList").property("value");
    let shapeInput = d3.select("#shapeList").property("value");

    //  Reset the data
    let filteredData = tableData;
    //  Filter through multiple inputs

    if (dateInput != "") {
        filteredData = filteredData.filter(filterdata => filterdata.datetime === dateInput);
    }
    if (cityInput !="") {
        filteredData = filteredData.filter(filterdata => filterdata.city.toUpperCase() === cityInput.toUpperCase());
    }
    if (stateInput !="") {
        filteredData = filteredData.filter(filterdata => filterdata.state.toUpperCase() === stateInput.toUpperCase());
    }
    if (countryInput !="") {
        filteredData = filteredData.filter(filterdata => filterdata.country.toUpperCase() === countryInput.toUpperCase());
    }
    if (shapeInput !="") {
        filteredData = filteredData.filter(filterdata => filterdata.shape === shapeInput);
    };
    
    let newTable = d3.select("tbody").remove();
    newTable = d3.select("table").append("tbody");
    buildTable(filteredData);
}); 

// Execute when click reset button
let reset = d3.select("#clear-btn");

reset.on("click",function() {
    buildTable(tableData);
    d3.select("#dateInput").node().value = "";
    d3.select("#cityInput").node().value = "";
    d3.select("#stateInput").node().value = "";
    d3.select("#countryInput").node().value = "";
    d3.select("#shapeInput").node().value = "";
});

// Render the table for the first time on page load
buildTable(tableData);

// Render City Dropdown list
let cities = tableData.map(city => city.city.toUpperCase()).sort();
let cleanCity = [""];
for(city of cities) {
    if (!cleanCity.includes(city)) {
        cleanCity.push(city);
    };
};

let cityDropdown = d3.select("#cityList").selectAll("option").remove();
cleanCity.forEach((city) => {
    let selection = d3.select("#cityList");
    let option = selection.append("option");
    option.text(city);
});
    
// Render State Dropdown list
let states = tableData.map(state => state.state.toUpperCase()).sort();
let cleanState = [""];
for(state of states) {
    if (!cleanState.includes(state)) {
        cleanState.push(state);
    };
};

let stateDropdown = d3.select("#stateList").selectAll("option").remove();
cleanState.forEach((state) => {
    let selection = d3.select("#stateList");
    let option = selection.append("option");
    option.text(state);
});

// Render Country Dropdown list
let countries = tableData.map(country => country.country.toUpperCase()).sort();
let cleanCountry = [""];
for(country of countries) {
    if (!cleanCountry.includes(country)) {
        cleanCountry.push(country);
    };
};

let countryDropdown = d3.select("#countryList").selectAll("option").remove();
cleanCountry.forEach((country) => {
    let selection = d3.select("#countryList");
    let option = selection.append("option");
    option.text(country);
});

// Render Shape Dropdown list
let shapes = tableData.map(shape => shape.shape.toUpperCase()).sort();
let cleanShape = [""];
for(shape of shapes) {
    if (!cleanShape.includes(shape)) {
        cleanShape.push(shape);
    };
};

let shapeDropdown = d3.select("#shapeList").selectAll("option").remove();
cleanShape.forEach((shape) => {
    let selection = d3.select("#shapeList");
    let option = selection.append("option");
    option.text(shape);
});