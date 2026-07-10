import { createServer } from "node:http";

const PORT = 3001;

let latestDustValue = null;

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });

  res.end(JSON.stringify(data));
}

const server = createServer((req, res) => {
  const method = req.method;
  const url = req.url;

  console.log(`${method} ${url}`);

  if (method === "OPTIONS") {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (url !== "/api/dust") {
    sendJson(res, 404, { message: "Not Found" });
    return;
  }

  if (method === "GET") {
    console.log("GET latestDustValue:", latestDustValue);
    sendJson(res, 200, latestDustValue);
    return;
  }

  if (method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      console.log("Raw body:", body);

      try {
        const data = JSON.parse(body);

        if (typeof data.dustValue !== "number") {
          sendJson(res, 400, { message: "dustValue must be number" });
          return;
        }

        latestDustValue = data.dustValue;

        console.log("Saved latestDustValue:", latestDustValue);

        sendJson(res, 200, {
          received: true,
          dustValue: latestDustValue,
        });
      } catch (error) {
        console.log("JSON parse error:", error);
        sendJson(res, 400, { message: "Invalid JSON" });
      }
    });

    return;
  }

  sendJson(res, 405, { message: "Method Not Allowed" });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Mock API server is running on http://0.0.0.0:${PORT}`);
});