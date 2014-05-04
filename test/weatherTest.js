var expect = require('chai').expect,
  sinon = require('sinon'),
  include = require('./include.js').include,
  jsdom = require('jsdom'),
  window = jsdom.jsdom().createWindow();
$ = require('jquery')(window);

include('src/js/weather.js');

describe("_getWeatherMessage", function () {

  it('_getWeatherMessage should return proper message for specific condition', function () {
    [null, [], {}, "", 24, "24"].forEach(function (param) {
      expect(_getWeatherMessage(param, 30)).to.be.equal(
        'The dark side clouds everything. Impossible to see the future is.');
    });
    [null, [], {}, ""].forEach(function (param) {
      expect(_getWeatherMessage(30, param)).to.be.equal(
        'The dark side clouds everything. Impossible to see the future is.');
    });
    expect(_getWeatherMessage(0, 0)).to.be.equal(
      'Current temperature in Warsaw is 0.<\/br> There will be thunderstorms during your trip');
    expect(_getWeatherMessage(30, 0)).to.be.equal(
      'Current temperature in Warsaw is 0.<\/br> It will be great weather during your trip');
  });
});


describe('sunsetSunrise success', function () {
  beforeEach(function () {
    this.callback = sinon.spy();

    sinon.stub($, 'ajax', function (options) {

      var deferred = $.Deferred();

      var json = {
        moon_phase: {
          percentIlluminated: '19',
          ageOfMoon: '4',
          phaseofMoon: 'Waxing Crescent',
          hemisphere: 'North',
          current_time: {
            hour: '18',
            minute: '01'
          },
          sunrise: {
            hour: '5',
            minute: '02'
          },
          sunset: {
            hour: '20',
            minute: '04'
          }
        }
      };
      deferred.done(options.success(json));

      return deferred;
    });
  });
  afterEach(function () {
    $.ajax.restore();
  });

  it('sunsetSunrise call callback with parsed weather information passed as a argument', function () {
    sunsetSunrise({}, function (result) {
      expect(result).to.be.deep.equal({
        sunriseHour: '5',
        sunriseMinute: '02',
        sunsetHour: '20',
        sunsetMinute: '04'
      });
    });
    expect($.ajax.calledOnce).to.be.equal(true);
  });
});

describe('sunsetSunrise error', function () {
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

  it('should call calback with all hours set to NaN when api is unreachable', function () {
    sunsetSunrise({}, function (result) {
      expect(result).to.be.deep.equal({
        sunriseHour: Math.NaN,
        sunriseMinute: Math.NaN,
        sunsetHour: Math.NaN,
        sunsetMinute: Math.NaN
      });
    });
    expect($.ajax.calledOnce).to.be.equal(true);
  });
});

describe('weather success', function () {
  beforeEach(function () {
    this.callback = sinon.spy();

    sinon.stub($, 'ajax', function (options) {

      var deferred = $.Deferred();
      var json = {
        hourly_forecast: [
          {
            FCTTIME: {
              hour: "20"
            },
            temp: {metric: "7"},
            condition: "Chance of Rain",
            icon_url: "http://some.valud.uri/to/weather/image/rain"
          },
          {
            FCTTIME: {
              hour: "21"
            },
            temp: {metric: "8"},
            condition: "Clear",
            icon_url: "http://some.valud.uri/to/weather/image/clear"
          },
          {
            FCTTIME: {
              hour: "22"
            },
            temp: {metric: "5"},
            condition: "Snow",
            icon_url: "http://some.valud.uri/to/weather/image/snow"
          },
          {
            FCTTIME: {
              hour: "23"
            },
            temp: {metric: "3"},
            condition: "Sunny",
            icon_url: "http://some.valud.uri/to/weather/image/sunny"
          },
          {
            FCTTIME: {
              hour: "0"
            },
            temp: {metric: "1"},
            condition: "Chance of Rain",
            icon_url: "http://some.valud.uri/to/weather/image"
          },
          {
            FCTTIME: {
              hour: "1"
            },
            temp: {metric: "0"},
            condition: "Chance of Rain",
            icon_url: "http://some.valud.uri/to/weather/image"
          }
        ]
      };
      deferred.done(options.success(json));

      return deferred;
    });
  });
  afterEach(function () {
    $.ajax.restore();
  });

  it('should call calback with error result', function () {
    weather(1, 3, function (result) {
      expect(result).to.be.deep.equal({
        message: 'Current temperature in Warsaw is 7.<\/br> It will be snowing during your trip',
        icon: 'http://some.valud.uri/to/weather/image/snow',
        endHour: 4,
        startHour: 1
      });
    });
    expect($.ajax.calledOnce).to.be.equal(true);
  });
});

describe('weather error', function () {
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

  it('should call calback with error result', function () {
    weather(1, 3, function (result) {
      expect(result).to.be.deep.equal({
        message: 'The dark side clouds everything. Impossible to see the future is.',
        icon: '',
        endHour: 4,
        startHour: 1
      });
    });
    expect($.ajax.calledOnce).to.be.equal(true);
  });
});