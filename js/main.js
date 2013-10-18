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

    var bikeLayer = new google.maps.BicyclingLayer();
    bikeLayer.setMap(map);

    $('#hour').val(new Date().getHours() + 1);
    $('#searchButton').click(function () {
            weather($('#hour').val(), 2, function(result)
            {
                console.log(result);
                $('#weather').html(result.message + "<img src='" + result.icon + "'/>");
            })
            return false;
        }
    )

//    travelMode: TravelMode.BICYCLING

});