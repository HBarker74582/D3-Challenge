// @TODO: YOUR CODE HERE!
// Load data
// Define SVG area dimensions
var svgWidth = 860;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

// Define dimensions of the chart area
var width = svgWidth - chartMargin.left - chartMargin.right;
var height = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
    .select("body")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);



d3.csv("assets/data/data.csv").then(function (censusData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    censusData.forEach(function (data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });
    console.log(censusData);
    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
        .domain([0, d3.max(censusData, d => d.poverty)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(censusData, d => d.healthcare)])
        .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.healthcare))
        .attr("cy", d => yLinearScale(d.poverty))
        .attr("r", "15")
        .attr("fill", "pink")
        .attr("opacity", ".5")
        .attr("class", "stateCircle");


    // / add abbr
    // ==============================


    chartGroup.selectAll("text")
        .data(censusData)
        .enter()
        .append("text")
        .attr("class", "stateText")
        .attr("dx", d => xLinearScale(d.healthcare))
        .attr("dy", d => yLinearScale(d.poverty))
        .text(function (d) {
            console.log(d);
            return d.abbr;
        });




    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function (d) {
            return (`${d.abbr}<br>Health Care: ${d.healthcare}<br>Poverty: ${d.poverty}`);
        });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function (data) {
        toolTip.show(data, this);
    })
        // onmouseout event
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });

    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left + 20)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + chartMargin.top + 45})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");
}).catch(function (error) {
    console.log(error);
});

