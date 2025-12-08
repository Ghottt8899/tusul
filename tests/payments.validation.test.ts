import request from "supertest";
import { createApp } from "../src/app";
import { testDBSetup, testDBTeardown, testDBClear } from "./utils/test-db";

describe("Payments validation", () => {
  const app = createApp();

  beforeAll(testDBSetup);
  afterAll(testDBTeardown);
  afterEach(testDBClear);

  it("invoice invalid payload → 400/422", async () => {
    // 1) user бий болгоод логин хийнэ
    await request(app).post("/auth/register").send({
      email: "pay1@example.com",
      phone: "99112233",
      password: "secret123",
    });
    const login = await request(app).post("/auth/login").send({
      email_or_phone: "pay1@example.com",
      password: "secret123",
    });
    const token = login.body?.access_token;

    // 2) токентой, ноцтой дутуу payload илгээнэ → auth OK, validation FAIL
    await request(app)
      .post("/payments/invoice")
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: null, channel: "" })
      .expect(res => expect([400, 422]).toContain(res.status));
  });
});
