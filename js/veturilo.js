function findLocations(callback){
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8765/mockdata/veturilo.xml',
        dataType: 'xml',
        success: function (xml) {
            var locations = [];
            $(xml).find('place').each(function () {
                var place = $(this);
                var location = {
                    name: place.attr('name'),
                    lat: place.attr('lat'),
                    lng: place.attr('lng'),
                    bikes: place.attr('lng'),
                    racks: place.attr('bike_racks')
                };
                locations.push(location);
            });
            callback(locations);
        }
    });
}