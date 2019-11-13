var dataset;

d3.json("../data/oscar_winners_recent.json").then(function (data) {
    dataset = data;

    gen_vis();
});

function gen_vis() {
    var w = 800;
    var h = 400;

    var svg = d3.select("#the_chart")
        .append("svg") //we are appending a svg to the div 'the_chart'
        .attr("width", w)
        .attr("height", h);

    svg.append("rect") //we are creating a rectangle 
        .attr("width", 20)
        .attr("height", 150)
        .attr("fill", "purple")
        .attr("y", h - 150); //we are putting the bar on the bottom of the div

    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect") //for each item, we are appending a bar
        .attr("width", 20)
        .attr("height", function (d) {
            return d.rating * 30; //each bar height is a score
        })
        .attr("fill", "purple")
        .attr("x", function (d, i) { //d->each item|i->each item's index
            return i * 21; //we are setting each bar’s position
        })
        .attr("y", function (d) {
            return h - (d.rating * 30); //we are putting each bar on the bottom of the div
        });
}
