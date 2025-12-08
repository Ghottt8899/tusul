import request from "supertest";
import { createApp } from "../src/app";
import { testDBSetup, testDBTeardown, testDBClear } from "./utils/test-db";

describe("Auth login via phone", () => {
  const app = createApp();

  beforeAll(testDBSetup);
  afterAll(testDBTeardown);
  afterEach(testDBClear);

  it("logs in with phone number", async () => {
    await request(app).post("/auth/register").send({
      email: "phone@example.com", phone: "99112233", password: "secret123",
    });
    const res = await request(app).post("/auth/login").send({
      email_or_phone: "99112233",
      password: "secret123",
    }).expect(200);
    expect(res.body?.access_token).toBeTruthy();
  });
});
