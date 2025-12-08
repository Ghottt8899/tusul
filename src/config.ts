// src/config.ts
import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: Number(process.env.PORT || 8000),
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/salon",
  jwtSecret: process.env.JWT_SECRET || "dev_secret_change_me",
  jwtExpiresMin: Number(process.env.JWT_EXPIRES_MIN || 60 * 24 * 7),
  corsOrigins: (process.env.CORS_ORIGINS || "http://localhost:3000")
    .split(",")
    .map(s => s.trim()),
  qpay: {
    username: process.env.QPAY_USERNAME || "",
    password: process.env.QPAY_PASSWORD || "",
    callbackSecret: process.env.QPAY_CALLBACK_SECRET || "",
  },
};
