import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";
import { ENV } from "./config/env.js";

async function bootstrap() {
  await connectDB();
  const app = createApp();
  app.listen(ENV.PORT, () => console.log(`🚀 Server running on :${ENV.PORT}`));
}

bootstrap().catch((e) => {
  console.error("❌ Start failed:", e);
  process.exit(1);
  
});
