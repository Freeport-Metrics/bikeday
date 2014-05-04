var expect = require('chai').expect,
  sinon = require('sinon'),
  include = require('./include.js').include;

include('src/js/geocoder.js');

google = {};
alert = {};

describe('geocode', function () {
  it('should alert when address not found', function () {
    alert = sinon.spy();
    var callback = sinon.spy();
    google = {maps: {
      GeocoderStatus: { OK: "OK" },
      Geocoder: function () {
        this.geocode = function (address, callback) {
          callback([], "ERROR");
        };
      }}
    };
    geocode("not existing address", callback);
    expect(callback.calledOnce).to.be.equal(false);
    expect(alert.calledOnce).to.be.equal(true);
  });

  it('should alert when address not found', function () {
    alert = sinon.spy();
    var callback = sinon.spy();
    google = {maps: {
      GeocoderStatus: { OK: "OK" },
      Geocoder: function () {
        this.geocode = function (address, callback) {
          callback([], "OK");
        };
      }}
    };
    geocode("not existing address", callback);
    expect(callback.calledOnce).to.be.equal(false);
    expect(alert.calledOnce).to.be.equal(true);
  });

  it('should call callback when address found', function () {
    alert = sinon.spy();
    var callback = sinon.spy();
    google = {maps: {
      GeocoderStatus: { OK: "OK" },
      Geocoder: function () {
        this.geocode = function (address, callback) {
          callback([
            {geometry: {location: {lat: 0, lng: 1}}}
          ], "OK");
        };
      }}
    };
    geocode("some address", callback);
    expect(callback.calledOnce).to.be.equal(true);
    expect(alert.calledOnce).to.be.equal(false);
  });

  it('should call callback when address found with location of first result as a parameter', function () {
    alert = sinon.spy();
    var callback = sinon.spy();
    google = {maps: {
      GeocoderStatus: { OK: "OK" },
      Geocoder: function () {
        this.geocode = function (address, callback) {
          callback([
            {geometry: {location: {lat: 0, lng: 3}}},
            {geometry: {location: {lat: 1, lng: 4}}},
            {geometry: {location: {lat: 2, lng: 5}}}
          ], "OK");
        };
      }}
    };
    geocode("some address", callback);
    expect(callback.calledWith({lat: 0, lng: 3})).to.be.equal(true);
    expect(alert.calledOnce).to.be.equal(false);
  });
});