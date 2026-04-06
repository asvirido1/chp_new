#!/usr/bin/env python3

import subprocess
import sys
import os
from pathlib import Path

project_root = Path('/vercel/share/v0-project')
landing_dir = project_root / 'artifacts' / 'landing'

print(f'[v0] Starting landing app from: {landing_dir}')
print(f'[v0] Project root: {project_root}')

# Set environment variables
env = os.environ.copy()
env['PORT'] = '5173'
env['BASE_PATH'] = '/'
env['NODE_ENV'] = 'development'

os.chdir(landing_dir)

try:
    # Try pnpm first
    result = subprocess.run(['pnpm', 'vite'], env=env)
    sys.exit(result.returncode)
except FileNotFoundError:
    print('[v0] pnpm not found, trying npm')
    try:
        result = subprocess.run(['npm', 'run', 'dev'], env=env)
        sys.exit(result.returncode)
    except FileNotFoundError:
        print('[v0] npm not found either')
        sys.exit(1)
