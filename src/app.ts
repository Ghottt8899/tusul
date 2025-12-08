import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { config } from "./config";

// routes
import { auth } from "./routes/auth";
import { bookings } from "./routes/booking";
import { surveys } from "./routes/surveys";
import { payments } from "./routes/payments";
import { uploads } from "./routes/uploads";
import { reports } from "./routes/reports";

// centralized error handler
import { errorHandler } from "./middleware/error";

export function createApp() {
  const app = express();

  // --- security & common middleware ---
  app.use(helmet());
  app.use(cors({ origin: config.corsOrigins, credentials: true }));
  app.use(morgan("dev"));
  app.use(express.json({ limit: "5mb" }));
  app.use(cookieParser());

  // --- routes ---
  app.use("/auth", auth);
  app.use("/bookings", bookings);
  app.use("/surveys", surveys);
  app.use("/payments", payments);
  app.use("/uploads", uploads);
  app.use("/reports", reports);

  // healthcheck
  app.get("/health", (_req, res) => res.json({ ok: true }));

  // --- must be last: error handler ---
  app.use(errorHandler);

  return app;
}