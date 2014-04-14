var path = require('path');
var exec = require('child_process').exec;
var charm = require('charm')(process.stdin);

charm.removeAllListeners('^C')
charm.on('^C', function () {
  finish(3);
})

charm.pipe(process.stdout);
charm.reset();
charm.cursor(false);

var argv = require('minimist')(process.argv.slice(2), {
  string: ['_'],
  default: {},
  alias: {
    'help': 'h',
    'say': 's'
  }
});

if (argv.help) {
  console.log('Usage: %s [options] <time>', path.basename(process.argv[1]));
  console.log();
  console.log('Arguments:');
  console.log('  <time>     can be a number of seconds expressed as a bare number, e.g. 10');
  console.log('             or minutes and seconds separated by a colon, e.g. 1:30');
  console.log('             or digits suffixed with m and s respectively, e.g. 1m 30s');
  console.log();
  console.log('Options:');
  console.log('  --say, -s [alert]      Say an alert when the timer ends, optionally specifying the alert');
  console.log();
  process.exit(0);
}

var say = false;
if (argv.say) say = (typeof argv.say === 'boolean') ? 'Your coffee is ready!' : argv.say;

const BROWN = 94;

var start = Date.now();
var duration = parse(argv._.join(' ')) || 4 * 60;

var frames = ["\
     o        \n\
     |        \n\
     |        \n\
     |        \n\
   ,-\"-.      \n\
 _r--+--i     \n\
 \\ =====|-.   \n\
  |     | |   \n\
  |     | |   \n\
  |     |'    \n\
  (=====)     \n\
","\
              \n\
     o        \n\
     |        \n\
     |        \n\
   ,-\"-.      \n\
 _r--+--i     \n\
 \\   |  |-.   \n\
  |=====| |   \n\
  |     | |   \n\
  |     |'    \n\
  (=====)     \n\
","\
              \n\
              \n\
     o        \n\
     |        \n\
   ,-\"-.      \n\
 _r--+--i     \n\
 \\   |  |-.   \n\
  |  |  | |   \n\
  |=====| |   \n\
  |     |'    \n\
  (=====)     \n\
","\
              \n\
              \n\
              \n\
     o        \n\
   ,-\"-.      \n\
 _r--+--i     \n\
 \\   |  |-.   \n\
  |  |  | |   \n\
  |  |  | |   \n\
  |=====|'    \n\
  (=====)     \n\
"];

function go () {

  var elapsed = Math.floor((Date.now() - start) / 1000);
  var left = duration - elapsed;

  var frameIdx = (frames.length - 1) - Math.ceil((left / duration) * (frames.length - 1));
  charm.position(0, 0);
  charm.foreground('cyan').write(frames[frameIdx]);

  /*
  for (var i = 0; i < 4; i++) {
    charm.position(4, 8 + i);
    charm.background(BROWN).write("     ");
    charm.background('black');
  }
  */

  charm.position(4, 8 + frameIdx);
  charm.foreground(BROWN).write(displayTime(left));

  if (left <= 0) finish();
}

function finish (extra) {
  extra = extra || 0;
  charm.down(2 + extra);
  charm.left(9);
  charm.cursor(true);
  if (id) clearInterval(id);
  if (say) exec('say "' + say + '"');
  process.exit(0);
}

function displayTime(left) {
  var mins = ('0' + Math.floor(left / 60)).substr(-2);
  var secs = ('0' + (left % 60)).substr(-2);
  return mins + ':' + secs;
}

function parse(spec) {
  if (!spec) return false;

  if (spec.match(/^\d+$/)) {
    return parseInt(spec);
  }
  else if (spec.match(/^\d+:\d+$/)) {
    var parts = spec.split(':');
    return parseInt(parts[0] * 60) + parseInt(parts[1]);
  }
  else if (spec.match(/\d+m/) || spec.match(/\d+s/)) {
    var minMatch = spec.match(/(\d+)m/);
    var secMatch = spec.match(/(\d+)s/);
    var s = 0;
    if (minMatch) s += parseInt(60 * minMatch[1]);
    if (secMatch) s += parseInt(secMatch[1]);
    return s;
  }

  throw new Error("Unable to parse timer length: " + spec);
}

go();
var id = setInterval(go, 1000);