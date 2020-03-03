
var dataset, full_dataset;
var dispatch;
var selectedBar;
var selectedCircle;

d3.json("HealthyData.json").then(function (data) {
    full_dataset = data;
    dataset = full_dataset//.slice(0,60);
    dispatch = d3.dispatch("testEvent");
    //actions
    dispatch.on("testEvent", function(healthy){
        
        if (selectedCircle != null){
            selectedCircle.attr("fill","blue");
        }
        selectedCircle = d3.select("circle[location=\'" + healthy.location + "\']");
        selectedCircle.attr("fill","red");
    })

    //violinsmokers();

    violinChart();
    
    gen_scatterplotaverage_wagessmokers();
    gen_scatterplotaverage_wagesalcohol();
    gen_scatterplotaverage_wagescancer();
    gen_scatterplotaverage_wagessuicide()
    gen_scatterplotaverage_wageslife_at_old()
    gen_scatterplotaverage_wageslife_at_birth()
    gen_scatterplotaverage_wagesobese()


});



function violinChart() {
      
  var colorScale = d3.scaleOrdinal().range(["blue","red","yellow","purple","green","brown","grey","white"])
  var normal = d3.randomNormal()    
  var sampleData1 = d3.range(100).map(d => normal())
  var sampleData2 = d3.range(100).map(d => normal())
  var sampleData3 = d3.range(100).map(d => normal())
  var sampleData4 = d3.range(100).map(d => normal())
  var sampleData5 = d3.range(100).map(d => normal())
  var sampleData6 = d3.range(100).map(d => normal())
  var sampleData7 = d3.range(100).map(d => normal())
  var sampleData8 = d3.range(100).map(d => normal())
  
  var histoChart = d3.histogram();
  
  histoChart
      .domain([-3,3])
      .thresholds([-3,-2.5,-2,-1.5,-1,-0.5,0,0.5,1,1.5,2,2.5,3])
      .value(d => d)    
  d3.select("body").append("svg").attr("width",500).attr("height",500);
  
  var yScale = d3.scaleLinear().domain([-3,3]).range([400,0])
  var yAxis = d3.axisRight().scale(yScale)
      .tickSize(300)
  
  d3.select("svg").append("g").call(yAxis)
      .attr("class","yAxis")
  .attr("transform","translate(0,10)")

  var area = d3.area()
      .x0(d => -d.length) 
      .x1(d => d.length)
      .y(d => yScale(d.x0))   
      .curve(d3.curveCatmullRom)
      
  
  d3.select("svg").selectAll("g.violin")
  .data([sampleData1,sampleData2,sampleData3,sampleData4,sampleData5,sampleData6,sampleData7,sampleData8 ]).enter()    
  .append("g")
  .attr("transform",(d,i) => `translate(${50 + i * 100}, 10)`)    .append("path")
      .style("stroke","black")
      .style("stroke-width", 2)
      .style("fill",(d,i) => colorScale(i))
      .attr("d", d => area(histoChart(d)))

}


function gen_scatterplotaverage_wagesobese() {
  var w = 600;
  var h = 300;

  var svg = d3.select("#the_chart")
              .append("svg")
              .attr("width",w)
              .attr("height",h)
  .attr("fill", "blue");


  var padding = 30;
  var bar_w = 15;
  var r = 2;

  var hscale = d3.scaleLinear()
                       .domain([d3.max(dataset, function(d) {
                        return d.obese;}),d3.min(dataset, function(d) {
                          return d.obese;})])
                       .range([padding,h-padding]);

  var xscale = d3.scaleLinear()
                     .domain([d3.min(dataset, function(d) {
                      return d.average_wages;}),d3.max(dataset, function(d) {
          return d.average_wages;})])
                     .range([padding,w-padding]);

  var yaxis = d3.axisLeft()
                .scale(hscale);

  var xaxis = d3.axisBottom()
.scale(xscale)
            //.ticks(dataset.length/2);

  var cscale = d3.scaleLinear()
       .domain([d3.min(dataset, function(d) { return  d.average_wages;}),
                d3.max(dataset, function(d) { return d.average_wages;})])
       .range(["red", "blue"]);


 gY = svg.append("g")
   .attr("transform","translate(30,0)")
.attr("class","y axis")
.call(yaxis);


  gX = svg.append("g")
   .attr("transform","translate(0," + (h-padding) + ")")
.call(xaxis);

 svg.selectAll("circle")
      .data(dataset)
      //.data(dataset.slice(0,10)) // only the fisrt 10 are shown
      .enter().append("circle")
      .on("mouseover", function(d){
          dispatch.call("testEvent",d,d);
      })
      .attr("r",r)
      .attr("fill","blue")
      .attr("cx",function(d, i) {
          if (d.average_wages == 0 || d.obese == 0 ) {return padding;}

                      return  xscale(d.average_wages);
                  })
      .attr("cy",function(d) {
          
          if (d.average_wages == 0 || d.obese == 0 ) {return padding;}

                  return hscale(d.obese);

                  })
      .attr("title", function(d) {return d.location;});
}


