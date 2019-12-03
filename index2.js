var result = fetch("http://ec2-18-212-131-13.compute-1.amazonaws.com:5000/uber_ride", {
    "method": "POST", "headers":{"Content-Type":"application/json"},
    "body": JSON.stringify({
        "condition": "where day in (26, 27)"
    })
}).then(function(d) {
    return (d.json())
}).then(function(d) {console.log(d)})

// initialize the map
var map = L.map('leafletmap').setView([40.75, -73.98], 13);

// load a tile layer
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox.streets',
  accessToken: 'pk.eyJ1IjoiZGpoYWlsIiwiYSI6ImNrMzkyMmRwcjBlNXozaHFzNmdtbzlkNzUifQ.luDWvELbHjFLiprKNQaF0w'
}).addTo(map);

startLatLng = [40.75, -73.98]
endLatLng = [40.754, -73.984]

control = L.Routing.control({
  waypoints: [
    startLatLng,
    endLatLng
  ]
}).addTo(map);

function createButton(label, container) {
    var btn = L.DomUtil.create('button', '', container);
    btn.setAttribute('type', 'button');
    btn.innerHTML = label;
    return btn;
}

map.on('click', function(e) {
    var container = L.DomUtil.create('div'),
        startBtn = createButton('Start from this location', container),
        destBtn = createButton('Go to this location', container);

    L.popup()
        .setContent(container)
        .setLatLng(e.latlng)
        .openOn(map);

    L.DomEvent.on(startBtn, 'click', function() {
      startLatLng = e.latlng;
      control.spliceWaypoints(0, 1, e.latlng);
      map.closePopup();
      console.log(startLatLng)
    });

    L.DomEvent.on(destBtn, 'click', function() {
      endLatLng = e.latlng;
      control.spliceWaypoints(control.getWaypoints().length - 1, 1, e.latlng);
      map.closePopup();
      console.log(endLatLng)
    });
});

// async function getJankRoute() {
//   let result = await fetch("http://ec2-18-212-131-13.compute-1.amazonaws.com:5000/uber_ride/get_route", {
//       "method": "POST", "headers":{"Content-Type":"application/json"},
//       "body": JSON.stringify({
//           "condition": "where day in " + day + " and year=" + year + " and month = " + month
//       })
//   })

//   let resultJson = await result.json()
//   return resultJson
// }

function drawPath(coordList) {
  var polyline = L.polyline(coordList).addTo(map);
}

// drawPath([startLatLng, [40.755, -73.99], endLatLng]);




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

// addUberLogo = svg.selectAll("uber_logo")
//         .data([logos[0]])
//         .enter()
//         .append("image")
//         .attr("xlink:href", function (d) {return logos[0];})
//         .attr("x", 20)
//         .attr("y", 20)

// addBikeLogo = svg.selectAll("bike_logo")
//         .data([logos[1]])
//         .enter()
//         .append("image")
//         .attr("transform", "translate(" + ((width_trip_info/2)-150) + "," + (-60) + ")")
//         .attr("xlink:href", function (d) {return logos[1];})
//         .attr("x", 10)
//         .attr("y", 10)

labelHeads = svg.selectAll("headers_text")
.data(labelHeaders)
.enter()
.append("text")
.attr("text-anchor","middle")
.attr("transform", "translate(" + (0.5*width) + ",30)")
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
.attr("transform", "translate(0,"+(0.2*height)+")")
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
.attr("transform", "translate("+(0.5*width)+","+(0.2*height)+")")
  .attr('x', 0.2*width)
  .attr('y', function(d, i) {
      return ((i) * height/3);
  })
.attr("class", "bike_text")
  .style("fill", "white")
  .text(function(d, i) {
    return bikeTripNums[i] + " " + d;
  });



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

async function get_biking_distance_between(startLatLng, endLatLng) {
  var currDistance = null
  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
      origins: [new google.maps.LatLng(startLatLng[0], startLatLng[1])],
      destinations: [new google.maps.LatLng(endLatLng[0], endLatLng[1])],
      travelMode: 'bicycling'
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


async function get_all_citibike_rides_for_day_near_lat_lng(day, month, year, startLatLng, endLatLng) {
  // This is an async function
  // Example usage: get_all_uber_rides_for_day(1,10,2014).then(function(res) { svgText.text(res) })
  let result = await fetch("http://ec2-18-212-131-13.compute-1.amazonaws.com:5000/citibike/latLng", {
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
  svg.selectAll(".uber_text").remove();

  svg.selectAll("#uber_text")
        .data(tripLabels)
        .enter()
        .append("text")
        .attr("transform", "translate(" + 0 + "," + (0.2*height)  + ")")
          .attr('x', 0.1*width)
          .attr('y', function(d, i) {
              return ((i) * height/3);
          })
          .attr("class", "uber_text")
          .style("fill", "white")
          .text(function(d, i) {
            return uberTripNums[i] + " " + d;
          });
}

function addBikeResults(bikeTripNums) {
  //bikeTripNums = [time, calories, emissions]
  svg.selectAll(".bike_text").remove();

  svg.selectAll("#bike_text")
        .data(tripLabels)
        .enter()
        .append("text")
        .attr("transform", "translate(" + (width/2) + "," +  (0.2*height)    + ")")
          .attr('x', 0.2*width)
          .attr('y', function(d, i) {
              return ((i) * height/3);
          })
          .attr("class", "bike_text")
          .style("fill", "white")
          .text(function(d, i) {
            return bikeTripNums[i] + " " + d;
          });
};

function update_uber() {
  svg.selectAll("uber_text").text(function(d, i) {
    return uberTripNums[i] + " " + d;
  });
}

function update_uber() {
  svg.selectAll("bike_text").text(function(d, i) {
    return bikeTripNums[i] + " " + d;
  });
}

function update_all() {
  update_uber()
  update_bike()
  addUberResults(uberTripNums)
}

function getUserInfo() {
  var userInfo = [];

  var weight = document.querySelector("input[name=weight]").value;
  var height = document.querySelector("input[name=height]").value;
  var datetime = new Date(document.querySelector("input[name=myLocalDate]").value);

  var time = datetime.getHours() + ":" + datetime.getMinutes();
  var day = datetime.getDate();
  var month = datetime.getMonth() + 1;
  var year = datetime.getFullYear();

  userInfo.push(month, day, time, weight, height)
  console.log(userInfo);
  console.log(startLatLng, endLatLng);
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

     get_all_citibike_rides_for_day_near_lat_lng(day, month, year, startLatLng, endLatLng).then((citibikeRes)=>{
       values = citibikeRes["values"]
       trip_durations = values.map((x)=>x[citibikeRes.columns.indexOf("tripduration")])
       average_trip_durations = trip_durations.reduce((sum, x) => sum + x) / trip_durations.length
       bikeTripNums[0] = average_trip_durations
       update_all()
     })


   }
  return userInfo;
};

function compareTrips() {
  var userInfo = getUserInfo();
  var weight = userInfo[3];
  //Process user info
  //Get distance and time estimates (currently random nums to check)

  //Citibike
  // var bikeDistance = Math.random();
  // var bikeTime = Math.random();
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


var compareTripsButton = document.querySelector("input[name=compareTripsButton]");

compareTripsButton.addEventListener("click", compareTrips);
