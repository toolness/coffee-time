var charm = require('charm')();
charm.pipe(process.stdout);
charm.reset();

for (var i = 0; i <= 255; i++) {
  charm.display("dim").foreground(i).write(i + '    ');
}
