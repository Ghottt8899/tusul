// tests/auth.middleware.test.ts
import request from "supertest";
import { createApp } from "../src/app";
import { testDBSetup, testDBTeardown, testDBClear } from "./utils/test-db";

describe("Auth middleware branches", () => {
  const app = createApp();

  beforeAll(testDBSetup);
  afterAll(testDBTeardown);
  afterEach(testDBClear);

  it("missing Authorization → 401", async () => {
    await request(app).post("/bookings/").send({
      service_id: "s1",
      staff_id: "st1",
      start: "2030-01-01T10:00:00Z",
    }).expect(401);
  });

  it("invalid token → 401", async () => {
    await request(app)
      .post("/bookings/")
      .set("Authorization", "Bearer totally.invalid.token")
      .send({
        service_id: "s1",
        staff_id: "st1",
        start: "2030-01-01T10:00:00Z",
      })
      .expect(401);
  });
});
