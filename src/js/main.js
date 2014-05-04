var displayWeather = function (result) {
  console.log(result);
  endHour = result.endHour;
  startHour = result.startHour;
  $('#weather').html(result.message + "<img src='" + result.icon + "'/>");
  sunsetSunrise(endHour, function (result) {
    if ((startHour > result.sunsetHour && startHour < 24) || (startHour < result.sunsetHour && (startHour >= 0 && startHour < result.sunriseHour))) {
      $('#sunsetSunrise').html("You will be biking in the dark, after sunset at " + result.sunsetHour + ":" + result.sunsetMinute);
    }
    else {
      $('#sunsetSunrise').html("You won't make it before sunset at " + result.sunsetHour + ":" + result.sunsetMinute);
    }
    $('.results').show();
    $("html, body").animate({ scrollTop: $(document).height() }, "slow");
  });
};

function obtainAndShowDirections() {
// locations
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

  var hour = new Date();
  hour.setMinutes(hour.getMinutes() + 30);
  hour.setMinutes(0);

  $('#searchButton').click(function () {

      weather(hour.getHours(), 2, displayWeather);
      obtainAndShowDirections();
      return false;
    }
  );


});