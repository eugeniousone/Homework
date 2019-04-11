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

// function used for updating y-scale const upon click on axis label
function yScale(newsData, chosenYAxis) {
    // create scales
    const yLinearScale = d3.scaleLinear()
        .domain([d3.min(newsData, d => d[chosenYAxis]) * 0.8,
        d3.max(newsData, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);
    return yLinearScale;
};

// function used for updating xAxis const upon click on axis label
function renderXAxes(newXScale, xAxis) {
    const bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    return xAxis;
};

// function used for updating yAxis const upon click on axis label
function renderYAxes(newYScale, yAxis) {
    const leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    return yAxis;
};

// function used for updating  circles group with a transition to
// new x circles
function renderXCircles(circlesGroup, newXScale, chosenXAxis, ) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));
    return circlesGroup;
};
// new y circles
function renderYCircles(circlesGroup, newYScale, chosenYAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cy", d => newYScale(d[chosenYAxis]));
    return circlesGroup;
};
// new x text position
function renderXText(textGroup, xLinearScale, chosenXAxis) {
    textGroup.transition()
        .duration(1000)
        .attr("x", d => xLinearScale(d[chosenXAxis]));
    return textGroup;
};
// new y text position
function renderYText(textGroup, yLinearScale, chosenYAxis) {
    textGroup.transition()
        .duration(1000)
        .attr("y", d => yLinearScale(d[chosenYAxis]));
    return textGroup;
};

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    let xLabel = "Poverty:";
    if (chosenXAxis === "age") {
        xLabel = "Age:";
    }
    else if (chosenXAxis === "income") {
        xLabel = "Income:";
    };

    let yLabel = "Obese:";
    if (chosenYAxis === "smokes") {
        yLabel = "Smokes:";
    }
    else if (chosenYAxis === "healthcare") {
        yLabel = "Healthcare:";
    };

    const toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<br>${yLabel} ${d[chosenYAxis]}%<br>${xLabel} ${d[chosenXAxis]}`);
            });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
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
    let chosenYAxis = "obesity";


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
        let yLinearScale = yScale(newsData, chosenYAxis);

        // Create initial axis functions
        const bottomAxis = d3.axisBottom(xLinearScale);
        const leftAxis = d3.axisLeft(yLinearScale);

        // append x axis
        let xAxis = chartGroup.append("g")
            .classed("axis-text", true)
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        // append y axis
        let yAxis = chartGroup.append("g")
            .classed("axis-text", true)
            .call(leftAxis);

        // append initial circles
        let circlesGroup = chartGroup.selectAll("circle")
            .data(newsData)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d[chosenYAxis]))
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
            .text(d => d.abbr)
            .attr("class", "stateText");
        

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

        // Create group for  3 y- axis labels
        const yLabelsGroup = chartGroup.append("g")
            .attr("transform", "rotate(-90)");

        const obesityLabel = yLabelsGroup.append("text")
            .attr("value", "obesity") // value to grab for event listener
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .classed("active", true)
            .text("Obese (%)");

        const smokesLabel = yLabelsGroup.append("text")
            .attr("value", "smokes") // value to grab for event listener
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "2em")
            .classed("inactive", true)
            .text("Smokes (%)");

        const healthcareLabel = yLabelsGroup.append("text")
            .attr("value", "healthcare") // value to grab for event listener
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "3em")
            .classed("inactive", true)
            .text("Lacks Healthcare (%)");

        // updateToolTip function above csv import
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

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
            xAxis = renderXAxes(xLinearScale, xAxis);

            // updates circles with new x values
            circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);
            
            // updates circles with new text labels
            textGroup = renderXText(textGroup, xLinearScale, chosenXAxis);

            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

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
        // y axis labels event listener
        yLabelsGroup.selectAll("text").on("click", function() {
            // get value of selection
            const value = d3.select(this).attr("value");
            if (value !== chosenYAxis) {

            // replaces chosenYaxis with value
            chosenYAxis = value;

            // functions here found above csv import
            // updates y scale for new data
            yLinearScale = yScale(newsData, chosenYAxis);

            // updates y axis with transition
            yAxis = renderYAxes(yLinearScale, yAxis);

            // updates circles with new y values
            circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);

            // updates circles with new text labels
            textGroup = renderYText(textGroup, yLinearScale, chosenYAxis);

            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

            // changes classes to change bold text
            if (chosenYAxis === "obesity") {
                obesityLabel
                    .classed("active", true)
                    .classed("inactive", false);
                smokesLabel
                    .classed("active", false)
                    .classed("inactive", true);
                healthcareLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else if (chosenYAxis === "smokes") {
                obesityLabel
                    .classed("active", false)
                    .classed("inactive", true);
                smokesLabel
                    .classed("active", true)
                    .classed("inactive", false);
                healthcareLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else {
                obesityLabel
                    .classed("active", false)
                    .classed("inactive", true);
                smokesLabel
                    .classed("active", false)
                    .classed("inactive", true);
                healthcareLabel
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