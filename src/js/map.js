var map;

var directionsService;
var directionsDisplayWalkToStation;
var directionsDisplayWalkFromStation;
var directionsDisplayBike;

function initialize() {

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      map.setCenter(pos);
      map.setZoom(15);
      $('#from').val(position.coords.latitude + ' , ' + position.coords.longitude);
    }, function () {
      console.log("No geolocation");
    });
  }

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

//function that calculate routes
function calcRoute(from, fromStation, toStation, to) {

  directionsDisplayWalkToStation.setMap(map);
  directionsDisplayWalkFromStation.setMap(map);
  directionsDisplayBike.setMap(map);

  new google.maps.Marker({
    position: from,
    map: map,
    icon: 'img/start-walk.png'
  });
  new google.maps.Marker({
    position: fromStation,
    map: map,
    icon: 'img/start-bike.png'
  });
  new google.maps.Marker({
    position: toStation,
    map: map,
    icon: 'img/stop-bike.png'
  });
  new google.maps.Marker({
    position: to,
    map: map,
    icon: 'img/stop-walk.png'
  });

  var bounds = new google.maps.LatLngBounds();
  bounds.extend(from);
  bounds.extend(to);
  bounds.extend(fromStation);
  bounds.extend(toStation);
  console.log("Bounding to ", bounds);

  map.panToBounds(bounds);
  map.fitBounds(bounds);


  var requestToStation = {
    origin: from,
    destination: fromStation,
    transitOptions: {
      departureTime: new Date(1337675679473)
    },
    travelMode: google.maps.TravelMode.WALKING
  };

  var requestBicycling = {
    origin: fromStation,
    destination: toStation,
    transitOptions: {
      departureTime: new Date(1337675679473)
    },
    travelMode: google.maps.TravelMode.BICYCLING
  };

  var requestFromStation = {
    origin: toStation,
    destination: to,
    transitOptions: {
      departureTime: new Date(1337675679473)
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
        var endTime = (parseInt($('#hour').val(), 10)) + (duration / 3600) % 24;
        $("#endTime").html(Math.ceil(endTime));

        console.log("Total duration", duration);
        console.log("Walk to end:", result.routes[0].legs[0].duration);

        var hour = new Date();
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

google.maps.event.addDomListener(window, 'load', initialize);
