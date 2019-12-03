var chartDiv = document.getElementById("comparison");
var svg = d3.select(chartDiv).append("svg");

// Extract the width and height that was computed by CSS.
var width = chartDiv.clientWidth;
var height = chartDiv.clientHeight;

// Use the extracted size to set the size of an SVG element.
svg
  .attr("width", width)
  .attr("height", height);

//Putting content in the Trip Info area
var labelHeaders = ["MEAN TIME", "MEAN CALORIES BURNT", "MEAN EMISSIONS"]
var tripLabels = ["min", "kCal", "g CO2"]
var uberTripNums = [0, 0, 0]
var bikeTripNums = [0, 0, 0]
var logos = ["../images/uber.png", "../images/citibike.png"]

addUberLogo = svg.selectAll("uber_logo")
        .data([logos[0]])
        .enter()
        .append("image")
        .attr("xlink:href", function (d) {return logos[0];})
        .attr("height", 70)
        .attr("width", 100)
        .attr("x", 10)
        .attr("y", 0)

addBikeLogo = svg.selectAll("bike_logo")
        .data([logos[1]])
        .enter()
        .append("image")
        .attr("transform", "translate(" + ((width/2)) + ",0)")
        .attr("xlink:href", function (d) {return logos[1];})
        .attr("height", 200)
        .attr("width", 200)
        .attr("x", 10)
        .attr("y", -60)

labelHeads = svg.selectAll("headers_text")
.data(labelHeaders)
.enter()
.append("text")
.attr("text-anchor","middle")
.attr("transform", "translate(" + (0.5*width) + ",50)")
  .attr('y', function(d, i) {
      return ((i)*height/3);
  })
  .attr("text-anchor", "middle")
  .style("fill", "white")
  .attr("font-weight", "bold")
  .text(function(d) {
    return d;
  });

uberInfo = svg.selectAll("uber_text")
.data(tripLabels)
.enter()
.append("text")
.attr("transform", "translate(0,"+(0.25*height)+")")
  .attr('x', 0.1*width)
  .attr('y', function(d, i) {
      return ((i) * height/3);
  })
.attr("class", "uber_text")
  .style("fill", "white")
  .text(function(d, i) {
    return uberTripNums[i] + " " + d;
  });

bikeInfo = svg.selectAll("bike_text")
.data(tripLabels)
.enter()
.append("text")
.attr("transform", "translate("+(0.5*width)+","+(0.25*height)+")")
  .attr('x', 0.2*width)
  .attr('y', function(d, i) {
      return ((i) * height/3);
  })
.attr("class", "bike_text")
  .style("fill", "white")
  .text(function(d, i) {
    return bikeTripNums[i] + " " + d;
  });

