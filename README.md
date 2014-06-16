App for Warsaw city bikes. Plan your trip, check bike availability. Check weather during the ride and see if you will
get to your destination before sunset.

###Prerequisites
* Node.js

###Run application

1. Checkout code `git clone https://github.com/Freeport-Metrics/bikeday`
2. `npm install`
3. Start app `grunt && grunt server`
4. Navigate to [http://localhost:8001/index.html](http://localhost:8765/index.html)
5. Code, code, code...
6. Deploy `git checkout gh-pages && git merge master --no-commit --no-ff && grunt && grunt bump`

###CREDITS

* [Nextbike API](http://nextbike.net/)
* [wunderground](http://api.wunderground.com/)
* [Google Maps API](https://developers.google.com/maps/)
* Icons by [Glyphish](http://www.glyphish.com/)
* Map markers from [mapicons](http://mapicons.nicolasmollet.com/)

###Configuration

Set 'patterns' in Gruntfile.js to customize settings
