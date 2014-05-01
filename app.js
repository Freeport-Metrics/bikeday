var express = require('express')
  , cors = require('cors')
  , http = require("http")
  , port = Number(process.env.PORT || 8765)
  , app = express();

app.use(cors());
app.use("/index.html", express.static(__dirname + '/index.html'));
app.use("/", express.static(__dirname))

app.get('/veturilo/stations', function (req, res, next) {
  console.log('Get veturilo xml');

  var options = {
    host: 'nextbike.net',
    path: '/maps/nextbike-official.xml?city=210',
    method: 'GET',
    headers: req.headers
  };

  var creq = http.get(options, function (cres) {
    cres.on('data', function (chunk) {
      res.write(chunk);
    });

    cres.on('end', function () {
      console.log(cres.statusCode);
      res.end();
    });

  }).on('error', function (e) {
    console.log(e.message);
    res.writeHead(500);
    res.end();
  });

  creq.end();

});


var server = app.listen(port, function () {
  console.log('Listening on http://localhost:' + server.address().port);
});
