import request from "supertest";
import { createApp } from "../src/app";
import { testDBSetup, testDBTeardown, testDBClear } from "./utils/test-db";

describe("Uploads /photo", () => {
  const app = createApp();

  beforeAll(testDBSetup);
  afterAll(testDBTeardown);
  afterEach(testDBClear);

  it("401 without token", async () => {
    await request(app).post("/uploads/photo").expect(401);
  });

  it("400 with token but no file", async () => {
    await request(app).post("/auth/register").send({
      email: "u1@example.com", phone: "99112233", password: "secret123",
    });
    const login = await request(app).post("/auth/login").send({
      email_or_phone: "u1@example.com", password: "secret123",
    });
    const token = login.body?.access_token;

    await request(app)
      .post("/uploads/photo")
      .set("Authorization", `Bearer ${token}`)
      .expect(400);
  });

  it("200 with token + file attached", async () => {
    await request(app).post("/auth/register").send({
      email: "u2@example.com", phone: "99112234", password: "secret123",
    });
    const login = await request(app).post("/auth/login").send({
      email_or_phone: "u2@example.com", password: "secret123",
    });
    const token = login.body?.access_token;

    const buf = Buffer.from("demo-image-content");
    const res = await request(app)
      .post("/uploads/photo")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", buf, "demo.txt")
      .expect(200);

    expect(res.body?.id).toBeTruthy();
    expect(res.body?.path).toBeTruthy();
  });
});
