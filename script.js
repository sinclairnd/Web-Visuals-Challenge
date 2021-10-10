function pageLoad() {
    var dropdown = d3.select("#OTU_options");

    d3.json("samples.json").then((info) => {
        const namesList = info.names;

        namesList.forEach((name) => {
            dropdown.append("option").text(name).property("value", name);
        });

        const firstName = namesList[0];
        refreshPanel(firstName);
        createGraphs(firstName);
    });
}

pageLoad();

function idChange(id) {
    refreshPanel(id);
    createGraphs(id);
}

function refreshPanel(id) {
    d3.json("samples.json").then((info) => {
        const metadata = info.metadata;

        const filteredList = metadata.filter(i => i.id == id);
        const filteredValue = filteredList[0];

        var panel = d3.select("#metadata");
        panel.html("");

        Object.entries(filteredValue).forEach(([k,v]) => {
            panel.append("h6").text(`${k}: ${v}`);
        });
    });
}

function createGraphs(id) {
    d3.json("samples.json").then((info) => {
        const samples = info.samples;

        const filteredList = samples.filter(i => i.id == id);
        const filteredValue = filteredList[0];

        const sample_values = filteredValue.sample_values;
        const otu_ids = filteredValue.otu_ids;
        const otu_labels = filteredValue.otu_labels;

        //Bar graph
        const barGraphData = [
            {
                x: sample_values.slice(0,10).reverse(),
                y: otu_ids.slice(0,10).map(val => `OTU ${val}`).reverse(),
                type: "bar",
                orientation: "h"
            }
        ];

        Plotly.newPlot("bar", barGraphData);

        //Gauge graph
        const filteredMetadataList = info.metadata.filter(i => i.id == id);
        const filteredMetadataValue = filteredMetadataList[0]; 

        const wfreq = parseFloat(filteredMetadataValue.wfreq);

        const gaugeGraphData = [
            {
                domain: {x: [0,1], y: [0,1]},
                value: wfreq,
                title: {text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"},
                mode: "gauge+number",
                type: "indicator",
                gauge: {
                    axis: {range: [null, 10]},
                    bar: {color: "black", thickness: .25},
                    steps: [
                        {range: [0, 2], color: "d8e4bc"},
                        {range: [2, 4], color: "addfad"},
                        {range: [4, 6], color: "4cbb17"},
                        {range: [6, 8], color: "228b22"},
                        {range: [8, 10], color: "355e3b"}
                    ]
                }
            }

        ]

        Plotly.newPlot("gauge", gaugeGraphData);

        //Bubble graph
        const bubbleGraphData = [
            {
                x: otu_ids,
                y: sample_values,
                type: otu_labels,
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids
                }
            }
        ];

        Plotly.newPlot("bubble", bubbleGraphData);

        
    });
}

