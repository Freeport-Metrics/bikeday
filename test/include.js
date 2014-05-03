var fs = require("fs");

//http://stackoverflow.com/a/20473643/1387612
function read(f) {
  return fs.readFileSync(f).toString();
}
function include(f) {
  eval.apply(global, [read(f)]);
}

module.exports.include = include;