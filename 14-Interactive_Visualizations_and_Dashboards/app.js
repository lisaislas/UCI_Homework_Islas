function barChart(sample) {
    d3.json('samples.json').then((data) => {
        console.log(data);
     var oneSample =   data.samples.filter(sampleId => sampleId.id == sample)[0]
        var ids = oneSample.otu_ids.map(otuID => `OTU ${otuID}`).slice(0, 10).reverse();
        var labels = oneSample.otu_labels.slice(0, 10).reverse();
        var values = oneSample.sample_values.slice(0, 10).reverse();

        var trace1 = {
            x: values,
            y: ids,
            type: "bar",
            orientation: "h"            
        };
        
        var data = [trace1];
        
        var layout = {
            title: "Belly Button Bar Chart",
            xaxis: {title: "ids"},
            yaxis: {title: "Sample Values"}
        }
        
        Plotly.newPlot("bar", data, layout);


    });
};  

function bubbleChart(sample) {
    d3.json('samples.json').then((data) => {
        console.log(data);
     var oneSample = data.samples.filter(sampleId => sampleId.id == sample)[0]
       

       var OtuIds = oneSample.otu_ids.reverse();

       var SampleValue = oneSample.sample_values.reverse();
       var OtuLabel = oneSample.otu_labels.reverse();

       var bubbleTrace = [
        {
          x: OtuIds,
          y: SampleValue,
          text: OtuLabel,
          mode: 'markers',
          marker: {
          color: OtuIds,
          size: SampleValue
          }
        }

      ];

       var bubbleLayout = {
        title: "Market Size and Color for each sample ID by sample value",
        showlegend: false,
        x: "OTU ID",
       };

        Plotly.newPlot('bubble', bubbleTrace, bubbleLayout)
    });
};
// Demographic Information
 function Metadata(sample) {
    d3.json('samples.json').then((data) => {
        var metadata = data.metadata;
        var selectedSample = metadata.filter(object => object.id == sample);
        var filteredData = selectedSample[0];
        var Panel = d3.select("#sample-metadata");

        Panel.html("");

        Object.entries(filteredData).forEach(([key, value]) => {
            Panel.append("h6").text(key.toUpperCase() + ': ' + value);

          })

     });
 }

function optionChanged (sampleId) {
    barChart(sampleId)
    bubbleChart(sampleId)
    Metadata(sampleId)
}



function init() {
    var selectID = d3.select("#selDataset");
    d3.json('samples.json').then((data) => {
        
        var allNames = data.names
        allNames.forEach(element => {
            selectID.append("option")
        .text(element)
        .property("value", element);
            
        });
    
    })

    barChart(940)
    bubbleChart(940)
    Metadata(940)
}

init();
//Add event listener for submit button
//d3.select("#selDataset").on("change", handleSubmit);