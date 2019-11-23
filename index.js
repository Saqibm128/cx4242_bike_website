width_user_input = 600
height_user_input = 600
width_trip_info = 800
height_trip_info = 600
width_map = 600
height_map = 600

var svg1 = d3.select("#svg_user_input");
svg1.append("rect")
    .attr("width", width_user_input)
    .attr("height", height_user_input)
    .attr("fill-opacity","0.9")
    .style("fill", function(d){return "#003366"});

var svg2 = d3.select("#svg_trip_info");
svg2.append("rect")
    .attr("width", width_trip_info)
    .attr("height", height_trip_info)
    .attr("fill-opacity","0.7")
    .style("fill", function(d){return "#003366"});

var svg3 = d3.select("#svg_map");
svg3.append("rect")
    .attr("width", width_map)
    .attr("height", height_map)
    .attr("fill-opacity","1")
    .style("fill", function(d){return "yellow"});

//Putting content in the User Input area
svg1.append("text")
	.attr("transform", "translate(" + width_user_input/2 + "," + 0 + ")")
    .attr("x", 0)
    .attr("y", 35)
    .attr("font-size", "32px")
    .attr("text-anchor", "middle")
    .attr("font-weight", "bold")
    .style("fill", "white")
    .text("Welcome to CitiBike vs. Uber!");

var introText = ["This tool is designed to help you decide which mode ", "of transportation to use for your trip based ", "on what you value most.", "To use:", "1) Enter your start and end location on the map", "2) Enter your weight in kg and height in meters", "3) Click 'Compare Trips'"]


svg1.selectAll("intro_text")
		.data(introText)
		.enter()
		.append("text")
		.attr("transform", "translate(" + 0 + "," + 50  + ")")
			.attr('x', 10)
			.attr('y', function(d, i) {
				return ((i+1) * 35);
			})
			.style("fill", "white")
			.text(function(d, i) {
			return introText[i];
			});

//Putting content in the Trip Info area
var labelHeaders = ["MEAN TIME", "MEAN CALORIES BURNT", "MEAN EMISSIONS"]
var tripLabels = ["min", "kCal", "g CO2"]
var uberTripNums = [0, 0, 0]
var bikeTripNums = [0, 0, 0]
var logos = ["../images/uber.png", "../images/citibike.png"]

labelHeads = svg2.selectAll("headers_text")
				.data(labelHeaders)
				.enter()
				.append("text")
				.attr("transform", "translate(" + ((1/2)*width_trip_info) + "," + ((1/5)*height_trip_info - 120)  + ")")
  				.attr('x', 10)
  				.attr('y', function(d, i) {
    					return ((i+1) * 150);
  				})
  				.attr("text-anchor", "middle")
  				.style("fill", "white")
  				.attr("font-weight", "bold")
  				.text(function(d) {
    				return d;
  				});

uberInfo = svg2.selectAll("uber_text")
				.data(tripLabels)
				.enter()
				.append("text")
				.attr("transform", "translate(" + 0 + "," + ((1/5)*height_trip_info - 50)  + ")")
  				.attr('x', 0.1*width_trip_info)
  				.attr('y', function(d, i) {
    					return ((i+1) * 150);
  				})
  				.style("fill", "white")
  				.text(function(d, i) {
    				return uberTripNums[i] + " " + d;
  				});

bikeInfo = svg2.selectAll("bike_text")
				.data(tripLabels)
				.enter()
				.append("text")
				.attr("transform", "translate(" + width_trip_info/2 + "," + ((1/5)*height_trip_info - 50)  + ")")
  				.attr('x', 0.3*width_trip_info)
  				.attr('y', function(d, i) {
    					return ((i+1) * 150);
  				})
  				.style("fill", "white")
  				.text(function(d, i) {
    				return bikeTripNums[i] + " " + d;
  				});

addUberLogo = svg2.selectAll("uber_logo")
				.data([logos[0]])
				.enter()
				.append("image")
				.attr("xlink:href", function (d) {return logos[0];})
				.attr("x", 20)
				.attr("y", 20)

addBikeLogo = svg2.selectAll("bike_logo")
				.data([logos[1]])
				.enter()
				.append("image")
				.attr("transform", "translate(" + ((width_trip_info/2)-150) + "," + (-60) + ")")
				.attr("xlink:href", function (d) {return logos[1];})
				.attr("x", 10)
				.attr("y", 10)
