import { createReadStream, existsSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import http from "node:http";
import { openShopDatabase, readStore, writeStore } from "./db.mjs";

const currentDir = dirname(fileURLToPath(import.meta.url));
const rootDir = dirname(currentDir);
const port = Number(process.env.PORT || 8000);
const database = openShopDatabase();

// 로컬 개발 서버에서 정적 파일과 JSON API를 함께 제공하기 위한 최소 MIME 매핑이다.
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);

    // 브라우저 앱은 이 API 하나로 전체 store 스냅샷을 읽고 저장한다.
    if (url.pathname === "/api/store") {
      await handleStoreApi(request, response);
      return;
    }

    await serveStaticFile(url, response);
  } catch (error) {
    sendJson(response, 500, { error: error.message });
  }
});

server.listen(port, () => {
  console.log(`BEAUTY REF. local server: http://localhost:${port}`);
  console.log("SQLite DB: data/beauty-shop.sqlite");
});

async function handleStoreApi(request, response) {
  if (request.method === "GET") {
    // SQLite 테이블을 UI가 쓰는 store 객체로 조립해서 반환한다.
    sendJson(response, 200, readStore(database));
    return;
  }

  if (request.method === "PUT") {
    // 데모 앱 특성상 부분 업데이트 대신 전체 store 스냅샷을 DB에 반영한다.
    const body = await readBody(request);
    writeStore(database, JSON.parse(body || "{}"));
    sendJson(response, 200, { ok: true });
    return;
  }

  sendJson(response, 405, { error: "Method not allowed" });
}

async function serveStaticFile(url, response) {
  const requestPath = url.pathname === "/" ? "/index.html" : url.pathname;
  const decodedPath = decodeURIComponent(requestPath);
  // ../ 경로 이동을 막아 프로젝트 루트 바깥 파일이 노출되지 않게 한다.
  const safePath = normalize(decodedPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(rootDir, safePath);

  if (!filePath.startsWith(rootDir) || !existsSync(filePath)) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream",
  });
  createReadStream(filePath).pipe(response);
}

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(payload));
}
