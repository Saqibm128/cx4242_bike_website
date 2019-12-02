// initialize the map
var map = L.map('leafletmap').setView([40.75, -73.98], 13);

// load a tile layer
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox.streets',
  accessToken: 'pk.eyJ1IjoiZGpoYWlsIiwiYSI6ImNrMzkyMmRwcjBlNXozaHFzNmdtbzlkNzUifQ.luDWvELbHjFLiprKNQaF0w'
}).addTo(map);

control = L.Routing.control({
  waypoints: [
    L.latLng(40.75, -73.98),
    L.latLng(40.754, -73.984)
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
      control.spliceWaypoints(0, 1, e.latlng);
      map.closePopup();
    });

    L.DomEvent.on(destBtn, 'click', function() {
      control.spliceWaypoints(control.getWaypoints().length - 1, 1, e.latlng);
      map.closePopup();
    });
});

startLatLng = control.getWaypoints()[0]
endLatLng = control.getWaypoints()[1]

async function getJankRoute() {
  let result = await fetch("http://ec2-18-212-131-13.compute-1.amazonaws.com:5000/uber_ride/get_route", {
      "method": "POST", "headers":{"Content-Type":"application/json"},
      "body": JSON.stringify({
          "condition": "where day in " + day + " and year=" + year + " and month = " + month
      })
  })

  let resultJson = await result.json()
  return resultJson
}



