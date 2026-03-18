const { spawn } = require('child_process');

const ghci = spawn('ghci', ['-ignore-dot-ghci']);
let out = '';
ghci.stdout.on('data', d => out += d.toString());
ghci.stderr.on('data', d => out += d.toString());

ghci.stdin.write('let soma a b = a + b\n');
ghci.stdin.write('soma 10 20\n');
ghci.stdin.write(':quit\n');
ghci.stdin.end();

ghci.on('close', () => {
   console.log("RESULT:\n", out);
});
