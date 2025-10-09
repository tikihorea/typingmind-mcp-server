import { spawn } from "child_process";
import http from "http";

const port = process.env.PORT || 8080;
const token = process.env.AUTH_TOKEN;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("TypingMind MCP connector is running.\n");
});

server.listen(port, () => {
  console.log(`HTTP server running on port ${port}`);
  console.log("Starting MCP connector...");

  const mcp = spawn("npx", ["@typingmind/mcp", token], { stdio: "inherit", shell: true });

  mcp.on("close", (code) => {
    console.log(`MCP connector exited with code ${code}`);
  });
});
