import request from "supertest";
import { createApp } from "../src/app";
import { testDBSetup, testDBTeardown, testDBClear } from "./utils/test-db";

describe("Payments stub E2E", () => {
  const app = createApp();
  let token = "";

  beforeAll(async () => {
    await testDBSetup();

    await request(app).post("/auth/register").send({
      email: "user3@example.com",
      phone: "77777777",
      full_name: "User Three",
      password: "secret123",
    });

    const login = await request(app).post("/auth/login").send({
      email_or_phone: "user3@example.com",
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

  it("creates demo invoice", async () => {
    const res = await request(app)
      .post("/payments/invoice")
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 50000, booking_id: "b-1" })
      .expect(200);

    expect(res.body.invoice_id).toBe("inv_demo");
    expect(res.body.amount).toBe(50000);
  });
});
