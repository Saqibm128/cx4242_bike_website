async function get_all_uber_rides_for_day(day, month, year) {
  // This is an async function
  // Example usage: get_all_uber_rides_for_day(1,10,2014).then(function(res) { svgText.text(res) })
  let result = await fetch("http://ec2-18-212-131-13.compute-1.amazonaws.com:5000/uber_ride", {
      "method": "POST", "headers":{"Content-Type":"application/json"},
      "body": JSON.stringify({
          "condition": "where day in " + day + " and year=" + year + " and month = " + month
      })
  })

  let resultJson = await result.json()
  return resultJson
}

async function get_distance_between(startLatLng, endLatLng) {
  var currDistance = null
  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
      origins: [new google.maps.LatLng(startLatLng[0], startLatLng[1])],
      destinations: [new google.maps.LatLng(endLatLng[0], endLatLng[1])],
      travelMode: 'DRIVING'
    }, callback);

  function callback(res) {
    currDistance = res.rows[0].elements[0].distance.value
  }
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  while (currDistance == null) {
    await sleep(200)
  }
  return currDistance
}

async function get_all_uber_rides_for_day_near_lat_lng(day, month, year, startLatLng, endLatLng) {
  // This is an async function
  // Example usage: get_all_uber_rides_for_day(1,10,2014).then(function(res) { svgText.text(res) })
  let result = await fetch("http://ec2-18-212-131-13.compute-1.amazonaws.com:5000/uber_ride/latLng", {
      "method": "POST", "headers":{"Content-Type":"application/json"},
      "body": JSON.stringify({
          "day": day,
          "month": month,
          "year": year,
          "start": {"lat": startLatLng[0], "lng": startLatLng[1]},
          "end": {"lat": endLatLng[0], "lng": endLatLng[1]}
      })
  })

  let resultJson = await result.json()
  return resultJson
}

async function get_all_uber_rides_for_day_mean_speed(day, month, year, startLatLng, endLatLng) {
  // console.log(day)
  res = await get_all_uber_rides_for_day_near_lat_lng(day, month, year, startLatLng, endLatLng)
  // console.log(res)
  // console.log(res["columns"].indexOf("speed_mph_mean"))
  speeds = res["values"].map((x)=>x[res["columns"].indexOf("speed_mph_mean")])
  sumSpeeds = speeds.reduce((total, speed) => total + speed)
  // console.log("hi")
  return sumSpeeds / speeds.length
}


width_user_input = 600
height_user_input = 600
width_trip_info = 800
height_trip_info = 600
width_map = 600
height_map = 600
startLatLng = null
endLatLng = null
startMarker = null
endMarker = null
var month = null
var day = null
var year = 2019

var result = fetch("http://ec2-18-212-131-13.compute-1.amazonaws.com:5000/uber_ride", {
    "method": "POST", "headers":{"Content-Type":"application/json"},
    "body": JSON.stringify({
        "condition": "where day in (26, 27)"
    })
}).then(function(d) {
    return (d.json())
}).then(function(d) {console.log(d)})

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
				.attr("class", "uber_text")
  				.style("fill", "white")
  				.text(function(d, i) {
    				return uberTripNums[i] + " " + d;
  				});

function update_all() {
  update_uber()
  addUberResults(uberTripNums)
}

function update_uber() {
  svg2.selectAll("uber_text").text(function(d, i) {
    return uberTripNums[i] + " " + d;
  });
}

bikeInfo = svg2.selectAll("bike_text")
				.data(tripLabels)
				.enter()
				.append("text")
				.attr("transform", "translate(" + width_trip_info/2 + "," + ((1/5)*height_trip_info - 50)  + ")")
  				.attr('x', 0.3*width_trip_info)
  				.attr('y', function(d, i) {
    					return ((i+1) * 150);
  				})
				.attr("class", "bike_text")
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

function getUserInfo() {
	var userInfo = [];

	 month = document.querySelector("input[name=month]").value;
	 day = document.querySelector("input[name=day]").value;
	 time = document.querySelector("input[name=time]").value;
	 weight = document.querySelector("input[name=weight]").value;
	 height = document.querySelector("input[name=height]").value;
	 userInfo.push(month, day, time, weight, height)
   if (startLatLng !== null && endLatLng !== null) {
     // console.log("hi")
     get_all_uber_rides_for_day_mean_speed(day, month, year, startLatLng, endLatLng).then((uberRes)=>{



       get_distance_between(startLatLng, endLatLng).then((googleRes)=>{
         uberDistance = (googleRes * 0.000621371)
         num_minutes = ((googleRes * 0.000621371) / uberRes * 60)
         uberTime = num_minutes
         uberTripNums[0] = num_minutes
         update_all()
       })
     })


   }
	return userInfo;
};

