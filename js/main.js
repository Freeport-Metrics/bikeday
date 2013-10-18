$(document).ready(function () {

    //Disable form submit replace it with calculating route
    $(".search-form").submit(function(event) {
        event.preventDefault();
        calcRoute();
    });

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



    var bikeLayer = new google.maps.BicyclingLayer();
    bikeLayer.setMap(map);

    //set display options for each part of route

    var rendererWalkToStationsOptions = new google.maps.Polyline({
        strokeColor: "#00FF00",
    });
    var rendererBikingOptions = new google.maps.Polyline({
        strokeColor: "#FF0000",
    });
    var rendererFromStationOptions = new google.maps.Polyline({
        strokeColor: "#0000FF",
    });

    var directionsService = new google.maps.DirectionsService();
    var directionsDisplayWalkToStation = new google.maps.DirectionsRenderer({polylineOptions: rendererWalkToStationsOptions});
    var directionsDisplayWalkFromStation = new google.maps.DirectionsRenderer({polylineOptions: rendererBikingOptions});
    var directionsDisplayBike = new google.maps.DirectionsRenderer({polylineOptions: rendererFromStationOptions});

    directionsDisplayWalkToStation.setMap(map);
    directionsDisplayWalkFromStation.setMap(map);
    directionsDisplayBike.setMap(map);




    //function that calculate routes
    function calcRoute(from, fromStation, toStation, to) {

       from = new google.maps.LatLng(52.2329476, 21.012631199999987);
       to = new google.maps.LatLng(52.2356499, 20.97239650000006);
       fromStation = new google.maps.LatLng(52.233582929098, 21.0146221518517);
       toStation = new google.maps.LatLng(52.236998797125, 20.9721708297729);

       var bounds = new google.maps.LatLngBounds();
       bounds.extend(from);
       bounds.extend(to);
       bounds.extend(fromStation);
       bounds.extend(toStation);


      var requestToStation = {
        origin:from,
        destination:fromStation,
        transitOptions: {
            departureTime: new Date(1337675679473)
        },
        travelMode: google.maps.TravelMode.WALKING
      };
      
      directionsService.route(requestToStation, function(result, status) {
        console.log("Status", status);
        if (status == google.maps.DirectionsStatus.OK) {
          console.log("Set directions");
          directionsDisplayWalkToStation.setDirections(result);
        }
        else {console.error("Error", status)}
      });

      var requestBicycling = {
        origin:fromStation,
        destination:toStation,
        transitOptions: {
            departureTime: new Date(1337675679473)
        },
        travelMode: google.maps.TravelMode.BICYCLING
      };
      
      directionsService.route(requestBicycling, function(result, status) {
        console.log("Status", status);
        if (status == google.maps.DirectionsStatus.OK) {
          console.log("Set bucucling directions");
          directionsDisplayBike.setDirections(result);
        }
        else {console.error("Error", status)}
      });


        var requestFromStation = {
        origin:toStation,
        destination:to,
        transitOptions: {
            departureTime: new Date(1337675679473)
        },
        travelMode: google.maps.TravelMode.WALKING
      };
      
        map.fitBounds(bounds);
        map.panToBounds(bounds);
        console.log("Bounding to ", bounds); 
      
      directionsService.route(requestFromStation, function(result, status) {
        console.log("Status", status);
        if (status == google.maps.DirectionsStatus.OK) {
          console.log("Set directions");
          directionsDisplayWalkFromStation.setDirections(result);
        }
        else {console.error("Error", status)}
      });



    }
});