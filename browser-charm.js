var util = require('util');
var EventEmitter = require('events').EventEmitter;

var DEFAULT_COLOR = "%c()";

function BrowserCharm() {
  this._color = DEFAULT_COLOR;
}

util.inherits(BrowserCharm, EventEmitter);

BrowserCharm.prototype.pipe = function(term) {
  this._term = term;
  return this;
};

BrowserCharm.prototype.reset = function() {
  this._term.reset();
  return;
};

BrowserCharm.prototype.cursor = function(isVisible) {
  isVisible ? this._term.cursorOn() : this._term.cursorOff();
  return this;
};

BrowserCharm.prototype.position = function(x, y) {
  this._term.cursorSet(y, x);
  return this;
};

BrowserCharm.prototype.foreground = function(color) {
  if (color == "cyan") {
    color = 'darkcyan';
  } else if (color == 94) {
    color = 'brown';
  } else {
    throw new Error('dunno what to do with color ' + color);
  }

  this._color = '%c(@' + color + ')';
  return this;
};

BrowserCharm.prototype.write = function(text) {
  console.log("write", text);
  this._term.write(this._color + text);
  return this;
};

BrowserCharm.prototype.down = function(amount) {
  return this.position(this._term.c, this._term.r + amount);
};

BrowserCharm.prototype.left = function(amount) {
  return this.position(this._term.c + -amount, this._term.r);
};

BrowserCharm.prototype.display = function(cmd) {
  if (cmd != 'reset') throw new Error('unknown display command: ' + cmd);
  this._color = DEFAULT_COLOR;
  return this;
};

module.exports = function() {
  return new BrowserCharm();
};
