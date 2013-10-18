function weather(startHour, hoursOnARoad, callback) {
    $.ajax({ url: "http://api.wunderground.com/api/086afffe3fa8ba4d/hourly/q/Poland/Warsaw.json", dataType: "jsonp", success: function (parsed_json) {
        var temp_c = parsed_json['hourly_forecast'][0]['temp']['metric'];
        var beginHour = parsed_json['hourly_forecast'][0]['FCTTIME']['hour'];
        var offset = startHour - beginHour;
        var x = "";
        var conditions = new Array();
        conditions[0]="Thunderstorms";
        conditions[1]="Thunderstorm";
        conditions[2]="Chance of Thunderstorms";
        conditions[3]="Chance of Thunderstorm";
        conditions[4]="Snow";
        conditions[5]="Chance of Snow";
        conditions[6]="Sleet";
        conditions[7]="Chance of Sleet";
        conditions[8]="Freezing Rain";
        conditions[9]="Rain";
        conditions[10]="Chance of Freezing Rain";
        conditions[11]="Chance of Rain";
        conditions[12]="Scattered Clouds";
        conditions[13]="Overcast";
        conditions[14]="Cloudy";
        conditions[15]="Mostly Cloudy";
        conditions[16]="Partly Cloudy";
        conditions[17]="Flurries";
        conditions[18]="Fog";
        conditions[19]="Haze";
        conditions[20]="Sunny";
        conditions[21]="Mostly Sunny";
        conditions[22]="Partly Sunny";
        conditions[23]="Clear";
        conditions[24]="Unknown";
        var currentJ = 100;
        var worstWeather = 100;
        for (var i = offset; i < hoursOnARoad; i++)
        {
            for (j = 0; j < 25; ++j )
            {
                if (parsed_json['hourly_forecast'][i]['condition'] === conditions[j])
                {
                    if (j < currentJ)
                    {
                        currentJ = j;
                        worstWeather = i;
                    }
                }
            }
        }
        var result = {};

        if (currentJ < 2)
        {
            result.message = "Current temperature in Warsaw is " + temp_c + ".</br> There will be thunderstorms during your trip";
        }
        if (currentJ > 1 && currentJ < 4)
        {
            result.message = "Current temperature in Warsaw is " + temp_c + ".</br> There might be thunderstorms during your trip";
        }
        if (currentJ == 4)
        {
            result.message = "Current temperature in Warsaw is " + temp_c + ".</br> It will be snowing during your trip";
        }
        if (currentJ == 5)
        {
            result.message = "Current temperature in Warsaw is " + temp_c + ".</br> It might be snowing during your trip";
        }
        if (currentJ == 6)
        {
           result.message = "Current temperature in Warsaw is " + temp_c + ".</br> It will be sleeting during your trip";
        }
        if (currentJ == 7)
        {
            result.message = "Current temperature in Warsaw is " + temp_c + ".</br> It might be sleeting during your trip";
        }
        if (currentJ == 8 || currentJ == 9)
        {
            result.message = "Current temperature in Warsaw is " + temp_c + ".</br> It will be raining during your trip";
        }
        if (currentJ == 10 || currentJ == 11)
        {
            result.message = "Current temperature in Warsaw is " + temp_c + ".</br> It might be raining during your trip";
        }
        if (currentJ > 11 && currentJ < 20)
        {
            result.message = "Current temperature in Warsaw is " + temp_c + ".</br> It will be cloudy during your trip";
        }
        if (currentJ > 19)
        {
            result.message = "Current temperature in Warsaw is " + temp_c + ".</br> It will be great weather during your trip";
        }

        result.icon = parsed_json['hourly_forecast'][worstWeather]['icon_url'];
        result.endHour = parsed_json['hourly_forecast'][offset + hoursOnARoad]['FCTTIME']['hour'];

        callback(result);
    } });
}
function sunsetSunrise(endHour, callback) {
    $.ajax({ url: "http://api.wunderground.com/api/086afffe3fa8ba4d/astronomy/q/Poland/Warsaw.json", dataType: "jsonp", success: function (parsed_json) {
        var result = {
            sunriseHour: parsed_json['moon_phase']['sunrise']['hour'],
            sunriseMinute:  parsed_json['moon_phase']['sunrise']['minute'],
            sunsetHour:  parsed_json['moon_phase']['sunset']['hour'],
            sunsetMinute: parsed_json['moon_phase']['sunset']['minute']
        };
        callback(result);
    } });
}