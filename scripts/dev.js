const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const rootDir = path.resolve(__dirname, '../..');
const node20Bin = path.resolve(rootDir, '.bin/node-v20.18.0-win-x64');
const node20Exe = path.resolve(node20Bin, 'node.exe');
const nextCli = path.resolve(__dirname, '../node_modules/next/dist/bin/next');

// Auto-clean .next cache to ensure clean dev environment with zero chunk/manifest collisions
const dotNext = path.resolve(__dirname, '../.next');
if (fs.existsSync(dotNext)) {
  try {
    fs.rmSync(dotNext, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
    console.log('[dev.js] Initialized fresh development cache.');
  } catch (err) {
    // Ignore locked files if any
  }
}

const wasmDir = path.resolve(__dirname, '../node_modules/@next/swc-wasm-nodejs');
const env = {
  ...process.env,
  NEXT_TEST_WASM_DIR: wasmDir,
  NEXT_TELEMETRY_DISABLED: '1',
};

if (fs.existsSync(node20Bin)) {
  env.PATH = `${node20Bin};${process.env.PATH}`;
}

const nodeExe = fs.existsSync(node20Exe) ? node20Exe : process.execPath;

const child = spawn(nodeExe, [nextCli, 'dev', '-H', '127.0.0.1', '-p', process.env.PORT || '3000'], {
  stdio: 'inherit',
  env,
  cwd: path.resolve(__dirname, '..'),
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
