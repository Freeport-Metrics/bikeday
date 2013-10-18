$(document).ready(function () {
    var mapOptions = {
        zoom: 12,
        center: new google.maps.LatLng(52.2324, 21.0127),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
//        mapTypeControlOptions: {
//            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
//            position: google.maps.ControlPosition.RIGHT_TOP
//        }
        panControl: true,
        panControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP
        },
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE,
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
    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

//EXAMPLE FROM https://developers.google.com/maps/documentation/javascript/directions#TravelModes

var directionsService = new google.maps.DirectionsService();
var directionsDisplay = new google.maps.DirectionsRenderer();
directionsDisplay.setMap(map);

function calcRoute(from, fromStation, toStation, to) {

   from = new google.maps.LatLng(52.2329476, 21.012631199999987);
   to = new google.maps.LatLng(52.2356499, 20.97239650000006);
   fromStation = new google.maps.LatLng(52.233582929098, 21.0146221518517);
   toStation = new google.maps.LatLng(52.236998797125, 20.9721708297729);

  var request = {
    origin:from,
    destination:toStation,
    transitOptions: {
        departureTime: new Date(1337675679473)
    },
    travelMode: google.maps.TravelMode.WALKING

  };
  
  directionsService.route(request, function(result, status) {
    console.log("Status", status);
    if (status == google.maps.DirectionsStatus.OK) {
      console.log("Set directions");
      directionsDisplay.setDirections(result);
    }
    else {console.error("Error", status)}
  });
}

  $(".search-form").submit(function(event) {
    event.preventDefault();
    calcRoute();
  });

    var bikeLayer = new google.maps.BicyclingLayer();
    bikeLayer.setMap(map);


});