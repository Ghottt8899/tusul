import request from "supertest";
import crypto from "crypto";

// 👉 config.qpay.callbackSecret-ийг тестэд тогтмол болгож mock-лоё
jest.mock("../src/config", () => ({
  config: {
    qpay: { callbackSecret: "test_secret" },
  },
}));

import { createApp } from "../src/app";
import { testDBSetup, testDBTeardown, testDBClear } from "./utils/test-db";

describe("Payments webhook HMAC", () => {
  const app = createApp();

  beforeAll(testDBSetup);
  afterAll(testDBTeardown);
  afterEach(testDBClear);

  it("bad signature → 401", async () => {
    await request(app)
      .post("/payments/webhook")
      .send({ invoice_id: "inv1", status: "PAID" })
      .set("X-QPay-Signature", "deadbeef")
      .expect(401);
  });

  it("good signature → 200", async () => {
    const body = { invoice_id: "inv2", status: "PAID" };
    const bodyRaw = JSON.stringify(body);
    const sig = crypto.createHmac("sha256", "test_secret").update(bodyRaw).digest("hex");

    await request(app)
      .post("/payments/webhook")
      .set("X-QPay-Signature", sig)
      .send(body)
      .expect(200);
  });
});
