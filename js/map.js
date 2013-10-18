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

var markers =
{
    startWalk: new google.maps.Marker({
        map: map,
        icon: 'img/start-walk.png'
    }),
    startBike: new google.maps.Marker({
        map: map,
        icon: 'img/start-bike.png'
    }),
    stopBike: new google.maps.Marker({
        map: map,
        icon: 'img/stop-bike.png'
    }),
    stopWalk: new google.maps.Marker({
        map: map,
        icon: 'img/stop-walk.png'
    })
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
var directionsDisplayWalkToStation = new google.maps.DirectionsRenderer({preserveViewport: true, polylineOptions: rendererWalkToStationsOptions, markerOptions: {visible: false}});
var directionsDisplayWalkFromStation = new google.maps.DirectionsRenderer({preserveViewport: true, polylineOptions: rendererFromStationOptions, markerOptions: {visible: false}});
var directionsDisplayBike = new google.maps.DirectionsRenderer({preserveViewport: true, polylineOptions: rendererBikingOptions, markerOptions: {visible: false}});

//function that calculate routes
function calcRoute(from, fromStation, toStation, to) {

    directionsDisplayWalkToStation.setMap(map);
    directionsDisplayWalkFromStation.setMap(map);
    directionsDisplayBike.setMap(map);

    markers.startWalk.position = from;
    markers.startBike.position = fromStation;
    markers.stopBike.position = toStation;
    markers.stopWalk.position = to;

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
            console.error("Error", status)
        }

        directionsService.route(requestBicycling, function (result, status) {
            console.log("Status", status);
            if (status == google.maps.DirectionsStatus.OK) {
                console.log("Set bicycling directions");
                directionsDisplayBike.setDirections(result);
            }
            else {
                console.error("Error", status)
            }

            directionsService.route(requestFromStation, function (result, status) {
                console.log("Status", status);
                if (status == google.maps.DirectionsStatus.OK) {
                    console.log("Set directions");
                    directionsDisplayWalkFromStation.setDirections(result);
                }
                else {
                    console.error("Error", status)
                }

            });
        });

    });


}