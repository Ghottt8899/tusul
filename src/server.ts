import { createApp } from "./app";
import { connectDB } from "./db";
import { config } from "./config";

async function bootstrap() {
  await connectDB();
  const app = createApp();
  app.listen(config.port, () => {
    console.log(`✅ API running on http://localhost:${config.port}`);
  });
}

bootstrap();
