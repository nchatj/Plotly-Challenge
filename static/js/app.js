var url = 
  'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';


d3.json(url).then (data => { 

var dropdown = data.names;

dropdown.forEach((name) => {
    d3.select("#selDataset")
    .append("option")
    .text(name);
})

function init() {
    getData();
}


d3.selectAll("#selDataset").on("change", getData);

function getData() {

    var dropdownMenu = d3.select("#selDataset");
    var sel_id = dropdownMenu.property("value");

    dataset_sample = data.samples.filter(data_id => data_id.id === sel_id)[0];

    for (let i = 0; i < data.metadata.length; i++) {
        if (data.metadata[i].id == sel_id){
            meta_data = data.metadata[i];
        };
    }
    
    var demo_info = d3.select("#sample-metadata");

    demo_info.html("");
    Object.entries(meta_data).forEach(([key, value]) => {
        demo_info.append("h6").text(`${key}: ${value}`)
    })
    updatePlotly(dataset_sample);
    updateGauge(meta_data);
}

function updatePlotly(dataset_sample) {

    var otu_labels = dataset_sample.otu_labels;
    var otu_ids = dataset_sample.otu_ids;
    var sample_values = dataset_sample.sample_values;
    var top_labels = otu_labels.slice(0,10);
    var top_ids = otu_ids.slice(0,10);
    var top_val = sample_values.slice(0,10).reverse();
    var otu_lab = top_ids.map(top_ids =>"OTU " + top_ids).reverse();

// Bar Chart

bartrace=[{
    y: otu_lab,
    x: top_val,
    text : top_labels,
    labels: otu_labels,
    type: "bar",
    orientation: 'h'
}];

var layout1 = {
    title : "<b>Top 10 OTUs</b>"
};

var config = {responsive:true}

Plotly.newPlot("bar", bartrace, layout1, config);
    
// Bubble Graph

var bubbletrace = {
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: "markers",
    marker: {
        size: sample_values,
        color: otu_ids
    }         
};

var config = {responsive:true}

var bubbledata = [bubbletrace];

var layout2 = {
    showlegend: false,
    xaxis: {title: "OTU ID"}
};
        
Plotly.newPlot("bubble", bubbledata, layout2, config);


}
init();

});