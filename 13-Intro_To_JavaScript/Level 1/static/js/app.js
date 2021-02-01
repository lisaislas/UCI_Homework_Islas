// from data.js
var tableData = data;





// YOUR CODE HERE!


tableData.forEach(appendTable);

//On Submit Button

var submit = d3.select("#filter-btn");

submit.on("click", function() {
     //Remove Table
     d3.select("tbody").html("");
     // Do not refresh data
     d3.event.preventDefault();
     //value property of input element
     var dateTime = d3.select("#datetime").property("value");
     var city = d3.select("#city").property("value");
     var state = d3.select("#state").property("value");
     var country = d3.select("#country").property("value");
     var shape = d3.select("#shape").property("value");
     //98console.log(dateTime);
     //filter data based on input date
     var filteredData = tableData
     if (datetime) {
          filteredData = tableData.filter(record => record.datetime === dateTime);

     } 
     if (city) {
          filteredData = tableData.filter(record => record.city === city);

     }

     if (state) {
          filteredData = tableData.filter(record => record.state === state);


     }

     if (country) {

          filteredData = tableData.filter(record => record.country === country);
     }
     
     if (shape) {
          filteredData = tableData.filter(record => record.shape === shape);


     }




     
     
     
     
     console.log(filteredData)
     //Display Dataset
     filteredData.forEach(appendTable);
});

//Append data based on filtered data

function appendTable(report) {
     var tbody = d3.select("tbody");
     var row = tbody.append("tr");
     //for each key value pair
     Object.entries(report).forEach(([key, value]) => {
          var cell = row.append("td");
          cell.text(value);
     });
}