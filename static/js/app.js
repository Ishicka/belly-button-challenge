const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
// assigned values after JSON is loaded
let samplenames;
let samplesMetadata;
let samplesSamples;

function init() {
    d3.json(url).then(function(data) {
        samplenames = data.names;
        samplesMetadata = data.metadata;
        samplesSamples = data.samples;

        // set values into dropDown
        let dropDown = d3.select("#selDataset");
        for (i =0; i < samplenames.length; i++) {
            dropDown.append("option")
                    .text(samplenames[i])
                    .attr("value", samplenames[i])
        }

        
        initialSetup(940);  // many values (first in `names`)
    });
}

function initialSetup(individual) {
    

    let individualData = samplesSamples.filter(sample => (sample.id == individual.toString()))[0];
    let individualMetadata = samplesMetadata.filter(meta => (meta.id == individual))[0];

    // Individual Metadata
    setMetadata(individual);

    // Create Charts
    let singleSampleIds = individualData.otu_ids;
    let singleSampleValues = individualData.sample_values;
    let singleSampleLabels = individualData.otu_labels;

    let config = {displayModeBar: false,};  // Do not display Plotly toolbar

    // Bar Chart
    let barTrace = [{
        x: singleSampleValues.slice(0, 10).reverse(),
        y: singleSampleIds.slice(0, 10).map(ids => `OTU ${ids}`).reverse(),
        text: singleSampleLabels.slice(0, 10).reverse(),
        name: "Taxa",
        type: "bar",
        orientation: "h",
    }];
    let barLayout = {
        margin: {t: 30, b: 40},
        xaxis: {title: "Values",
                fixedrange: true},
        yaxis: {title: "Samples",
                fixedrange: true},
    };
    Plotly.newPlot("bar", barTrace, barLayout, config)

    // Bubble Chart
    let bubbleTrace = [{
        x: singleSampleIds,
        y: singleSampleValues,
        text: singleSampleLabels,
        mode: 'markers',
        marker: {
            size: singleSampleValues,
            color: singleSampleIds,
            colorscale: "Bluered",
        },
    }];
    let bubbleLayout = {
        margin: {t: 30, b: 40, l: 50, r: 10, pad: 6},
        xaxis: {title: "OTU ID"},
        yaxis: {title: "Sample Values"},
    };
    Plotly.newPlot("bubble", bubbleTrace, bubbleLayout, config);

    // Gauge Chart
    let gaugeTrace = [{
        value: individualMetadata.wfreq,
        type: "indicator",
        mode: "gauge+number",
        gauge: {
            axis: {dtick: 1,
                   range: [null, 10],
                   tickcolor: "black",
                   ticks: "inside",},
            bar: {color: "#ee8844",
                  thickness: 0.5}, // replace  or add needle
            bgcolor: "white",
            borderwidth: 1,
            bordercolor: "black",
            steps: [
                {range: [0, 1], color: "#d2b48c"},
                {range: [1, 2], color: "#e0ffff"},
                {range: [2, 3], color: "#e2f583"},
                {range: [3, 4], color: "#d1f172"},
                {range: [4, 5], color: "#beec61"},
                {range: [5, 6], color: "#a9e851"},
                {range: [6, 7], color: "#92e441"},
                {range: [7, 8], color: "#76e031"},
                {range: [8, 9], color: "#52db20"},
                {range: [9, 10], color: "#00d70a"},
                ],
        },
    }];
    let gaugeLayout = {
        title: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
    };
    Plotly.plot("gauge", gaugeTrace, gaugeLayout, config);
};

function setMetadata(individual) {
    let individualMetadata = samplesMetadata.filter(meta => (meta.id == individual))[0];
    let metadataDiv = d3.select("#sample-metadata");

    // removing and re-adding <p> elements to metadata
    metadataDiv.selectAll("p").remove();  // remove existing <p> elements to prepare for new ones
    metadataDiv.selectAll("p")
               .data(Object.entries(individualMetadata))  // bind Array of [key, value] pairs
               .enter()
               .append("p")
               .text(d => `${d[0]}: ${d[1]}`);
};

function updateCharts(individual) {
    // Filter original json data for new individual id
    let individualData = samplesSamples.filter(sample => (sample.id == individual.toString()))[0];
    let individualMetadata = samplesMetadata.filter(meta => (meta.id == individual))[0];

    // update charts with restyle()
    let singleSampleIds = individualData.otu_ids;
    let singleSampleValues = individualData.sample_values;
    let singleSampleLabels = individualData.otu_labels;

    let barUpdate = {
        x: [singleSampleValues.slice(0, 10).reverse()],
        y: [singleSampleIds.slice(0, 10).map(ids => `OTU ${ids}`).reverse()],
        text: [singleSampleLabels.slice(0, 10).reverse()],
    };
    console.log(barUpdate);
    Plotly.restyle("bar", barUpdate);

    let bubbleUpdate = {
        x: [singleSampleIds],
        y: [singleSampleValues],
        text: [singleSampleLabels],
       'marker.size': [singleSampleValues],
       'marker.color': [singleSampleIds],
    };
    Plotly.restyle("bubble", bubbleUpdate);

    let gaugeUpdate = {
        value: individualMetadata.wfreq,
    };
    Plotly.restyle("gauge", gaugeUpdate);
}

function optionChanged(value) {
    console.log("Value changed to:", value);
    setMetadata(value);
    updateCharts(value);
};

// load the charts for the first time
init();