import request from "supertest";
import { createApp } from "../src/app";
import { testDBSetup, testDBTeardown, testDBClear } from "./utils/test-db";

describe("Reports CSV (protected)", () => {
  const app = createApp();

  beforeAll(testDBSetup);
  afterAll(testDBTeardown);
  afterEach(testDBClear);

  it("401 when no token", async () => {
    await request(app).get("/reports/bookings.csv").expect(401);
  });

  it("200 with token & CSV content-type", async () => {
    await request(app).post("/auth/register").send({
      email: "r1@example.com", phone: "99112233", password: "secret123",
    });
    const login = await request(app).post("/auth/login").send({
      email_or_phone: "r1@example.com", password: "secret123",
    });
    const token = login.body?.access_token;

    const res = await request(app)
      .get("/reports/bookings.csv")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.headers["content-type"]).toMatch(/text\/csv/);
    expect(res.text).toContain("booking_id,status");
  });
});
