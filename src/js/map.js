var map;

var directionsService,
  directionsDisplayWalkToStation,
  directionsDisplayWalkFromStation,
  directionsDisplayBike,
  markers = [];

function initialize() {

  var mapOptions = {
    zoom: 12,
    center: new google.maps.LatLng(52.2324, 21.0127),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    panControl: true,
    panControlOptions: {
      position: google.maps.ControlPosition.RIGHT_TOP
    },
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_TOP
    },
    scaleControl: true,
    scaleControlOptions: {
      position: google.maps.ControlPosition.RIGHT_TOP
    },
    streetViewControl: true,
    streetViewControlOptions: {
      position: google.maps.ControlPosition.RIGHT_TOP
    }
  };

  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      markers = [new google.maps.Marker({
        map: map,
        position: pos
      })];
      setMapBoundsToMarkers();
      $('#from').val(position.coords.latitude + ' , ' + position.coords.longitude);
    }, function () {
      console.log("No geolocation");
    });
  }

  var rendererWalkToStationsOptions = new google.maps.Polyline({
    strokeColor: "#00FF00"
  });
  var rendererBikingOptions = new google.maps.Polyline({
    strokeColor: "#FF0000"
  });
  var rendererFromStationOptions = new google.maps.Polyline({
    strokeColor: "#0000FF"
  });


  directionsService = new google.maps.DirectionsService();
  directionsDisplayWalkToStation = new google.maps.DirectionsRenderer({preserveViewport: true, polylineOptions: rendererWalkToStationsOptions, markerOptions: {visible: false}});
  directionsDisplayWalkFromStation = new google.maps.DirectionsRenderer({preserveViewport: true, polylineOptions: rendererFromStationOptions, markerOptions: {visible: false}});
  directionsDisplayBike = new google.maps.DirectionsRenderer({preserveViewport: true, polylineOptions: rendererBikingOptions, markerOptions: {visible: false}});
}

function calcRoute(from, fromStation, toStation, to) {

  addDirectionsToMap();
  addMarkersToMap(from, fromStation, toStation, to);
  setMapBoundsToMarkers();

  var requestToStation = {
    origin: from,
    destination: fromStation,
    transitOptions: {
      departureTime: new Date()
    },
    travelMode: google.maps.TravelMode.WALKING
  };

  var requestBicycling = {
    origin: fromStation,
    destination: toStation,
    transitOptions: {
      departureTime: new Date()
    },
    travelMode: google.maps.TravelMode.BICYCLING
  };

  var requestFromStation = {
    origin: toStation,
    destination: to,
    transitOptions: {
      departureTime: new Date()
    },
    travelMode: google.maps.TravelMode.WALKING
  };

  directionsService.route(requestToStation, function (result, status) {
    console.log("Status", status);
    if (status == google.maps.DirectionsStatus.OK) {
      console.log("Set directions");
      directionsDisplayWalkToStation.setDirections(result);
    }
    else {
      console.error("Error", status);
    }
    var duration = result.routes[0].legs[0].duration.value;
    $("#toStationDuration").html(result.routes[0].legs[0].duration.text);
    console.log("Walk to station:", result.routes[0].legs[0].duration);
    directionsService.route(requestBicycling, function (result, status) {
      console.log("Status", status);
      if (status == google.maps.DirectionsStatus.OK) {
        console.log("Set bicycling directions");
        directionsDisplayBike.setDirections(result);
      }
      else {
        console.error("Error", status);
      }
      duration = duration + result.routes[0].legs[0].duration.value;
      console.log("Biking duration:", result.routes[0].legs[0].duration);
      directionsService.route(requestFromStation, function (result, status) {
        console.log("Status", status);
        if (status == google.maps.DirectionsStatus.OK) {
          console.log("Set directions");
          directionsDisplayWalkFromStation.setDirections(result);
        }
        else {
          console.error("Error", status);
        }
        duration = duration + result.routes[0].legs[0].duration.value;
        $("#toEndDuration").html(result.routes[0].legs[0].duration.text);
        var hour = new Date();
        hour.setSeconds(duration);
        hour.setMinutes(30);
        hour.setMinutes(0);
        var endTime = hour.getHours();
        $("#endTime").html(Math.ceil(endTime));

        console.log("Total duration", duration);
        console.log("Walk to end:", result.routes[0].legs[0].duration);

        hour = new Date();
        hour.setMinutes(hour.getMinutes() + 30);
        hour.setMinutes(0);
        weather(hour.getHours(), Math.ceil(duration / 3600), function (result) {
          console.log("Result", result);
          var endHour = result.endHour;
          var startHour = result.startHour;
          $('#weather').html(result.message + "<img src='" + result.icon + "'/>");
          sunsetSunrise(endHour, function (result) {
            $('#sunsetSunrise').html("");
            if ((startHour > result.sunsetHour && startHour < 24) ||
              (startHour < result.sunsetHour &&
                (startHour >= 0 && startHour < result.sunriseHour))) {
              $('#sunsetSunrise').html("You will be biking in the dark, after sunset at " + result.sunsetHour + ":" + result.sunsetMinute);
            }
            else {
              $('#sunsetSunrise').html("You won't make it before sunset at " + result.sunsetHour + ":" + result.sunsetMinute);
            }
            $('.results').show();
            $("html, body").animate({ scrollTop: $(document).height() }, "slow");
          });
        });
      });
    });

  });
}

function addDirectionsToMap() {
  directionsDisplayWalkToStation.setMap(map);
  directionsDisplayWalkFromStation.setMap(map);
  directionsDisplayBike.setMap(map);
}

function setMapBoundsToMarkers() {
  if (!markers.length) {
    return false;
  }
  var bounds = new google.maps.LatLngBounds();
  markers.forEach(function (marker) {
    bounds.extend(marker.position);
  });
  map.panToBounds(bounds);
  map.fitBounds(bounds);
}

function addMarkersToMap(from, fromStation, toStation, to) {
  markers.forEach(function (marker) {
    marker.setMap(null);
  });

  markers = [new google.maps.Marker({
    position: from,
    map: map,
    icon: 'img/start-walk.png'
  }),
    new google.maps.Marker({
      position: fromStation,
      map: map,
      icon: 'img/start-bike.png'
    }),
    new google.maps.Marker({
      position: toStation,
      map: map,
      icon: 'img/stop-bike.png'
    }),
    new google.maps.Marker({
      position: to,
      map: map,
      icon: 'img/stop-walk.png'
    })
  ];
}

google.maps.event.addDomListener(window, 'load', initialize);