function calories_burnt_biking(weight, distance_biked){
    var cals_burned = 0;
    if(weight>= 125){
        cals_burned = Math.round((40 + ((weight-125) * 0.32)) * distance_biked);
    }
    else{
        cals_burned = Math.round((25 + ((weight-75) * 0.32)) * distance_biked);
    }

    return cals_burned;
};

function co2_emissions_per_ride(distance_ride){
    var co2 = Math.round(404 * distance_ride);
    return co2;
};

function addUberResults(uberTripNums) {
	//uberTripNums = [time, calories, emissions]
	svg2.selectAll(".uber_text").remove();

	svg2.selectAll("#uber_text")
				.data(tripLabels)
				.enter()
				.append("text")
				.attr("transform", "translate(" + 0 + "," + ((1/5)*height_trip_info - 50)  + ")")
  				.attr('x', 0.1*width_trip_info)
  				.attr('y', function(d, i) {
    					return ((i+1) * 150);
  				})
  				.attr("class", "uber_text")
  				.style("fill", "white")
  				.text(function(d, i) {
    				return uberTripNums[i] + " " + d;
  				});
}

function addBikeResults(bikeTripNums) {
	//bikeTripNums = [time, calories, emissions]
	svg2.selectAll(".bike_text").remove();

	svg2.selectAll("#bike_text")
				.data(tripLabels)
				.enter()
				.append("text")
				.attr("transform", "translate(" + width_trip_info/2 + "," + ((1/5)*height_trip_info - 50)  + ")")
  				.attr('x', 0.3*width_trip_info)
  				.attr('y', function(d, i) {
    					return ((i+1) * 150);
  				})
  				.attr("class", "bike_text")
  				.style("fill", "white")
  				.text(function(d, i) {
    				return bikeTripNums[i] + " " + d;
  				});

};

var uberDistance = 0;
var uberTime = 0;

function compareTrips() {
	var userInfo = getUserInfo();
	var weight = userInfo[3];
	//Process user info
	//Get distance and time estimates (currently random nums to check)

	//Citibike
	var bikeDistance = Math.random();
	var bikeTime = Math.random();
	var bikeCalories = calories_burnt_biking(weight, bikeDistance);
	var bikeEmissions = 0;


	//Uber
	// var uberDistance = Math.random();
	// var uberTime = Math.random();
	var uberCalories = 0;
	var uberEmissions = co2_emissions_per_ride(uberDistance);


	var uberResults = [uberTime, uberCalories, uberEmissions]; //[time, calories, emissions]
	var bikeResults = [bikeTime, bikeCalories, bikeEmissions]; //[time, calories, emissions]

	addBikeResults(bikeResults);
	addUberResults(uberResults);
};

document.addEventListener("DOMContentLoaded", function(event) {
  var button = document.querySelector("input[name=compareTripsButton]");
  button.addEventListener("click", compareTrips, false);
//var button = document.getElementById("compareTripsButton");
//if(button){
  //button.addEventListener("click", compareTrips, false);
//} else {
	//console.log(button);
//}
  var map = L.map('map' /* The id of the DOM element that will contain the map */);

  map.setView([40.703312, -73.97968], 10);

  var baseLayer = L.tileLayer('https://maps{s}.nyc.gov/tms/1.0.0/carto/basemap/{z}/{x}/{y}.jpg', {
    minNativeZoom: 8,
    maxNativeZoom: 19,
    subdomains: '1234',
    tms: true,
    bounds: L.latLngBounds([39.3682, -75.9374], [42.0329, -71.7187])
  });

  map.addLayer(baseLayer);

  var labelLayer = L.tileLayer('https://maps{s}.nyc.gov/tms/1.0.0/carto/label/{z}/{x}/{y}.png8', {
    minNativeZoom: 8,
    maxNativeZoom: 19,
    subdomains: '1234',
    tms: true,
    bounds: L.latLngBounds([40.0341, -74.2727], [41.2919, -71.9101])
  });

  map.addLayer(labelLayer);

  map.on('click', function(e){
  var coord = e.latlng;
  var lat = coord.lat;
  var lng = coord.lng;
  console.log("You clicked the map at latitude: " + lat + " and longitude: " + lng);
  if (startLatLng == null) {
    startMarker = L.marker([lat, lng]).addTo(map);
    startLatLng = [lat, lng]
    startMarker.bindPopup("Start Location!").openPopup();
  } else if (endLatLng == null) {
    endLatLng = [lat, lng]
    endMarker = L.marker([lat, lng]).addTo(map);
    endMarker.bindPopup("End Location!").openPopup();
  } else {
    map.removeLayer(startMarker)
    map.removeLayer(endMarker)
    startMarker = L.marker([lat, lng]).addTo(map);
    startLatLng = [lat, lng]
    startMarker.bindPopup("Start Location!").openPopup();
    endLatLng = null
  }
  });
});

// var googleMap;
// function initMap() {
//     var googleMap = new google.maps.Map(document.getElementById('map'), {
//       center: {lat: -34.397, lng: 150.644},
//       zoom: 8
//     });
//   }