function gen_scatterplotaverage_wageslife_at_birth() {
  var w = 600;
  var h = 300;

  var svg = d3.select("#the_chart")
              .append("svg")
              .attr("width",w)
              .attr("height",h)
  .attr("fill", "blue");


  var padding = 30;
  var bar_w = 15;
  var r = 2;

  var hscale = d3.scaleLinear()
                       .domain([d3.max(dataset, function(d) {
                        return d.life_at_birth;}),d3.min(dataset, function(d) {
                          return d.life_at_birth;})])
                       .range([padding,h-padding]);

  var xscale = d3.scaleLinear()
                     .domain([d3.min(dataset, function(d) {
                      return d.average_wages;}),d3.max(dataset, function(d) {
          return d.average_wages;})])
                     .range([padding,w-padding]);

  var yaxis = d3.axisLeft()
                .scale(hscale);

  var xaxis = d3.axisBottom()
.scale(xscale)
            //.ticks(dataset.length/2);

  var cscale = d3.scaleLinear()
       .domain([d3.min(dataset, function(d) { return  d.average_wages;}),
                d3.max(dataset, function(d) { return d.average_wages;})])
       .range(["red", "blue"]);


 gY = svg.append("g")
   .attr("transform","translate(30,0)")
.attr("class","y axis")
.call(yaxis);


  gX = svg.append("g")
   .attr("transform","translate(0," + (h-padding) + ")")
.call(xaxis);

 svg.selectAll("circle")
      .data(dataset)
      //.data(dataset.slice(0,10)) // only the fisrt 10 are shown
      .enter().append("circle")
      .on("mouseover", function(d){
          dispatch.call("testEvent",d,d);
      })
      .attr("r",r)
      .attr("fill","blue")
      .attr("cx",function(d, i) {
          if (d.average_wages == 0 || d.life_at_birth == 0 ) {return padding;}

                      return  xscale(d.average_wages);
                  })
      .attr("cy",function(d) {
          
          if (d.average_wages == 0 || d.life_at_birth == 0 ) {return padding;}

                  return hscale(d.life_at_birth);

                  })
      .attr("title", function(d) {return d.location;});
}



function gen_scatterplotaverage_wageslife_at_old() {
  var w = 600;
  var h = 300;

  var svg = d3.select("#the_chart")
              .append("svg")
              .attr("width",w)
              .attr("height",h)
  .attr("fill", "blue");


  var padding = 30;
  var bar_w = 15;
  var r = 2;

  var hscale = d3.scaleLinear()
                       .domain([d3.max(dataset, function(d) {
                        return d.life_at_old;}),d3.min(dataset, function(d) {
                          return d.life_at_old;})])
                       .range([padding,h-padding]);

  var xscale = d3.scaleLinear()
                     .domain([d3.min(dataset, function(d) {
                      return d.average_wages;}),d3.max(dataset, function(d) {
          return d.average_wages;})])
                     .range([padding,w-padding]);

  var yaxis = d3.axisLeft()
                .scale(hscale);

  var xaxis = d3.axisBottom()
.scale(xscale)
            //.ticks(dataset.length/2);

  var cscale = d3.scaleLinear()
       .domain([d3.min(dataset, function(d) { return  d.average_wages;}),
                d3.max(dataset, function(d) { return d.average_wages;})])
       .range(["red", "blue"]);


 gY = svg.append("g")
   .attr("transform","translate(30,0)")
.attr("class","y axis")
.call(yaxis);


  gX = svg.append("g")
   .attr("transform","translate(0," + (h-padding) + ")")
.call(xaxis);

 svg.selectAll("circle")
      .data(dataset)
      //.data(dataset.slice(0,10)) // only the fisrt 10 are shown
      .enter().append("circle")
      .on("mouseover", function(d){
          dispatch.call("testEvent",d,d);
      })
      .attr("r",r)
      .attr("fill","blue")
      .attr("cx",function(d, i) {
          if (d.average_wages == 0 || d.life_at_old == 0 ) {return padding;}

                      return  xscale(d.average_wages);
                  })
      .attr("cy",function(d) {
          
          if (d.average_wages == 0 || d.life_at_old == 0 ) {return padding;}

                  return hscale(d.life_at_old);

                  })
      .attr("title", function(d) {return d.location;});
}



