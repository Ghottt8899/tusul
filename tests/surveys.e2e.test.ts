import request from "supertest";
import { createApp } from "../src/app";
import { testDBSetup, testDBTeardown, testDBClear } from "./utils/test-db";

describe("Surveys E2E", () => {
  const app = createApp();
  let token = "";

  beforeAll(async () => {
    await testDBSetup();

    await request(app).post("/auth/register").send({
      email: "user2@example.com",
      phone: "88888888",
      full_name: "User Two",
      password: "secret123",
    });

    const login = await request(app).post("/auth/login").send({
      email_or_phone: "user2@example.com",
      password: "secret123",
    });

    token = login.body.access_token;
  });

  afterAll(async () => {
    await testDBTeardown();
  });

  afterEach(async () => {
    await testDBClear();
  });

  it("returns risk score", async () => {
    const res = await request(app)
      .post("/surveys/submit")
      .set("Authorization", `Bearer ${token}`)
      .send({ answers: { smoke: true, bmi: 29, sleep_hours: 4 } })
      .expect(200);

    expect(typeof res.body.score).toBe("number");
    expect(["low", "medium", "high"]).toContain(res.body.level);
  });
});
