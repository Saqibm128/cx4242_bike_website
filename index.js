width_info = 600
width_info = 1000
height_info = 600
width_map = 600
height_map = 600

//Create a color scheme
//http://colorbrewer2.org/#type=sequential&scheme=GnBu&n=6
//From white to green to blue
var color = ["#f0f9e8","#ccebc5", "#a8ddb5", "#7bccc4", "#43a2ca", "#0868ac"]

//Info svg is on the left side of the screen
var svg1 = d3.select("#svg_info");
svg1.append("rect")
    .attr("width", width_info)
    .attr("height", height_info)
    .attr("fill-opacity","0.5")
    .style("fill", function(d){return "white"});

//Map svg is on the right side of the screen
var svg2 = d3.select("#svg_map");
svg2.append("rect")
    .attr("width", width_map)
    .attr("height", height_map)
    .attr("fill-opacity","0.5")
    .style("fill", function(d){return color[0]});

svg1.append("rect")
	.attr("transform", "translate(" + 0 + "," + (2/4)*height_info + ")")
    .attr("width", width_info/2 - 1)
    .attr("height", (2/4)*height_info)
    .attr("fill-opacity","1")
    .style("fill", function(d){return color[5]})

svg1.append("text")
	.attr("transform", "translate(" + 0 + "," + (2/4)*height_info + ")")
    .attr("x", 10)
    .attr("y", 30)
    .attr("font-size", "20px")
    .style("fill", "white")
    .attr("font-weight", "bold")
    .text("Your trip with Uber");

svg1.append("rect")
	.attr("transform", "translate(" + width_info/2 + "," + (2/4)*height_info + ")")
    .attr("width", width_info/2 - 1)
    .attr("height", (2/4)*height_info)
    .attr("fill-opacity","1")
    .style("fill", function(d){return color[2]});

svg1.append("text")
	.attr("transform", "translate(" + width_info/2 + "," + (2/4)*height_info + ")")
    .attr("x", 10)
    .attr("y", 30)
    .attr("font-size", "20px")
    .attr("font-weight", "bold")
    .text("Your trip with CitiBike");

tripLabels = ["Estimated time (min):", "Distance travelled (km):", "Calories burned (kCal):", "CO2 Emissions:"]
uberTripNums = [0, 0, 0, 0]
bikeTripNums = [0, 0, 0, 0]

uberInfo = svg1.selectAll("uber_text")
				.data(tripLabels)
				.enter()
				.append("text")
				.attr("transform", "translate(" + 0 + "," + ((2/4)*height_info+30)  + ")")
  				.attr('x', 10)
  				.attr('y', function(d, i) {
    					return ((i+1) * 30);
  				})
  				.style("fill", "white")
  				.text(function(d, i) {
    				return d + " " + uberTripNums[i];
  				});

bikeInfo = svg1.selectAll("bike_text")
				.data(tripLabels)
				.enter()
				.append("text")
				.attr("transform", "translate(" + width_info/2 + "," + ((2/4)*height_info+30)  + ")")
  				.attr('x', 10)
  				.attr('y', function(d, i) {
    					return ((i+1) * 30);
  				})
  				.style("fill", "black")
  				.text(function(d, i) {
    				return d + " " + bikeTripNums[i];
  				});

images = ["../images/time.png", "../images/distance.png", "../images/health.png", "../images/environment.png"]

svg1.selectAll("uber_rectangles")
	.data(images)
	.enter()
	.append("rect")
	.attr("transform", "translate(" + 0 + "," + ((2/4)*height_info+30*6)  + ")")
	.attr("width", 100)
	.attr("height", 100)
	.attr("x", function(d, i) {
		return(15 + i*120)
	})
	.attr("y", 0)
	.style("fill", "white")
	.style("stroke", "gray")
	.style("stroke-width", 10)

svg1.selectAll("bike_rectangles")
	.data(images)
	.enter()
	.append("rect")
	.attr("transform", "translate(" + width_info/2 + "," + ((2/4)*height_info+30*6)  + ")")
	.attr("width", 100)
	.attr("height", 100)
	.attr("x", function(d, i) {
		return(15 + i*120)
	})
	.attr("y", 0)
	.style("fill", "white")
	.style("stroke", "gray")
	.style("stroke-width", 10)

addUberImages = svg1.selectAll("uber_images")
				.data(images)
				.enter()
				.append("image")
				.attr("transform", "translate(" + 0 + "," + ((2/4)*height_info+30*6)  + ")")
				.attr("xlink:href", function (d, i) {return images[i];})
				.attr("x", function(d, i) {
					return(15 + i*120)
				})
				.attr("y", 0)

addBikeImages = svg1.selectAll("bike_images")
				.data(images)
				.enter()
				.append("svg:image")
				.attr("transform", "translate(" + width_info/2 + "," + ((2/4)*height_info+30*6)  + ")")
				.attr("xlink:href", function (d, i) {return images[i];})
				.attr("x", function(d, i) {
					return(15 + i*120)
				})
				.attr("y", 0)

introText = ["Welcome to CitiBike vs. Uber!", "This tool is designed to help you decide which mode of transportation to use for your trip", "based on what you value most. To use:", "1) Enter your start and end location on the map", "2) Enter your weight in kg and height in meters", "3) Click 'Compare Trips'"]


svg1.selectAll("intro_text")
		.data(introText)
		.enter()
		.append("text")
		.attr("transform", "translate(" + 0 + "," + 0  + ")")
			.attr('x', 10)
			.attr('y', function(d, i) {
				return ((i+1) * 30);
			})
			.style("fill", "black")
			.text(function(d, i) {
			return introText[i];
			});
