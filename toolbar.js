var compareTripsButton = document.querySelector("input[name=compareTripsButton]");

compareTripsButton.addEventListener("click", getUserInfo);

function getUserInfo() {
  var userInfo = [];

  var weight = document.querySelector("input[name=weight]").value;
  var height = document.querySelector("input[name=height]").value;
  var datetime = new Date(document.querySelector("input[name=myLocalDate]").value);

  var time = datetime.getHours() + ":" + datetime.getMinutes();
  var day = datetime.getDay();
  var month = datetime.getMonth();
  var year = datetime.getYear();

  userInfo.push(month, day, time, weight, height)
  if (startLatLng !== null && endLatLng !== null) {
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
