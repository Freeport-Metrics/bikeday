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
    },
    error: function () {
      callback([]);
    }
  });
}

function distanceSquare(pointA, pointB) {
  var x = pointA.lat - pointB.lat;
  var y = pointA.lng - pointB.lng;
  return (x * x) + (y * y);
}


function findNearestStation(point, stations) {
  var nearest = null;
  var smallestDistanceSquare = Infinity;
  stations.forEach(function (station) {
    var distance = distanceSquare(point, station);
    if (((smallestDistanceSquare > distance) && (station.bikes != '0'))) {
      nearest = station;
      smallestDistanceSquare = distance;
    }
  });
  return nearest;
}