function gen_scatterplotaverage_wagessuicide() {
  var w = 600;
  var h = 300;

  var svg = d3.select("#the_chart")
              .append("svg")
              .attr("width",w)
              .attr("height",h)
  .attr("fill", "blue");


  var padding = 30;
  var bar_w = 15;
  var r = 2;

  var hscale = d3.scaleLinear()
                       .domain([d3.max(dataset, function(d) {
                        return d.suicide;}),d3.min(dataset, function(d) {
                          return d.suicide;})])
                       .range([padding,h-padding]);

  var xscale = d3.scaleLinear()
                     .domain([d3.min(dataset, function(d) {
                      return d.average_wages;}),d3.max(dataset, function(d) {
          return d.average_wages;})])
                     .range([padding,w-padding]);

  var yaxis = d3.axisLeft()
                .scale(hscale);

  var xaxis = d3.axisBottom()
.scale(xscale)
            //.ticks(dataset.length/2);

  var cscale = d3.scaleLinear()
       .domain([d3.min(dataset, function(d) { return  d.average_wages;}),
                d3.max(dataset, function(d) { return d.average_wages;})])
       .range(["red", "blue"]);


 gY = svg.append("g")
   .attr("transform","translate(30,0)")
.attr("class","y axis")
.call(yaxis);


  gX = svg.append("g")
   .attr("transform","translate(0," + (h-padding) + ")")
.call(xaxis);

 svg.selectAll("circle")
      .data(dataset)
      //.data(dataset.slice(0,10)) // only the fisrt 10 are shown
      .enter().append("circle")
      .on("mouseover", function(d){
          dispatch.call("testEvent",d,d);
      })
      .attr("r",r)
      .attr("fill","blue")
      .attr("cx",function(d, i) {
          if (d.average_wages == 0 || d.suicide == 0 ) {return padding;}

                      return  xscale(d.average_wages);
                  })
      .attr("cy",function(d) {
          
          if (d.average_wages == 0 || d.suicide == 0 ) {return padding;}

                  return hscale(d.suicide);

                  })
      .attr("title", function(d) {return d.location;});
}


function gen_scatterplotaverage_wagescancer() {
  var w = 600;
  var h = 300;

  var svg = d3.select("#the_chart")
              .append("svg")
              .attr("width",w)
              .attr("height",h)
  .attr("fill", "blue");


  var padding = 30;
  var bar_w = 15;
  var r = 2;

  var hscale = d3.scaleLinear()
                       .domain([d3.max(dataset, function(d) {
                        return d.cancer;}),d3.min(dataset, function(d) {
                          return d.cancer;})])
                       .range([padding,h-padding]);

  var xscale = d3.scaleLinear()
                     .domain([d3.min(dataset, function(d) {
                      return d.average_wages;}),d3.max(dataset, function(d) {
          return d.average_wages;})])
                     .range([padding,w-padding]);

  var yaxis = d3.axisLeft()
                .scale(hscale);

  var xaxis = d3.axisBottom()
.scale(xscale)
            //.ticks(dataset.length/2);

  var cscale = d3.scaleLinear()
       .domain([d3.min(dataset, function(d) { return  d.average_wages;}),
                d3.max(dataset, function(d) { return d.average_wages;})])
       .range(["red", "blue"]);


 gY = svg.append("g")
   .attr("transform","translate(30,0)")
.attr("class","y axis")
.call(yaxis);


  gX = svg.append("g")
   .attr("transform","translate(0," + (h-padding) + ")")
.call(xaxis);

 svg.selectAll("circle")
      .data(dataset)
      //.data(dataset.slice(0,10)) // only the fisrt 10 are shown
      .enter().append("circle")
      .on("mouseover", function(d){
          dispatch.call("testEvent",d,d);
      })
      .attr("r",r)
      .attr("fill","blue")
      .attr("cx",function(d, i) {
          if (d.average_wages == 0 || d.cancer == 0 ) {return padding;}

                      return  xscale(d.average_wages);
                  })
      .attr("cy",function(d) {
          
          if (d.average_wages == 0 || d.cancer == 0 ) {return padding;}

                  return hscale(d.cancer);

                  })
      .attr("title", function(d) {return d.location;});
}


