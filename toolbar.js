var result = fetch("http://ec2-18-212-131-13.compute-1.amazonaws.com:5000/uber_ride", {
    "method": "POST", "headers":{"Content-Type":"application/json"},
    "body": JSON.stringify({
        "condition": "where day in (26, 27)"
    })
}).then(function(d) {
    return (d.json())
}).then(function(d) {console.log(d)})

async function get_shortest_path(start_junction_id, end_junction_id) {
  let result = await fetch("http://ec2-18-212-131-13.compute-1.amazonaws.com:5000/short_path_alg", {
      "method": "POST", "headers":{"Content-Type":"application/json"},
      "body": JSON.stringify({
          "start": start_junction_id,
          "end": end_junction_id
      })
  })
  let resultJson = await result.json()
  return resultJson
}

async function get_shortest_path_lat_lngs(start_junction_id, end_junction_id) {
  result = await get_shortest_path(start_junction_id, end_junction_id)
  return result.values.map((row) => [row[1], row[2]])
}

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
      travelMode: 'BICYCLING'
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

async function get_closest(latitude, longitude) {
  let result = await fetch("http://ec2-18-212-131-13.compute-1.amazonaws.com:5000/osm_node", {
      "method": "POST", "headers":{"Content-Type":"application/json"},
      "body": JSON.stringify({
        "lat": latitude,
        "lng": longitude
      })
  })

  let resultJson = await result.json()
  return resultJson.values[0][0]
}

async function get_all_uber_rides_for_day_mean_speed(day, month, year, startLatLng, endLatLng) {
  // console.log(day)
  res = await get_all_uber_rides_for_day_near_lat_lng(day, month, year, startLatLng, endLatLng)
  // console.log(res)
  // console.log(res["columns"].indexOf("speed_mph_mean"))

  speeds = res["values"].map((x)=>x[res["columns"].indexOf("speed_mph_mean")])
  sumSpeeds = speeds.reduce((total, speed) => total + speed)

  start_junction_id = res["values"][0][res["columns"].indexOf("start_junction_id")]
  end_junction_id = res["values"][0][res["columns"].indexOf("end_junction_id")]
  start_junction_id = await get_closest(startLatLng[0], startLatLng[1])
  end_junction_id = await get_closest(endLatLng[0], endLatLng[1])
  get_shortest_path_lat_lngs(start_junction_id, end_junction_id).then(drawPath)
  // drawPath(lat_long_pair_path)

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
        .attr("transform", "translate(" + 0 + "," + (0.25*height)  + ")")
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
        .attr("transform", "translate(" + (width/2) + "," + (0.25*height)+ ")")
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

function update_all() {
  update_uber()
  update_bike()
  addUberResults(uberTripNums)
  addBikeResults(bikeTripNums)
}

function update_uber() {
  svg.selectAll("uber_text").text(function(d, i) {
    return uberTripNums[i] + " " + d;
  });
}

function update_bike() {
  svg.selectAll("bike_text").text(function(d, i) {
    return bikeTripNums[i] + " " + d;
  });
}

var uberDistance = 0;
var uberTime = 0;

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
         uberTripNums[0] = Math.round(num_minutes)
         uberTripNums[2] = co2_emissions_per_ride(uberDistance)
         update_all()
       })
     });

     get_all_citibike_rides_for_day_near_lat_lng(day, month, year, startLatLng, endLatLng).then((citibikeRes)=>{
       values = citibikeRes["values"]
       trip_durations = values.map((x)=>x[citibikeRes.columns.indexOf("tripduration")])
       average_trip_durations = trip_durations.reduce((sum, x) => sum + x) / trip_durations.length
       bikeTripNums[0] = Math.round(average_trip_durations / 60);

       get_biking_distance_between(startLatLng, endLatLng).then((distRes)=>{
          bikeDistance = (distRes * 0.000621371)
          bikeTripNums[1] = calories_burnt_biking(weight, bikeDistance)
          console.log(bikeTripNums)
          update_all()
       });

     });


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
  // var uberCalories = 0;
  // var uberEmissions = co2_emissions_per_ride(uberDistance);
  // console.log(uberDistance)

  // var uberResults = [uberTime, uberCalories, uberEmissions]; //[time, calories, emissions]
  // var bikeResults = [bikeTime, bikeCalories, bikeEmissions]; //[time, calories, emissions]

  // addBikeResults(bikeResults);
  // addUberResults(uberResults);
};


var compareTripsButton = document.querySelector("input[name=compareTripsButton]");

compareTripsButton.addEventListener("click", getUserInfo);
