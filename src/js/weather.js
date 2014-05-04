function weather(startHour, hoursOnARoad, callback) {
  $.ajax({ url: "http://api.wunderground.com/api/086afffe3fa8ba4d/hourly/q/Poland/Warsaw.json",
    dataType: "jsonp",
    success: function (parsed_json) {
      var conditions = [
        'Thunderstorms', 'Thunderstorm', 'Chance of Thunderstorms', 'Chance of Thunderstorm', 'Snow', 'Chance of Snow',
        'Sleet', 'Chance of Sleet', 'Freezing Rain', 'Rain', 'Chance of Freezing Rain', 'Chance of Rain',
        'Scattered Clouds', 'Overcast', 'Cloudy', 'Mostly Cloudy', 'Partly Cloudy', 'Flurries', 'Fog', 'Haze', 'Sunny',
        'Mostly Sunny', 'Partly Sunny', 'Clear', 'Unknown'
      ];
      var currentConditionsIndex = Infinity;
      var worstWeatherIndex = 0;

      parsed_json.hourly_forecast.forEach(function (hourForecast, i) {
        conditions.forEach(function (condition, j) {
          if (hourForecast.condition === condition && j < currentConditionsIndex) {
            currentConditionsIndex = j;
            worstWeatherIndex = i;
          }
        });
      });

      var temp_c = parsed_json.hourly_forecast[0].temp.metric;
      callback({
        message: _getWeatherMessage(currentConditionsIndex, temp_c),
        icon: parsed_json.hourly_forecast[worstWeatherIndex].icon_url,
        endHour: startHour + hoursOnARoad,
        startHour: startHour
      });
    },
    error: function () {
      callback({
        message: 'The dark side clouds everything. Impossible to see the future is.',
        icon: '',
        endHour: startHour + hoursOnARoad,
        startHour: startHour
      });
    }
  });
}

function sunsetSunrise(endHour, callback) {
  $.ajax({
    url: "http://api.wunderground.com/api/086afffe3fa8ba4d/astronomy/q/Poland/Warsaw.json",
    dataType: "jsonp",
    success: function (parsed_json) {
      var result = {
        sunriseHour: parsed_json.moon_phase.sunrise.hour,
        sunriseMinute: parsed_json.moon_phase.sunrise.minute,
        sunsetHour: parsed_json.moon_phase.sunset.hour,
        sunsetMinute: parsed_json.moon_phase.sunset.minute
      };
      callback(result);
    },
    error: function () {
      var result = {
        sunriseHour: Math.NaN,
        sunriseMinute: Math.NaN,
        sunsetHour: Math.NaN,
        sunsetMinute: Math.NaN
      };
      callback(result);
    }
  });
}

function _getWeatherMessage(conditions, temp_c) {

  if (!$.isNumeric(conditions) || conditions - 24 === 0 || !$.isNumeric(temp_c)) {
    return 'The dark side clouds everything. Impossible to see the future is.';
  }

  var beginign = 'Current temperature in Warsaw is ';
  if (conditions < 2) {
    return beginign + temp_c + ".<\/br> There will be thunderstorms during your trip";
  }
  if (conditions >= 2 && conditions < 4) {
    return beginign + temp_c + ".<\/br> There might be thunderstorms during your trip";
  }
  if (conditions >= 4 && conditions < 5) {
    return beginign + temp_c + ".<\/br> It will be snowing during your trip";
  }
  if (conditions >= 6 && conditions < 8) {
    return beginign + temp_c + ".<\/br> It might be sleeting during your trip";
  }
  if (conditions >= 8 && conditions < 10) {
    return beginign + temp_c + ".<\/br> It will be raining during your trip";
  }
  if (conditions >= 9 && conditions < 11) {
    return beginign + temp_c + ".<\/br> It might be raining during your trip";
  }
  if (conditions >= 11 && conditions < 20) {
    return beginign + temp_c + ".<\/br> It will be cloudy during your trip";
  }
  return beginign + temp_c + ".<\/br> It will be great weather during your trip";
}