import request from "supertest";
import { createApp } from "../src/app";
import { testDBSetup, testDBTeardown, testDBClear } from "./utils/test-db";
import * as otplib from "otplib";

describe("Auth 2FA flow", () => {
  const app = createApp();

  beforeAll(testDBSetup);
  afterAll(testDBTeardown);
  afterEach(testDBClear);

  it("setup → enable → login requiring TOTP (success & failure)", async () => {
    // 1) user register
    const reg = await request(app).post("/auth/register").send({
      email: "2fa@example.com",
      phone: "99112233",
      password: "secret123",
    }).expect(200);

    const userId = reg.body.id;

    // 2) setup 2FA (secret авна)
    const setup = await request(app).post("/auth/2fa/setup").send({ user_id: userId }).expect(200);
    const secret = setup.body.secret as string;

    // 3) enable 2FA with wrong code → 400
    await request(app).post("/auth/2fa/enable").send({
      user_id: userId,
      code: "000000",
    }).expect(400);

    // 4) enable 2FA with correct code → 200
    const goodCode = otplib.authenticator.generate(secret);
    await request(app).post("/auth/2fa/enable").send({
      user_id: userId,
      code: goodCode,
    }).expect(200);

    // 5) login without TOTP → 401 (requires TOTP)
    await request(app).post("/auth/login").send({
      email_or_phone: "2fa@example.com",
      password: "secret123",
    }).expect(401);

    // 6) login with wrong TOTP → 401
    await request(app).post("/auth/login").send({
      email_or_phone: "2fa@example.com",
      password: "secret123",
      totp: "111111",
    }).expect(401);

    // 7) login with correct TOTP → 200, has token
    const totp = otplib.authenticator.generate(secret);
    const okLogin = await request(app).post("/auth/login").send({
      email_or_phone: "2fa@example.com",
      password: "secret123",
      totp,
    }).expect(200);

    expect(okLogin.body?.access_token).toBeTruthy();
  });
});
