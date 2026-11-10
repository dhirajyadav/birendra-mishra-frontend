const http = require('http');
const { spawn } = require('child_process');

async function checkUrl(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      resolve({ status: res.statusCode, ok: res.statusCode === 200 });
    }).on('error', (err) => {
      resolve({ status: 0, error: err.message, ok: false });
    });
  });
}

async function run() {
  console.log('Starting Next.js production server on port 3000...');
  const server = spawn('npx.cmd', ['next', 'start', '-p', '3000'], {
    cwd: __dirname + '/..',
    shell: true,
  });

  server.stdout.on('data', (d) => process.stdout.write(d));
  server.stderr.on('data', (d) => process.stderr.write(d));

  // Wait for server to bind
  await new Promise((r) => setTimeout(r, 4000));

  const routes = [
    'http://localhost:3000/',
    'http://localhost:3000/insights',
    'http://localhost:3000/insights/from-headline-to-financial-consequence',
    'http://localhost:3000/book',
    'http://localhost:3000/manage',
    'http://localhost:3000/privacy',
    'http://localhost:3000/terms',
    'http://localhost:3000/sitemap.xml',
    'http://localhost:3000/robots.txt',
  ];

  let allPassed = true;
  for (const route of routes) {
    const res = await checkUrl(route);
    const pass = res.status === 200;
    console.log(`[ROUTE CHECK] ${route} -> Status: ${res.status} [${pass ? 'PASS' : 'FAIL'}]`);
    if (!pass) allPassed = false;
  }

  // Terminate server
  server.kill();
  try {
    process.kill(server.pid);
  } catch (e) {}

  if (allPassed) {
    console.log('✓ All frontend production routes verified successfully!');
    process.exit(0);
  } else {
    console.error('✗ Some routes failed.');
    process.exit(1);
  }
}

run();

