import request from "supertest";
import mongoose from "mongoose";
import { createApp } from "../src/app";
import { testDBSetup, testDBTeardown, testDBClear } from "./utils/test-db";

describe("Bookings GET /:id", () => {
  const app = createApp();

  beforeAll(testDBSetup);
  afterAll(testDBTeardown);
  afterEach(testDBClear);

  it("404 when not found / not owned", async () => {
    await request(app).post("/auth/register").send({
      email: "g1@example.com", phone: "99112233", password: "secret123",
    });
    const login = await request(app).post("/auth/login").send({
      email_or_phone: "g1@example.com", password: "secret123",
    });
    const token = login.body?.access_token;

    const fakeId = new mongoose.Types.ObjectId().toString();
    await request(app)
      .get(`/bookings/${fakeId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(404);
  });

  it("200 when booking exists and owned by user", async () => {
    // u
    await request(app).post("/auth/register").send({
      email: "g2@example.com", phone: "99112234", password: "secret123",
    });
    const login = await request(app).post("/auth/login").send({
      email_or_phone: "g2@example.com", password: "secret123",
    });
    const token = login.body?.access_token;

    // create booking
    const created = await request(app)
      .post("/bookings/")
      .set("Authorization", `Bearer ${token}`)
      .send({
        service_id: "svc1",
        staff_id: "stf1",
        start: "2030-01-01T10:00:00.000Z",
      })
      .expect(200);

    const id = created.body?.id;
    const got = await request(app)
      .get(`/bookings/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(got.body?.id).toBe(id);
    expect(got.body?.status).toBe("pending");
  });
});
