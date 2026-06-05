import { spawn } from "node:child_process";
import http from "node:http";
import path from "node:path";
import process from "node:process";

const projectRoot = process.cwd();
const proxyPort = Number(process.env.WEB_PORT ?? 8081);
const expoPort = Number(process.env.EXPO_WEB_PORT ?? proxyPort + 1);
const expoBin = path.join(
  projectRoot,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "expo.cmd" : "expo",
);

const isolationHeaders = {
  "Cross-Origin-Embedder-Policy": "require-corp",
  "Cross-Origin-Opener-Policy": "same-origin",
};

const expo = spawn(expoBin, ["start", "--web", "--port", String(expoPort)], {
  cwd: projectRoot,
  env: process.env,
  stdio: "inherit",
});

const server = http.createServer((request, response) => {
  const proxyRequest = http.request(
    {
      headers: {
        ...request.headers,
        host: `localhost:${expoPort}`,
      },
      hostname: "127.0.0.1",
      method: request.method,
      path: request.url,
      port: expoPort,
    },
    (proxyResponse) => {
      response.writeHead(proxyResponse.statusCode ?? 502, {
        ...proxyResponse.headers,
        ...isolationHeaders,
      });
      proxyResponse.pipe(response);
    },
  );

  proxyRequest.on("error", () => {
    if (!response.headersSent) {
      response.writeHead(502, {
        "Content-Type": "text/plain",
        ...isolationHeaders,
      });
    }
    response.end("Expo dev server is not ready yet. Refresh shortly.");
  });

  request.pipe(proxyRequest);
});

server.on("upgrade", (request, socket, head) => {
  const proxyRequest = http.request({
    headers: {
      ...request.headers,
      host: `localhost:${expoPort}`,
    },
    hostname: "127.0.0.1",
    method: request.method,
    path: request.url,
    port: expoPort,
  });

  proxyRequest.on("upgrade", (proxyResponse, proxySocket, proxyHead) => {
    socket.write(
      [
        `HTTP/${proxyResponse.httpVersion} ${proxyResponse.statusCode} ${proxyResponse.statusMessage}`,
        ...Object.entries(proxyResponse.headers).map(([key, value]) =>
          Array.isArray(value) ? `${key}: ${value.join(", ")}` : `${key}: ${value}`,
        ),
        "",
        "",
      ].join("\r\n"),
    );

    if (proxyHead.length > 0) {
      socket.write(proxyHead);
    }
    if (head.length > 0) {
      proxySocket.write(head);
    }

    proxySocket.pipe(socket);
    socket.pipe(proxySocket);
  });

  proxyRequest.on("error", () => socket.destroy());
  proxyRequest.end();
});

server.listen(proxyPort, () => {
  console.log(`Web: http://localhost:${proxyPort}`);
  console.log(`Expo dev server: http://localhost:${expoPort}`);
});

function shutdown() {
  server.close();
  expo.kill("SIGINT");
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
expo.on("exit", (code) => {
  server.close(() => {
    process.exit(code ?? 0);
  });
});
