import request from "supertest";
import express from "express";
import { errorHandler } from "../src/middleware/error";
import { AppError } from "../src/utils/errors";
import { createApp } from "../src/app";

function appWithHandledError() {
  const app = createApp();
  app.get("/bad", (_req, _res) => {
    // status + code хоёр утгатай үедхи салааллыг алддаг тул зориудаар хоёрын аль алиныг нь өгнө
    throw new AppError("Invalid input", 400, "VALIDATION");
  });
  app.use(errorHandler);
  return app;
}

describe("error middleware (handled AppError) branches", () => {
  it("AppError → 400, body includes code", async () => {
    const app = appWithHandledError();
    const r = await request(app).get("/bad");
    expect(r.status).toBe(400);
    expect(r.body).toMatchObject({ message: "Invalid input", code: "VALIDATION" });
  });
});