import { createServer } from "node:http";

const PORT : number = 3001;

let latestDustValue : number | null = null;

const server = createServer((req, res) => {
  if (req.method === "GET" && req.url === "/api/dust") {
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    });

    res.end(JSON.stringify(latestDustValue));
    return;
  }

  if (req.method === "POST" && req.url === "/api/dust") {
    let body : string = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const data = JSON.parse(body);

        if (typeof data.dustValue !== "number") {
          res.writeHead(400, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          });

          res.end(JSON.stringify({ message: "dustValue must be number" }));
          return;
        }

        latestDustValue = data.dustValue;

        console.log("Received dustValue:", latestDustValue);

        res.writeHead(200, {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        });

        res.end(
          JSON.stringify({
            received: true,
            dustValue: latestDustValue,
          })
        );
      } catch (error) {
        res.writeHead(400, {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        });

        res.end(JSON.stringify({ message: "Invalid JSON" }));
      }
    });

    return;
  }

  res.writeHead(404, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  res.end(JSON.stringify({ message: "Not Found" }));
});

server.listen(PORT, () => {
  console.log(`Mock API server is running on http://localhost:${PORT}`);
});