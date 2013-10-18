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


    var rendererWalkToStationsOptions = new google.maps.Polyline({
        strokeColor: "#00FF00"
    });
    var rendererBikingOptions = new google.maps.Polyline({
        strokeColor: "#FF0000"
    });
    var rendererFromStationOptions = new google.maps.Polyline({
        strokeColor: "#0000FF"
    });

    var directionsService = new google.maps.DirectionsService();
    var directionsDisplayWalkToStation = new google.maps.DirectionsRenderer({polylineOptions: rendererWalkToStationsOptions});
    var directionsDisplayWalkFromStation = new google.maps.DirectionsRenderer({polylineOptions: rendererFromStationOptions});
    var directionsDisplayBike = new google.maps.DirectionsRenderer({polylineOptions: rendererBikingOptions});
//function that calculate routes
function calcRoute(from, fromStation, toStation, to) {

    directionsDisplayWalkToStation.setMap(map);
    directionsDisplayWalkFromStation.setMap(map);
    directionsDisplayBike.setMap(map);

    var marker = new google.maps.Marker({
        position: fromStation,
        map: map,
        icon: 'img/map-bike.png'
    });

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
            console.log("Set bicycling directions");
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