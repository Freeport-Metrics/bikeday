function geocode(address, callback) {
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({ 'address': address, region: 'PL'}, function (results, status) {
    if (status == google.maps.GeocoderStatus.OK && results.length) {
      callback(results[0].geometry.location);
    } else {
      alert("Location " + address + "not found");
    }
  });
}