function gen_scatterplotaverage_wagesalcohol() {
    var w = 600;
    var h = 300;

    var svg = d3.select("#the_chart")
                .append("svg")
                .attr("width",w)
                .attr("height",h)
		.attr("fill", "blue");


    var padding = 30;
    var bar_w = 15;
    var r = 2;

    var hscale = d3.scaleLinear()
                         .domain([d3.max(dataset, function(d) {
                          return d.alcohol;}),d3.min(dataset, function(d) {
                            return d.alcohol;})])
                         .range([padding,h-padding]);

    var xscale = d3.scaleLinear()
                       .domain([d3.min(dataset, function(d) {
                        return d.average_wages;}),d3.max(dataset, function(d) {
				    return d.average_wages;})])
                       .range([padding,w-padding]);

    var yaxis = d3.axisLeft()
                  .scale(hscale);

    var xaxis = d3.axisBottom()
	.scale(xscale)
              //.ticks(dataset.length/2);

    var cscale = d3.scaleLinear()
         .domain([d3.min(dataset, function(d) { return  d.average_wages;}),
                  d3.max(dataset, function(d) { return d.average_wages;})])
         .range(["red", "blue"]);


   gY = svg.append("g")
   	.attr("transform","translate(30,0)")
	.attr("class","y axis")
	.call(yaxis);


    gX = svg.append("g")
   	.attr("transform","translate(0," + (h-padding) + ")")
	.call(xaxis);

   svg.selectAll("circle")
        .data(dataset)
        //.data(dataset.slice(0,10)) // only the fisrt 10 are shown
        .enter().append("circle")
        .on("mouseover", function(d){
            dispatch.call("testEvent",d,d);
        })
        .attr("r",r)
        .attr("fill","blue")
        .attr("cx",function(d, i) {
            if (d.average_wages == 0 || d.alcohol == 0 ) {return padding;}

                        return  xscale(d.average_wages);
                    })
        .attr("cy",function(d) {
            
            if (d.average_wages == 0 || d.alcohol == 0 ) {return padding;}

                    return hscale(d.alcohol);

                    })
        .attr("title", function(d) {return d.location;});
}


function gen_scatterplotaverage_wagessmokers() {
  var w = 600;
  var h = 300;

  var svg = d3.select("#the_chart")
              .append("svg")
              .attr("width",w)
              .attr("height",h)
  .attr("fill", "blue");


  var padding = 30;
  var bar_w = 15;
  var r = 2;

  var hscale = d3.scaleLinear()
                       .domain([d3.max(dataset, function(d) {
                        return d.smokers;}),d3.min(dataset, function(d) {
                          return d.smokers;})])
                       .range([padding,h-padding]);

  var xscale = d3.scaleLinear()
                     .domain([d3.min(dataset, function(d) {
                      return d.average_wages;}),d3.max(dataset, function(d) {
          return d.average_wages;})])
                     .range([padding,w-padding]);

  var yaxis = d3.axisLeft()
                .scale(hscale);

  var xaxis = d3.axisBottom()
.scale(xscale)
            //.ticks(dataset.length/2);

  var cscale = d3.scaleLinear()
       .domain([d3.min(dataset, function(d) { return  d.average_wages;}),
                d3.max(dataset, function(d) { return d.average_wages;})])
       .range(["red", "blue"]);


 gY = svg.append("g")
   .attr("transform","translate(30,0)")
.attr("class","y axis")
.call(yaxis);


  gX = svg.append("g")
   .attr("transform","translate(0," + (h-padding) + ")")
.call(xaxis);

 svg.selectAll("circle")
      .data(dataset)
      //.data(dataset.slice(0,10)) // only the fisrt 10 are shown
      .enter().append("circle")
      .on("mouseover", function(d){
          dispatch.call("testEvent",d,d);
      })
      .attr("r",r)
      .attr("fill","blue")
      .attr("cx",function(d, i) {
          if (d.average_wages == 0 || d.smoker == 0 ) {return padding;}

                      return  xscale(d.average_wages);
                  })
      .attr("cy",function(d) {
          
          if (d.average_wages == 0 || d.smoker == 0 ) {return padding;}

                  return hscale(d.smokers);

                  })
      .attr("title", function(d) {return d.location;});
}