function geocode(address, callback) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            callback(results[0].geometry.location);
        } else {
            alert("Location " + address + "not found");
        }
    });
}

