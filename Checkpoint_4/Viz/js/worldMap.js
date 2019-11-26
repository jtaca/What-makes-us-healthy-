var dataset;

d3.csv("../VI_datasets/Air_pollution_exposure.csv").then(function (data) {
    //console.log(data);
    //dataset = data;

    //gen_map_vis();
});

function gen_map_vis() {
    var h = 800;
    var w = 1200;

    var svg = d3.select("#worldMap")
        .append("svg")
        .attr("height", h)
        .attr("width", w);

    var path = d3.geoPath();
}