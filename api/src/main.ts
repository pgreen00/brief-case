import { getSecret } from "./infrastructure/configuration.js";
import createApp from './app.js';
import { createSecureServer } from "http2";
import { readFileSync } from "fs";

async function startServer() {
  const app = await createApp()
  const port = await getSecret('API_PORT') || 443
  const keyPath = await getSecret('SSL_KEY')
  const certPath = await getSecret('SSL_CRT')
  const server = createSecureServer({
    key: readFileSync(keyPath!),
    cert: readFileSync(certPath!)
  }, app.callback());
  server.listen(Number(port), () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer()
