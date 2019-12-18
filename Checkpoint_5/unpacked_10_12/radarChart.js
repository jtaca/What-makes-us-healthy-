const max = Math.max;
const sin = Math.sin;
const cos = Math.cos;
const HALF_PI = Math.PI / 2;

const RadarChart = function RadarChart(parent_selector, data, options, tip7, onCreate, svg, colorLegend) {
	const wrap = (text, width) => {
	  text.each(function() {
			var text = d3.select(this),
				words = text.text().split(/\s+/).reverse(),
				word,
				line = [],
				lineNumber = 0,
				lineHeight = 1.4, // ems
				y = text.attr("y"),
				x = text.attr("x"),
				dy = parseFloat(text.attr("dy")),
				tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

			while (word = words.pop()) {
			  line.push(word);
			  tspan.text(line.join(" "));
			  if (tspan.node().getComputedTextLength() > width) {
					line.pop();
					tspan.text(line.join(" "));
					line = [word];
					tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
			  }
			}
	  });
	}

	const cfg = {
	 w: 600,				//Width of the circle
	 h: 600,				//Height of the circle
	 margin: {top: 20, right: 20, bottom: 20, left: 20}, //The margins of the SVG
	 levels: 3,				//How many levels or inner circles should there be drawn
	 maxValue: 0, 			//What is the value that the biggest circle will represent
	 labelFactor: 1.3, 	//How much farther than the radius of the outer circle should the labels be placed
	 wrapWidth: 50, 		//The number of pixels after which a label needs to be given a new line
	 opacityArea: 0.35, 	//The opacity of the area of the blob
	 dotRadius: 4, 			//The size of the colored circles of each blog
	 opacityCircles: 0.1, 	//The opacity of the circles of each blob
	 strokeWidth: 2, 		//The width of the stroke around each blob
	 roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
	 color: colorLegend,	//Color function,
	 format: '.2%',
	 unit: '',
	 legend: false
	};
	
	if('undefined' !== typeof options){
	  for(var i in options){
		if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
	  }
	}

	let maxValue = 0;
	for (let j=0; j < data.length; j++) {
		for (let i = 0; i < data[j].axes.length; i++) {
			data[j].axes[i]['id'] = data[j].name;
			if (data[j].axes[i]['value'] > maxValue) {
				maxValue = data[j].axes[i]['value'];
			}
		}
	}
	maxValue = max(cfg.maxValue, maxValue);

	const allAxis = data[0].axes.map((i, j) => i.axis),	
		total = allAxis.length,					
		radius = Math.min(cfg.w/2, cfg.h/2), 	
		Format = d3.format(cfg.format),			 	
		angleSlice = Math.PI * 2 / total;		
	
	const rScale = d3.scaleLinear()
		.range([0, radius])
		.domain([0, maxValue]);

	const parent = d3.select(parent_selector);

	let g = onCreate ? svg.append("g").attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/3 + cfg.margin.top) + ")")
	        : svg.select("g");
	
	let filter = null;
	if(onCreate){
	 filter = g.append('defs').append('filter').attr('id','glow'),
		feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
		feMerge = filter.append('feMerge'),
		feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
		feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');
	}else{
		filter = g.select("defs");
	}
	

	let axisGrid = onCreate ? g.append("g").attr("class", "axisWrapper") : g.select(".axisWrapper");
	
	if(onCreate){
		axisGrid.selectAll(".levels")
		.data(d3.range(1,(cfg.levels+1)).reverse())
		.enter()
			.append("circle")
			.attr("class", "gridCircle")
			.attr("r", d => radius / cfg.levels * d)
			.style("fill", "#CDCDCD")
			.style("stroke", "#CDCDCD")
			.style("fill-opacity", cfg.opacityCircles)
			.style("filter" , "url(#glow)");
		
	axisGrid.selectAll(".axisLabel")
	   .data(d3.range(1,(cfg.levels+1)).reverse())
	   .enter().append("text")
	   .attr("class", "axisLabel")
	   .attr("x", 4)
	   .attr("y", d => -d * radius / cfg.levels)
	   .attr("dy", "0.4em")
	   .style("font-size", "10px")
	   .style("text-shadow", "none")
	   .attr("fill", "#737373")
	   .text(d => Format(maxValue * d / cfg.levels) + cfg.unit);
	
	var axis = axisGrid.selectAll(".axis")
		.data(allAxis)
		.enter()
		.append("g")
		.attr("class", "axis");
	//Append the lines
	axis.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", (d, i) => rScale(maxValue *1) * cos(angleSlice * i - HALF_PI))
		.attr("y2", (d, i) => rScale(maxValue* 1) * sin(angleSlice * i - HALF_PI))
		.attr("class", "line")
		.style("stroke", "#CDCDCD")
		.style("stroke-width", "1px");

	//Append the labels at each axis
	axis.append("text")
		.attr("class", "legend")
		.style("font-size", "11px")
		.attr("text-anchor", "middle")
		.attr("dy", "0.35em")
		.attr("x", 
			function (d,i){ 
				if(d=="Life expectancy at birth" || d=="Life expectancy at 65"){
					return rScale(maxValue ) * cos(angleSlice * i - HALF_PI);
				} else if (d=="Alcohol"){
					return rScale(maxValue ) * cos(angleSlice * i - HALF_PI);
				}else{
					return rScale(maxValue * cfg.labelFactor) * cos(angleSlice * i - HALF_PI);
				}
			})
		.attr("y", (d,i) => rScale(maxValue * cfg.labelFactor) * sin(angleSlice * i - HALF_PI))
		.text(d => d)
		.call(wrap, cfg.wrapWidth);
	}
	/////////////////////////////////////////////////////////
	///////////// Draw the radar chart blobs ////////////////
	/////////////////////////////////////////////////////////

	//The radial line function
	const radarLine = d3.radialLine()
		.curve(d3.curveLinearClosed)
		.radius(d => rScale(d.value))
		.angle((d,i) => i * angleSlice);

	if(cfg.roundStrokes) {
		radarLine.curve(d3.curveCardinalClosed)
	}

	//Create a wrapper for the blobs
	
	let blobWrapper = null;
	let blobCircleWrapper = null;
	if(onCreate){
		blobWrapper = g.selectAll(".radarWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarWrapper");
		
		blobWrapper
		.append("path")
		.attr("class", "radarArea")
		.attr("d", d => radarLine(d.axes))
		.style("fill", cfg.color)
		.style("fill-opacity", cfg.opacityArea)
		.on('mouseover', function(d, i) {
			//Dim all blobs
			parent.selectAll(".radarArea")
				.transition().duration(300)
				.style("fill-opacity", 0.1);
			//Bring back the hovered over blob
			d3.select(this)
				.transition().duration(300)
				.style("fill-opacity", 0.7);
		})
		.on('mouseout', () => {
			//Bring back all blobs
			parent.selectAll(".radarArea")
				.transition().duration(300)
				.style("fill-opacity", cfg.opacityArea);
		});

		blobWrapper.append("path")
		.attr("class", "radarStroke")
		.attr("id", (d,i)=>"stoke"+i)
		.attr("d", function(d,i) { return radarLine(d.axes); })
		.style("stroke-width", cfg.strokeWidth + "px")
		.style("stroke", cfg.color)
		.style("fill", "none")
		.style("filter" , "url(#glow)");

		blobWrapper.selectAll(".radarCircle")
		.data(d => d.axes)
		.enter()
		.append("circle")
		.attr("class", "radarCircle")
		.attr("id",(d,i) => "circle"+i)
		.attr("r", cfg.dotRadius)
		.attr("cx", (d,i)=> rScale(d.value) * cos(angleSlice * i - HALF_PI))
		.attr("cy", (d,i) => rScale(d.value) * sin(angleSlice * i - HALF_PI))
		.style("fill", cfg.color)
		.style("fill-opacity", 0.8);

		//Wrapper for the invisible circles on top
		 blobCircleWrapper = g.selectAll(".radarCircleWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarCircleWrapper");

	//Append a set of invisible circles on top for the mouseover pop-up
	blobCircleWrapper.selectAll(".radarInvisibleCircle")
		.data(d => d.axes)
		.enter().append("circle")
		.attr("class", "radarInvisibleCircle")
		.attr("id",(d,i) => d.axis)
		.attr("r", cfg.dotRadius * 1.5)
		.attr("cx", (d,i) => rScale(d.value) * cos(angleSlice*i - HALF_PI))
		.attr("cy", (d,i) => rScale(d.value) * sin(angleSlice*i - HALF_PI))
		.style("fill", "none")
		.style("pointer-events", "all")
		.on('mouseover', tip7.show)
		.on('mouseout', tip7.hide);

	}else{
		blobWrapper = g.selectAll(".radarWrapper").data(data);

		blobWrapper.select(".radarArea")
		.transition()
		.duration(1000)
		.style("fill-opacity", cfg.opacityArea)
		.style("fill", cfg.color)
		.attr("d", d => radarLine(d.axes));

		blobWrapper.select(".radarStroke")
		.transition()
		.duration(1000)
		.style("stroke", cfg.color)
		.style("filter" , "url(#glow)")
		.attr("d", d => radarLine(d.axes));

		var nrOfCircles = blobWrapper.selectAll(".radarCircle").size();
		
		for(var k = 0; k < nrOfCircles; k++){
			blobWrapper.select("#circle"+k)
			.transition()
			.duration(1000)
			.style("fill", cfg.color)
			.attr("cx", rScale(data[0].axes[k].value) * cos(angleSlice * k - HALF_PI))
			.attr("cy", rScale(data[0].axes[k].value) * sin(angleSlice * k - HALF_PI))
		};

		//Wrapper for the invisible circles on top
		blobCircleWrapper = g.selectAll(".radarCircleWrapper").data(data);

		
		blobCircleWrapper.selectAll(".radarInvisibleCircle")
		.data(d=>d.axes)
		.on("mouseover", tip7.show)
		.on("mouseout", tip7.hide)
		.transition()
		.duration(1000)
		.attr("cx", (d,i) => rScale(d.value) * cos(angleSlice*i - HALF_PI))
		.attr("cy", (d,i) => rScale(d.value) * sin(angleSlice*i - HALF_PI));
		
	
	}

	return svg;
}
