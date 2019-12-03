function buildMetadata(sample) {
  d3.json(`/metadata/${sample}`).then( data => {
    var selectMeta = d3.select('#sample-metadata');
    selectMeta.html('');
    (Object.entries(data)).forEach(([key, value]) => {
      selectMeta.append('p').text(`${key}: ${value}`);
    });
  });
};

function buildCharts(sample) {
  d3.json(`/samples/${sample}`).then(data => {
    var traceBubble = {
      x: data['otu_ids'],
      y: data['sample_values'],
      mode: 'markers',
      type: 'scatter',
      text: data['otu_labels'],
      marker: {
        size: data['sample_values'],
        color: data['otu_ids'],
        colorscale: 'Rainbow'
      }
    };
    var layoutBubble = {
      xaxis: { title: 'OTU ID'}
    };
    Plotly.newPlot('bubble', [traceBubble], layoutBubble);
    
    var tracePie = {
      values: data['sample_values'].slice(0, 10),
      labels: data['otu_ids'].slice(0, 10),
      type: 'pie',
      text: data['otu_labels'].slice(0, 10),
      hoverinfo: 'values',
      textinfo: 'none'
    };
    var layoutPie = {
      height: 750,
      width: 750
    };
    Plotly.newPlot('pie', [tracePie], layoutPie);
  });
};

function init() {
  var selector = d3.select("#selDataset");

  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    const firstSample = sampleNames[0];
    buildMetadata(firstSample);
    buildCharts(firstSample);
  });
};

function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetadata(newSample);
};

init();