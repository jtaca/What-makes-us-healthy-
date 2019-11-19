var drag = d3.drag()
	.on("start", started),

	data = [
		{x: 40, y: 40, w: 250, title: "Drag me", text: "Thoughtfully redesigning OS X meant going deep into every aspect of the interface and focusing on details large and small. There are obvious changes to big things, like translucency in windows and streamlined toolbars. And there are more subtle changes to a lot of small things, like the buttons, icons, and font you see throughout the system. The more you use your Mac, the more you’ll notice, and the more you’ll love it."},
		{x: 170, y: 310, w: 300, title: "Drag me", text: "By adding translucency to certain interface elements in OS X Yosemite, we’ve put a greater emphasis on your content. Translucent toolbars let you know there’s more to see than what’s visible in the window as you scroll. And a translucent sidebar lets you see what’s hidden behind the active window. So the interface takes on the look of your desktop image and your content — making your Mac experience different from anyone else’s."},
		{x: 400, y: 80, w: 300, title: "Info", text: "Try dragging windows around. Have fun!"}
	],

	winElems = d3.select("body").selectAll("article")
		.data(data)
		.enter()
		.append("article")
		.attr("class", "draggable")
		.style("left", function(d) { return d.x + "px"; })
        .style("top", function(d) { return d.y + "px"; })
		.style("width", function(d) { return d.w + "px"; })
		.style("z-index", function(d,i) { return i; });

winElems
	.append("div")
	.attr("class", "title")
	.html(function(d) { return "<h2>" + d.title + " </h2>"; });

winElems
	.append("div")
	.attr("class", "content")
	.html(function(d) { return "<p>" + d.text + " </p>"; });

winElems.call(drag);

function started() {
	console.log("drag start");
	var dragElem = d3.select(this).classed("dragging", true);
	
	// Z-index switch - needs improvement
	winElems.style("z-index", -1);
	dragElem.style("z-index", 100);

	d3.event.on("drag", dragged).on("end", ended);

	function dragged(d) {
		d.x = d3.event.x;
		d.y = d3.event.y;
		dragElem
			.style("left", d.x + "px")
			.style("top", d.y + "px");
	}

	function ended() {
		console.log("drag stop");
		dragElem.classed("dragging", false);
	}
}