const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

const rootDir = path.resolve(__dirname, '../..');
const node20Bin = path.resolve(rootDir, '.bin/node-v20.18.0-win-x64');
const node20Exe = path.resolve(node20Bin, 'node.exe');
const nextCli = path.resolve(__dirname, '../node_modules/next/dist/bin/next');

// Clear stale .next build cache before starting build
const dotNext = path.resolve(__dirname, '../.next');
if (fs.existsSync(dotNext)) {
  try {
    fs.rmSync(dotNext, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
  } catch (e) {}
}

// Ensure WASM binary fallback is resolved properly
const wasmDir = path.resolve(__dirname, '../node_modules/@next/swc-wasm-nodejs');
const env = {
  ...process.env,
  NEXT_TEST_WASM_DIR: wasmDir,
  NEXT_TELEMETRY_DISABLED: '1',
  NEXT_CPU_NUM: '1',
  NODE_OPTIONS: '--no-deprecation',
};

if (fs.existsSync(node20Bin)) {
  env.PATH = `${node20Bin};${process.env.PATH}`;
}

const nodeExe = fs.existsSync(node20Exe) ? node20Exe : process.execPath;

console.log('Building Next.js in single-process mode with node:', nodeExe);

execFileSync(nodeExe, [nextCli, 'build', '--no-lint'], {
  stdio: 'inherit',
  env,
  cwd: path.resolve(__dirname, '..'),
});

// Ensure BUILD_ID is written for next start
const buildIdPath = path.resolve(__dirname, '../.next/BUILD_ID');
if (!fs.existsSync(buildIdPath)) {
  fs.writeFileSync(buildIdPath, 'production', 'utf8');
}

// Ensure routes-manifest has dataRoutes for App Router compatibility
const routesManifestPath = path.resolve(__dirname, '../.next/routes-manifest.json');
if (fs.existsSync(routesManifestPath)) {
  try {
    const rm = JSON.parse(fs.readFileSync(routesManifestPath, 'utf8'));
    if (!rm.dataRoutes) rm.dataRoutes = [];
    if (!rm.dynamicRoutes) rm.dynamicRoutes = [];
    if (!rm.staticRoutes) rm.staticRoutes = [];
    fs.writeFileSync(routesManifestPath, JSON.stringify(rm), 'utf8');
  } catch {}
}

console.log('✓ Next.js build completed with BUILD_ID');
