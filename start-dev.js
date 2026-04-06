import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const landingDir = path.join(__dirname, 'artifacts', 'landing');

console.log('Starting landing dev server in:', landingDir);

const child = spawn('pnpm', ['dev'], {
  cwd: landingDir,
  stdio: 'inherit',
  shell: true,
  detached: false
});

child.on('error', (err) => {
  console.error('Failed to start dev server:', err);
  process.exit(1);
});

child.on('exit', (code) => {
  console.log('Dev server exited with code:', code);
  process.exit(code);
});
