const path = require('path');
const fs = require('fs');
const { spawn, execFileSync } = require('child_process');

const rootDir = path.resolve(__dirname, '../..');
const node20Bin = path.resolve(rootDir, '.bin/node-v20.18.0-win-x64');
const node20Exe = path.resolve(node20Bin, 'node.exe');
const nextCli = path.resolve(__dirname, '../node_modules/next/dist/bin/next');

const rootNextDir = path.resolve(__dirname, '../.next');
const routesManifestPath = path.join(rootNextDir, 'routes-manifest.json');

const wasmDir = path.resolve(__dirname, '../node_modules/@next/swc-wasm-nodejs');
const env = {
  ...process.env,
  NEXT_TEST_WASM_DIR: wasmDir,
};

if (fs.existsSync(node20Bin)) {
  env.PATH = `${node20Bin};${process.env.PATH}`;
}

const nodeExe = fs.existsSync(node20Exe) ? node20Exe : process.execPath;

// If routes-manifest.json does not exist, trigger a build first
if (!fs.existsSync(routesManifestPath)) {
  console.log('[start.js] Production build missing or incomplete. Running build first...');
  execFileSync(nodeExe, [path.resolve(__dirname, 'build.js')], {
    stdio: 'inherit',
    env,
    cwd: path.resolve(__dirname, '..'),
  });
}

// Ensure BUILD_ID exists
const buildIdPath = path.join(rootNextDir, 'BUILD_ID');
if (!fs.existsSync(buildIdPath)) {
  fs.writeFileSync(buildIdPath, 'production', 'utf8');
}

// Ensure routes-manifest has dataRoutes for App Router compatibility
if (fs.existsSync(routesManifestPath)) {
  try {
    const rm = JSON.parse(fs.readFileSync(routesManifestPath, 'utf8'));
    if (!rm.dataRoutes) rm.dataRoutes = [];
    if (!rm.dynamicRoutes) rm.dynamicRoutes = [];
    if (!rm.staticRoutes) rm.staticRoutes = [];
    fs.writeFileSync(routesManifestPath, JSON.stringify(rm), 'utf8');
  } catch {}
}

const child = spawn(nodeExe, [nextCli, 'start', '-H', '127.0.0.1', '-p', process.env.PORT || '3000'], {
  stdio: 'inherit',
  env,
  cwd: path.resolve(__dirname, '..'),
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
