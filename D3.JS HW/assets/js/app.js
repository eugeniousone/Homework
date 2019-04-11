const svgWidth = 960;
const svgHeight = 500;
const margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};
const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
const svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
const chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
let chosenXAxis = "poverty";

// function used for updating x-scale const upon click on axis label
function xScale(newsData, chosenXAxis) {
    // create scales
    const xLinearScale = d3.scaleLinear()
        .domain([d3.min(newsData, d => d[chosenXAxis]) * 0.8,
        d3.max(newsData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);
    return xLinearScale;
};

// function used for updating xAxis const upon click on axis label
function renderAxes(newXScale, xAxis) {
    const bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    return xAxis;
};

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

    return circlesGroup;
};
// new text position
function renderText(textGroup, xLinearScale, chosenXAxis) {

    textGroup.transition()
    .duration(1000)
    .attr("x", function(d) {
        return xLinearScale(d[chosenXAxis] - 0);
    });

    return textGroup;
};

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

    let label = "Poverty: ";
    if (chosenXAxis === "age") {
    label = "Age: ";
    }
    else if (chosenXAxis === "income") {
        label = "Income: ";
    }
    else {
        label = "Poverty: "
    };

    const toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
        return (`${d.state}<br>Healthcare: ${d.healthcare}<br>${label} ${d[chosenXAxis]}`);
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("click", function(data) {
    toolTip.show(data, this);
    })
    // onmouseout event
    .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });

    return circlesGroup;
};

// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    const svgArea = d3.select("body").select("svg");
  
    // clear svg is not empty
    if (!svgArea.empty()) {
      svgArea.remove();
    }
    // Import Data
    d3.csv("assets/data/data.csv").then(function(newsData, err) {
        if (err) throw err;
        
        newsData.forEach(function(csvData) {
            csvData.poverty = +csvData.poverty;
            csvData.age = +csvData.age;
            csvData.income = +csvData.income;
            csvData.healthcare = +csvData.healthcare;
            csvData.obesity = +csvData.obesity;
            csvData.smokes = +csvData.smokes;
        });
        console.log(newsData);

        // xLinearScale function above csv import
        let xLinearScale = xScale(newsData, chosenXAxis);

        // Create y scale function
        let yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(newsData, d => d.healthcare)])
            .range([height, 0]);

        // Create initial axis functions
        const bottomAxis = d3.axisBottom(xLinearScale);
        const leftAxis = d3.axisLeft(yLinearScale);

        // append x axis
        let xAxis = chartGroup.append("g")
            .classed("axis-text", true)
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        // append y axis
        chartGroup.append("g")
            .call(leftAxis);

        // append initial circles
        let circlesGroup = chartGroup.selectAll("circle")
            .data(newsData)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d.healthcare))
            .attr("r", 10)
            .attr("class", "stateCircle");

        // append state labels
        let textGroup = chartGroup.append("text")
            .selectAll("tspan")
            .data(newsData)
            .enter()
            .append("tspan")
            .attr("x", d => xLinearScale(d[chosenXAxis]))
            .attr("y", d => yLinearScale(d[chosenYAxis]))
            .text(d => d.abbr);
        
        // Create group for  3 x- axis labels
        const xLabelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${width / 2}, ${height + 20})`);

        const povertyLabel = xLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "poverty") // value to grab for event listener
            .classed("active", true)
            .text("In Poverty (%)");

        const ageLabel = xLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "age") // value to grab for event listener
            .classed("inactive", true)
            .text("Age (Median)");
            
        const incomeLabel = xLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "income") // value to grab for event listener
            .classed("inactive", true)
            .text("Household Income (Median)");

        // append y axis
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 10)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .classed("axis-text", true)
            .text("Lacks Healthcare(%)");

        // updateToolTip function above csv import
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // x axis labels event listener
        xLabelsGroup.selectAll("text").on("click", function() {
            // get value of selection
            const value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {

            // replaces chosenXaxis with value
            chosenXAxis = value;

            // functions here found above csv import
            // updates x scale for new data
            xLinearScale = xScale(newsData, chosenXAxis);

            // updates x axis with transition
            xAxis = renderAxes(xLinearScale, xAxis);

            // updates circles with new x values
            circlesGroup = renderCircles(circlesGroup,xLinearScale, chosenXAxis);
            // updates circles with new text labels
            textGroup = renderText(textGroup, xLinearScale, chosenXAxis);

            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

            // changes classes to change bold text
            if (chosenXAxis === "poverty") {
                povertyLabel
                .classed("active", true)
                .classed("inactive", false);
                ageLabel
                .classed("active", false)
                .classed("inactive", true);
                incomeLabel
                .classed("active", false)
                .classed("inactive", true);
            }
            else if (chosenXAxis === "age") {
                povertyLabel
                .classed("active", false)
                .classed("inactive", true);
                ageLabel
                .classed("active", true)
                .classed("inactive", false);
                incomeLabel
                .classed("active", false)
                .classed("inactive", true);
            }
            else {
                povertyLabel
                .classed("active", false)
                .classed("inactive", true);
                ageLabel
                .classed("active", false)
                .classed("inactive", true);
                incomeLabel
                .classed("active", true)
                .classed("inactive", false);
                };
            };
        });
    });
};


// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);