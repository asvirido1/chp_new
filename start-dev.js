#!/usr/bin/env node

import path from 'path';
import { fileURLToPath } from 'url';
import { fork } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = __dirname;
const landingDir = path.join(projectRoot, 'artifacts', 'landing');

// Set up environment
const env = {
  ...process.env,
  PORT: '5173',
  BASE_PATH: '/',
  NODE_ENV: 'development'
};

console.log('[v0] Starting landing app on port 5173...');
console.log('[v0] Project root:', projectRoot);
console.log('[v0] Landing dir:', landingDir);

// Try to use vite CLI directly
const viteBin = path.join(projectRoot, 'node_modules', '.bin', 'vite');

console.log('[v0] Attempting to run vite from:', viteBin);

const proc = fork(viteBin, [], {
  cwd: landingDir,
  env,
  execArgv: ['--loader=ts-node/esm']
});

proc.on('error', (err) => {
  console.error('[v0] Fork error:', err.message);
});

proc.on('exit', (code) => {
  console.log('[v0] Process exited with code:', code);
});
