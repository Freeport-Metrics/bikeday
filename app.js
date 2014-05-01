var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs")
port = Number(process.env.PORT || 8765);
debug = process.argv[3] || false;

http.createServer(function (request, response) {

    console.log(request.url);
    var uri = url.parse(request.url).pathname
        , filename = path.join(process.cwd(), uri);

    if (request.url === "/veturilo") {
        if (debug) {
            fs.readFile("./mockdata/veturilo.xml", "binary", function (err, file) {
                if (err) {
                    response.writeHead(500, {"Content-Type": "text/plain"});
                    response.write(err + "\n");
                    response.end();
                    return;
                }

                response.writeHead(200);
                response.write(file, "binary");
                response.end();
            });
            return;
        }
        var options = {
            host: 'nextbike.net',
            path: '/maps/nextbike-official.xml?city=210'
        };

        callback = function (res) {
            var str = '';

            res.on('data', function (chunk) {
                str += chunk;
            });

            res.on('end', function () {
                response.writeHead(200, {"Content-Type": "text/xml; charset=utf-8"});
                response.write(str, "binary");
                response.end();
            });
        }

        http.request(options, callback).end();
        return;
    }
    fs.exists(filename, function (exists) {
        if (!exists) {
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("404 Not Found\n");
            response.end();
            return;
        }

        if (fs.statSync(filename).isDirectory()) filename += '/index.html';


        fs.readFile(filename, "binary", function (err, file) {
            if (err) {
                response.writeHead(500, {"Content-Type": "text/plain"});
                response.write(err + "\n");
                response.end();
                return;
            }

            response.writeHead(200);
            response.write(file, "binary");
            response.end();
        });
    });
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");
