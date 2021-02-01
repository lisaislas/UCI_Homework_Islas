// @TODO: YOUR CODE HERE!
// Part1:  set up chart parameters
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 30,
    right: 40,
    bottom: 80,
    left: 100
};

//Create Height and Width of Chart

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//Part 2:  Create SVG wrapper
// append SVG group to hold chart

var svg = d3.select("#scatter")
    .classed("chart", true)
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Initial params

var chosenXAxis = "poverty"

// function used to updating x-scale var upon click on axis label

function xScale(data, chosenXAxis) {
    //Create Scales
    var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
     d3.max(data, d => d[chosenXAxis]) * 1.2

])
.range([0, width]);

return xLinearScale;
}


// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }

  // function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }

  // function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

    var label;
  
    if (chosenXAxis === "poverty") {
      label = "Poverty:";
    }
    else {
      label = "healthcare:";
    }
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.abbr}<br>${label} ${d[chosenXAxis]}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }




//Part 3:Import csv file

d3.csv("./assets/data/data.csv").then(function(healthData, err) {
    if (err) throw err;



    //console.log(healthData);

    // Part 4: Parse Data
    healthData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.smokes = +data.smokes;
        data.healthcare = +data.healthcare;
    });

    // xLinearScale function above csv import
  var xLinearScale = xScale(healthData, chosenXAxis);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(healthData, d => d.healthcare)])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

// append initial circles
var circlesGroup = chartGroup.selectAll("circle")
   .data(healthData)
   .enter()
   .append("circle")
   .attr("cx", d => xLinearScale(d[chosenXAxis]))
   .attr("cy", d => yLinearScale(d.healthcare))
   .attr("r", 15)
   .attr("fill", "blue")
   .attr("opacity", ".5");

   // Create Group for Abbreviation

    var circlesGroup = chartGroup.selectAll(".stateText")
    .data(healthData)
    .enter()
    .append("text")
    .classed("stateText", true)
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d.healthcare))
    .attr("dy", 3)
    .attr("font-size", "8px")
    .text(function(d){return d.abbr});



// Create group for two x-axis labels
var labelsGroup = chartGroup.append("g")
   .attr("transform", `translate(${width / 2}, ${height + 20})`);

var povertyLabel = labelsGroup.append("text")
   .attr("x", 0)
   .attr("y", 20)
   .attr("value", "poverty") // value to grab for event listener
   .classed("active", true)
   .text("In Poverty(%)");

var healthcareLabel = labelsGroup.append("text")
   .attr("x", 0)
   .attr("y", 40)
   .attr("value", "healthcare") // value to grab for event listener
   .classed("inactive", true)
   .text("Healthcare Vs Poverty");
 // append y axis
 chartGroup.append("text")
 .attr("transform", "rotate(-90)")
 .attr("y", 0 - margin.left)
 .attr("x", 0 - (height / 2))
 .attr("dy", "1em")
 .classed("axis-text", true)
 .text("Lacks Healthcare(%)");

// updateToolTip function above csv import
var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

// x axis labels event listener
labelsGroup.selectAll("text")
 .on("click", function() {
   // get value of selection
   var value = d3.select(this).attr("value");
   if (value !== chosenXAxis) {

     // replaces chosenXAxis with value
     chosenXAxis = value;

     // console.log(chosenXAxis)

     // functions here found above csv import
     // updates x scale for new data
     xLinearScale = xScale(data, chosenXAxis);

     // updates x axis with transition
     xAxis = renderAxes(xLinearScale, xAxis);

     // updates circles with new x values
     circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

     // updates tooltips with new info
     circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

     // changes classes to change bold text
     if (chosenXAxis === "healthcare") {
       healthcareLabel
         .classed("active", true)
         .classed("inactive", false);
       povertyLabel
         .classed("active", false)
         .classed("inactive", true);
     }
     else {
       healthcareLabel
         .classed("active", false)
         .classed("inactive", true);
       povertyLabel
         .classed("active", true)
         .classed("inactive", false);
     }
   }
 });
}).catch(function(error) {
console.log(error);

    
    
    
});