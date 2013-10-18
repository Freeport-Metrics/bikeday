$(document).ready(function () {


    $('#hour').val(new Date().getHours() + 1);
    $('#searchButton').click(function () {
            weather($('#hour').val(), 2, function(result)
            {
                console.log(result);
                endHour = result.endHour;
                $('#weather').html(result.message + "<img src='" + result.icon + "'/>");
                sunsetSunrise(endHour, function(result)
                {
                    if ((endHour > result.sunsetHour && endHour < 24) || (endHour < result.sunsetHour && endHour < result.sunriseHour))
                    {
                        $('#sunsetSunrise').html("You won't make it before sunset at " + result.sunsetHour + ":" + result.sunsetMinute);
                    }
                })
            })
            // locations
            var from;
            var fromStation;
            var to;
            var toStation;

            geocode($('#from').val(), function (location) {
                from = {location: location, lat: location.lat(), lng: location.lng()};
                $("#resultFrom").text(location);
                // translate to
                console.log('from', from);
                geocode($('#to').val(), function (location) {
                    to = {location: location, lat: location.lat(), lng: location.lng()};
                    $("#resultTo").text(location);
                    console.log('to', to);
                    // veturilo
                    findStations(function (stations) {
                        fromStation = findNearestStation(from, stations);
                        console.log('fromStation', fromStation);
                        $('#fromStation').text(fromStation.name);
                        $('#fromStationBikes').text(fromStation.bikes);
                        toStation = findNearestStation(to, stations);
                        console.log('toStation', toStation);
                        $('#toStation').text(toStation.name);

                        // draw on map
                        var fromLL = new google.maps.LatLng(from.lat, from.lng);
                        var toLL = new google.maps.LatLng(to.lat, to.lng);
                        var fromStationLL = new google.maps.LatLng(fromStation.lat, fromStation.lng);
                        var toStationLL = new google.maps.LatLng(toStation.lat, toStation.lng);


                        calcRoute(fromLL, fromStationLL, toStationLL, toLL);

                    });
                });


            });

            return false;
        }
    )


});