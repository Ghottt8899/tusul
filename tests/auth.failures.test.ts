import request from "supertest";
import { createApp } from "../src/app";
import { testDBSetup, testDBTeardown, testDBClear } from "./utils/test-db";

describe("Auth failures", () => {
  const app = createApp();

  beforeAll(testDBSetup);
  afterAll(testDBTeardown);
  afterEach(testDBClear);

  it("login with wrong password → 401", async () => {
    await request(app).post("/auth/register").send({
      email: "u1@example.com", phone: "99112233", password: "secret123",
    });
    await request(app).post("/auth/login").send({
      email_or_phone: "u1@example.com", password: "WRONG",
    }).expect(401);
  });

  it("duplicate register → 409 (эсвэл 400)", async () => {
    const payload = { email: "dupe@example.com", phone: "99112233", password: "secret123" };
    await request(app).post("/auth/register").send(payload).expect(200);
    const res = await request(app).post("/auth/register").send(payload);
    expect([400, 409]).toContain(res.status); // аль нэгийг зөвшөөрнө
  });
});
