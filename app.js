var express = require('express');
var browserify = require('browserify');

var PORT = process.env.PORT || 3000;

var app = express();

app.use(express.static(__dirname + '/static'));

app.get('/bundle.js', function(req, res) {
  var b = browserify([
    __dirname + '/index.js'
  ]);
  res.type('application/javascript');
  b.require(__dirname + '/browser-charm.js', {expose: 'charm'});

  return b.bundle({
    debug: true,
    detectGlobals: false
  }).on('error', function(e) {
    console.log(e);
    res.end();
  }).pipe(res);
});

app.listen(PORT, function() {
  console.log('listening on port', PORT);
});
