function findStations(callback) {
    $.ajax({
        type: 'GET',
        url: 'http://nextbike.net/maps/nextbike-official.xml?city=210',
        dataType: 'xml',
        success: function (xml) {
            var stations = [];
            $(xml).find('place').each(function () {
                var place = $(this);
                var station = {
                    name: place.attr('name'),
                    lat: place.attr('lat'),
                    lng: place.attr('lng'),
                    bikes: place.attr('bikes'),
                    racks: place.attr('bike_racks')
                };
                stations.push(station);
            });
            callback(stations);
        }
    });
}

var distanceSquare = function (pointA, pointB) {
    var x = pointA.lat - pointB.lat;
    var y = pointA.lng - pointB.lng;
    return (x * x) + (y * y);
};


function findNearestStation(point, stations) {
    var nearest = null;
    var smallestDistanceSquare;
    $.each(stations, function (i, station) {
        var distance = distanceSquare(point, station);
        if ((nearest === null) || ((smallestDistanceSquare > distance) && (stations.bikes != '0'))) {
            nearest = station;
            smallestDistanceSquare = distance;
        }
    });
    return nearest;
}

