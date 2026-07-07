import { createServer } from "node:http";

const server = createServer((req, res) => {
  if (req.method === "GET" && req.url === "/api/dust") {
    const dustValue = Math.floor(Math.random() * 101);

    res.writeHead(200, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    });

    res.end(JSON.stringify(dustValue));
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(3001);