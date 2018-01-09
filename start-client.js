const args = [ 'start' ];
const opts = { stdio: 'inherit', cwd: 'beta-app', shell: true };
require('child_process').spawn('npm', args, opts);
