import { spawn } from "child_process";
import ngrok from "ngrok";

const port = process.env.PORT || 8080;
const token = process.env.AUTH_TOKEN;
const NGROK_AUTH = process.env.NGROK_AUTH; // your ngrok auth token

async function start() {
  // Start ngrok tunnel
  if (!NGROK_AUTH) {
    console.error("NGROK_AUTH environment variable is missing!");
    process.exit(1);
  }

  await ngrok.authtoken(NGROK_AUTH);
  const url = await ngrok.connect({
    addr: port,
    proto: "http",
  });

  console.log("🌐 Public ngrok URL:", url);

  // Start MCP connector
  const mcp = spawn("npx", ["@typingmind/mcp", token], {
    stdio: "inherit",
    shell: true,
  });

  mcp.on("close", (code) => {
    console.log(`MCP exited with code ${code}`);
    process.exit(code);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
