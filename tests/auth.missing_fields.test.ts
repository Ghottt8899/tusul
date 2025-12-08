// tests/auth.missing_fields.test.ts
import request from "supertest";
import { createApp } from "../src/app";
import { testDBSetup, testDBTeardown, testDBClear } from "./utils/test-db";

describe("Auth route validations", () => {
  const app = createApp();

  beforeAll(testDBSetup);
  afterAll(testDBTeardown);
  afterEach(testDBClear);

  it("register missing email → 400", async () => {
    await request(app)
      .post("/auth/register")
      .send({ phone: "99112233", password: "secret123" })
      .expect(400);
  });

  it("login missing password → 400", async () => {
    await request(app)
      .post("/auth/login")
      .send({ email_or_phone: "u@example.com" })
      .expect(400);
  });
});
