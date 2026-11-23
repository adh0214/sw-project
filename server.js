const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const envFile = path.join(__dirname, '.env');
if (fs.existsSync(envFile)) {
  for (const rawLine of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const line = rawLine.replace(/^\uFEFF/, '');
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (match && !match[1].startsWith('#') && process.env[match[1]] === undefined) {
      process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
    }
  }
}

const PORT = process.env.PORT || 3000;
const METRO_PORT = Number(process.env.EXPO_DEV_PORT || 8081);
const DIST_DIR = path.join(__dirname, 'dist');
const KCA_API_BASE = 'https://apis.data.go.kr/B551919/ProductPriceInfoService';
const KCA_API_KEY = process.env.KCA_SERVICE_KEY;
let goodsCache = { expiresAt: 0, items: [] };
let metroProcess;

// 정적 웹 빌드가 없으면 기존 3000 서버 앞에서 Expo 웹 개발 서버를 실행합니다.
if (!fs.existsSync(path.join(DIST_DIR, 'index.html'))) {
  const expoCli = path.join(__dirname, 'node_modules', 'expo', 'bin', 'cli');
  metroProcess = spawn(process.execPath, [expoCli, 'start', '--web', '--port', String(METRO_PORT)], {
    cwd: __dirname,
    env: process.env,
    stdio: 'inherit',
  });
  metroProcess.on('error', (error) => console.error('Expo web server failed to start:', error));
}

function parseKcaItems(xml) {
  const decode = (value) => value
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'").replace(/&amp;/g, '&');
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, itemXml]) => {
    const item = {};
    for (const [, key, rawValue] of itemXml.matchAll(/<([A-Za-z0-9_]+)>([\s\S]*?)<\/\1>/g)) {
      item[key] = decode(rawValue.trim());
    }
    return item;
  });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (requestUrl.pathname.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (!KCA_API_KEY) {
      res.writeHead(503);
      res.end(JSON.stringify({ error: 'KCA_SERVICE_KEY 환경변수를 설정해야 참가격 API를 사용할 수 있습니다.' }));
      return;
    }
    if (requestUrl.pathname !== '/api/products' && requestUrl.pathname !== '/api/prices') {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'API endpoint not found' }));
      return;
    }

    try {
      if (requestUrl.pathname === '/api/prices') {
        const goodId = requestUrl.searchParams.get('goodId');
        if (!goodId) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'goodId가 필요합니다.' }));
          return;
        }
        const inspectDate = new Date();
        const daysSinceFriday = (inspectDate.getUTCDay() + 2) % 7;
        inspectDate.setUTCDate(inspectDate.getUTCDate() - daysSinceFriday);
        const goodInspectDay = inspectDate.toISOString().slice(0, 10).replace(/-/g, '');
        const apiUrl = new URL(`${KCA_API_BASE}/getProductPriceInfoSvc.do`);
        apiUrl.searchParams.set('serviceKey', KCA_API_KEY);
        apiUrl.searchParams.set('goodInspectDay', goodInspectDay);
        apiUrl.searchParams.set('goodId', goodId);
        const response = await fetch(apiUrl);
        const body = await response.text();
        if (!response.ok) throw new Error(`참가격 가격 API HTTP ${response.status}`);
        const items = parseKcaItems(body);
        if (!items.length && !/<resultCode>00<\/resultCode>/.test(body)) {
          throw new Error('해당 조사일의 가격이 없거나 API 응답에 오류가 있습니다.');
        }
        res.writeHead(200);
        res.end(JSON.stringify({ source: '한국소비자원 참가격 OpenAPI', goodInspectDay, items }));
        return;
      }

      if (Date.now() >= goodsCache.expiresAt) {
        const apiUrl = new URL(`${KCA_API_BASE}/getProductInfoSvc.do`);
        apiUrl.searchParams.set('ServiceKey', KCA_API_KEY);
        const response = await fetch(apiUrl);
        const body = await response.text();
        if (!response.ok) throw new Error(`참가격 API HTTP ${response.status}`);
        const items = parseKcaItems(body);
        if (!items.length && /<resultCode>00<\/resultCode>/.test(body) === false) {
          throw new Error('참가격 API 응답에 상품 목록이 없습니다. 인증키 또는 API 활용 승인을 확인해 주세요.');
        }
        goodsCache = { items, expiresAt: Date.now() + 6 * 60 * 60 * 1000 };
      }
      const query = (requestUrl.searchParams.get('q') || '').trim().toLowerCase();
      const items = query ? goodsCache.items.filter((item) => String(item.goodName || '').toLowerCase().includes(query)) : goodsCache.items;
      res.writeHead(200);
      res.end(JSON.stringify({ source: '한국소비자원 참가격 OpenAPI', items }));
    } catch (error) {
      res.writeHead(502);
      res.end(JSON.stringify({ error: error.message }));
    }
    return;
  }

  // 개발 중에는 UI 및 번들 요청을 Metro에 전달하고, /api 요청은 위에서 처리합니다.
  if (!fs.existsSync(path.join(DIST_DIR, 'index.html'))) {
    const proxy = http.request({
      hostname: '127.0.0.1',
      port: METRO_PORT,
      path: req.url,
      method: req.method,
      headers: req.headers,
    }, (upstream) => {
      res.writeHead(upstream.statusCode || 502, upstream.headers);
      upstream.pipe(res);
    });
    proxy.on('error', (error) => {
      if (!res.headersSent) {
        res.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(`Expo 웹 서버에 연결할 수 없습니다: ${error.message}`);
      }
    });
    req.pipe(proxy);
    return;
  }

  let reqPath = decodeURI(requestUrl.pathname);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  let filePath = path.join(DIST_DIR, reqPath);
  if (!filePath.startsWith(DIST_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) filePath = path.join(DIST_DIR, 'index.html');
    const ext = path.extname(filePath).toLowerCase();
    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500);
        res.end(`Error loading ${reqPath}`);
        return;
      }
      res.writeHead(200, {
        'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content);
    });
  });
});

// Metro의 HMR WebSocket도 3000을 통해 연결합니다.
server.on('upgrade', (req, socket, head) => {
  const proxy = http.request({
    hostname: '127.0.0.1',
    port: METRO_PORT,
    path: req.url,
    headers: req.headers,
  });
  proxy.on('upgrade', (upstream, upstreamSocket, upstreamHead) => {
    let response = `HTTP/${upstream.httpVersion} ${upstream.statusCode} ${upstream.statusMessage}\r\n`;
    for (const [name, value] of Object.entries(upstream.headers)) {
      response += `${name}: ${value}\r\n`;
    }
    socket.write(`${response}\r\n`);
    if (head.length) upstreamSocket.write(head);
    if (upstreamHead.length) socket.write(upstreamHead);
    upstreamSocket.pipe(socket);
    socket.pipe(upstreamSocket);
  });
  proxy.on('error', () => socket.destroy());
  proxy.end();
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`STOCKMATE Server running at http://localhost:${PORT}`);
});

const shutdown = () => {
  if (metroProcess && !metroProcess.killed) metroProcess.kill();
  server.close(() => process.exit(0));
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
