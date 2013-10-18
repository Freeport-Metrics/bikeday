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
});