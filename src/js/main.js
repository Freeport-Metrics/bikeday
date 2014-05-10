
function obtainAndShowDirections() {
  var from, fromStation, to, toStation;
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
        calcRoute(
          new google.maps.LatLng(from.lat, from.lng),
          new google.maps.LatLng(fromStation.lat, fromStation.lng),
          new google.maps.LatLng(toStation.lat, toStation.lng),
          new google.maps.LatLng(to.lat, to.lng));
      });
    });
  });
}

$(document).ready(function () {
  $('#searchButton').click(function () {
      obtainAndShowDirections();
      return false;
    }
  );
});