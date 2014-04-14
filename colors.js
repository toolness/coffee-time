var charm = require('charm')();
charm.pipe(process.stdout);
charm.reset();

charm.write('standard colors:\t');
for (var i = 0; i < 8; i++) {
  charm.display('reset').foreground(i).write(i.toString()).background(i).write('\t');
}

charm.display('reset').write('\n\nhigh intensity colors:\t');
for (var i = 8; i < 16; i++) {
  charm.display('reset').foreground(i).write(i.toString()).background(i).write('\t');
}

charm.display('reset').write('\n\n216 colors:');
for (var i = 16; i < 232; i++) {
  if (i % 16 === 0) charm.write('\n');
  charm.display('reset').foreground(i).write(i.toString()).background(i).write('\t');
}

charm.display('reset').write('\n\ngrayscale:\t');
for (var i = 232; i < 256; i++) {
  charm.display('reset').foreground(i).write(i.toString()).background(i).write('\t');
}

charm.write('\n\n');
charm.display('reset');
