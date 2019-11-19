width_info = 600
height_info = 600
width_map = 800
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
    .style("fill", function(d){return color[0]});

//Map svg is on the right side of the screen
var svg2 = d3.select("#svg_map");
svg2.append("rect")
    .attr("width", width_map)
    .attr("height", height_map)
    .attr("fill-opacity","0.5")
    .style("fill", function(d){return color[0]});

svg1.append("rect")
	.attr("transform", "translate(" + 0 + "," + (1/3)*height_info + ")")
    .attr("width", width_info/2 - 1)
    .attr("height", (2/3)*height_info)
    .attr("fill-opacity","1")
    .style("fill", function(d){return color[5]})

svg1.append("text")
	.attr("transform", "translate(" + 0 + "," + (1/3)*height_info + ")")
    .attr("x", 0)
    .attr("y", 20)
    .attr("font-size", "20px")
    .text("Uber results go here");

svg1.append("rect")
	.attr("transform", "translate(" + width_info/2 + "," + (1/3)*height_info + ")")
    .attr("width", width_info/2 - 1)
    .attr("height", (2/3)*height_info)
    .attr("fill-opacity","1")
    .style("fill", function(d){return color[2]});

svg1.append("text")
	.attr("transform", "translate(" + width_info/2 + "," + (1/3)*height_info + ")")
    .attr("x", 0)
    .attr("y", 20)
    .attr("font-size", "20px")
    .text("Citibike results go here");

svg1.append("text")
	.attr("transform", "translate(" + 0 + "," + 0 + ")")
    .attr("x", 0)
    .attr("y", 20)
    .attr("font-size", "20px")
    .text("Introduction and user input go here");

// svg2.append("text")
// 	.attr("transform", "translate(" + 0 + "," + 0 + ")")
//     .attr("x", 0)
//     .attr("y", 20)
//     .attr("font-size", "20px")
//     .text("Map display goes here");



// var map = L.map('#map').setView([51.505, -0.09], 13);
//
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);
//
// L.marker([51.5, -0.09]).addTo(map)
//     .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
//     .openPopup();
