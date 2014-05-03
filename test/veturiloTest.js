var expect = require('chai').expect,
  sinon = require('sinon'),
  include = require('./include.js').include,
  jsdom = require('jsdom'),
  window = jsdom.jsdom().createWindow();
$ = require('jquery')(window);


include('src/js/veturilo.js');

describe('distanceSquare', function () {
  it('should return 0 when passed the params are equal', function () {
    var point = { lat: 52.32, lng: 21.04 };
    expect(distanceSquare(point, point)).to.equal(0);
  });
  it('should return squared distance of 2 points', function () {
    expect(distanceSquare({ lat: 1, lng: 2 }, { lat: 3, lng: 4 })).to.equal(8);
  });
});

describe('findNearestStation', function () {
  it('should return null when no stations provided', function () {
    expect(findNearestStation({ lat: 1, lng: 2 }, [])).to.equal(null);
  });
  it('should return first station if there is only one', function () {
    var station = { lat: 1, lng: 2, bikes: 1};
    expect(findNearestStation({ lat: 1, lng: 2 }, [station])).to.equal(station);
  });
  it('should return null when no station has available bikes', function () {
    var stations = [
      { lat: 1, lng: 2, bikes: '0'},
      { lat: 3, lng: 4, bikes: '0'},
      { lat: 5, lng: 6, bikes: '0'}
    ];
    expect(findNearestStation({ lat: 1, lng: 2 }, stations)).to.equal(null);
  });
  it('should return station that has available bikes', function () {
    var stations = [
      { lat: 1, lng: 2, bikes: '0'},
      { lat: 3, lng: 4, bikes: '1'},
      { lat: 5, lng: 6, bikes: '0'}
    ];
    expect(findNearestStation({ lat: 1, lng: 2 }, stations)).to.equal(stations[1]);
  });
  it('should return newarest station with available bikes', function () {
    var stations = [
      { lat: 1, lng: 2, bikes: '2'},
      { lat: 3, lng: 4, bikes: '3'},
      { lat: 5, lng: 6, bikes: '5+'},
      { lat: 1, lng: 2, bikes: '0'},
      { lat: 3, lng: 4, bikes: '0'},
      { lat: 3.5, lng: 4.5, bikes: '0'}
    ];
    expect(findNearestStation({ lat: 3.5, lng: 4.5 }, stations)).to.equal(stations[1]);
  });
});

describe('findStations success', function () {
  beforeEach(function () {
    this.callback = sinon.spy();

    sinon.stub($, 'ajax', function (options) {

      var deferred = $.Deferred();

      var xml = '<?xml version="1.0" encoding="utf-8"?>' +
        '<markers>' +
        '<country lat="52.2345" lng="21.0024" zoom="11" name="VETURILO Poland" hotline="+48223821312" domain="vp">' +
        '<city uid="210" lat="52.2324" lng="21.0127" zoom="11" maps_icon="veturilo" alias="" break="0" name="Warszawa">' +
        '<place uid="1" lat="52.230" lng="21.013" name="Test Place 1" spot="1" number="6310" bikes="5+" bike_racks="28" bike_numbers="62106,64535,63307,60491,64337"/>' +
        '<place uid="2" lat="52.231" lng="21.024" name="Test Place 2" spot="1" number="6311" bikes="0" bike_racks="21" bike_numbers=""/>' +
        '<place uid="3" lat="52.238" lng="21.001" name="Test Place 3" spot="1" number="6307" bikes="2" bike_racks="15" bike_numbers="64347,63498"/>' +
        '<place uid="4" lat="52.239" lng="21.01" name="Test Place 4" spot="1" number="6323" bikes="5+" bike_racks="24" bike_numbers="63092,63258,64978,64824,63509"/>' +
        '<place uid="5" lat="52.244" lng="21.00" name="Test Place 5" spot="1" number="6304" bikes="1" bike_racks="18" bike_numbers="64234"/>' +
        '</city>' +
        '</country>' +
        '</markers>';
      deferred.done(options.success(xml));

      return deferred;
    });
  });
  afterEach(function () {
    $.ajax.restore();
  });

  it('should call callback with parsed response from veturilo api', function () {
    findStations(function (result) {
      expect(result).to.be.a('array');
      expect(result).to.have.length(5);
      expect(result).to.deep.equal([
        { name: "Test Place 1", lat: "52.230", lng: "21.013", bikes: "5+", racks: "28"},
        { name: "Test Place 2", lat: "52.231", lng: "21.024", bikes: "0", racks: "21"},
        { name: "Test Place 3", lat: "52.238", lng: "21.001", bikes: "2", racks: "15"},
        { name: "Test Place 4", lat: "52.239", lng: "21.01", bikes: "5+", racks: "24"},
        { name: "Test Place 5", lat: "52.244", lng: "21.00", bikes: "1", racks: "18"}
      ]);
    });
    expect($.ajax.calledOnce).to.be.equal(true);
  });
});

describe('findStations error', function () {
  beforeEach(function () {
    this.callback = sinon.spy();

    sinon.stub($, 'ajax', function (options) {

      var deferred = $.Deferred();
      deferred.done(options.error());

      return deferred;
    });
  });
  afterEach(function () {
    $.ajax.restore();
  });

  it('should call callback with empty array as parameter when veturilo api is unreachable', function () {
    findStations(function (result) {
      expect(result).to.be.a('array');
      expect(result).to.have.length(0);
    });
    expect($.ajax.calledOnce).to.be.equal(true);
  });
});