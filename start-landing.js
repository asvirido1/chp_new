#!/usr/bin/env node
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const landingDir = join(__dirname, 'artifacts', 'landing');

const child = spawn('pnpm', ['dev'], {
  cwd: landingDir,
  stdio: 'inherit',
  shell: true
});

child.on('error', (error) => {
  console.error('Failed to start landing server:', error);
  process.exit(1);
});
