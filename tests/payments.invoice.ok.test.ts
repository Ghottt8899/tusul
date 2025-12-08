import request from "supertest";
import { createApp } from "../src/app";
import { testDBSetup, testDBTeardown, testDBClear } from "./utils/test-db";

describe("Payments /invoice OK path", () => {
  const app = createApp();

  beforeAll(testDBSetup);
  afterAll(testDBTeardown);
  afterEach(testDBClear);

  it("returns 200 with token and payload", async () => {
    await request(app).post("/auth/register").send({
      email: "p2@example.com", phone: "99112239", password: "secret123",
    });
    const login = await request(app).post("/auth/login").send({
      email_or_phone: "p2@example.com", password: "secret123",
    });
    const token = login.body?.access_token;

    const res = await request(app)
      .post("/payments/invoice")
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 10000, booking_id: "b123" })
      .expect(200);

    expect(res.body?.invoice_id).toBe("inv_demo");
    expect(res.body?.qr_text).toBeTruthy();
  });
});
