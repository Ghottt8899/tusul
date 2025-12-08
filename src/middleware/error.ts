// src/middleware/error.ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import { logger } from "../utils/logger";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    logger.warn(err.code || "APP_ERROR", err.message);
    return res.status(err.status).json({ message: err.message, code: err.code });
  }
  logger.error("UNHANDLED", err);
  return res.status(500).json({ message: "Internal Server Error" });
}
