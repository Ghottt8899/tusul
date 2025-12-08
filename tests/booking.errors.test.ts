import request from "supertest";
import { createApp } from "../src/app";
import { Booking } from "../src/models/Booking";
import { testDBSetup, testDBTeardown, testDBClear } from "./utils/test-db";

describe("Bookings error branches", () => {
  const app = createApp();

  beforeAll(testDBSetup);
  afterAll(testDBTeardown);
  afterEach(async () => {
    jest.restoreAllMocks();
    await testDBClear();
  });

  it("POST /bookings → 409 when duplicate (code 11000)", async () => {
    // login
    await request(app).post("/auth/register").send({
      email: "dup@example.com", phone: "99112233", password: "secret123",
    });
    const login = await request(app).post("/auth/login").send({
      email_or_phone: "dup@example.com", password: "secret123",
    });
    const token = login.body?.access_token;

    // mock duplicate key error
    jest.spyOn(Booking, "create").mockRejectedValueOnce({ code: 11000 } as any);

    await request(app)
      .post("/bookings/")
      .set("Authorization", `Bearer ${token}`)
      .send({ service_id: "s1", staff_id: "st1", start: "2030-01-01T10:00:00.000Z" })
      .expect(409);
  });

  it("POST /bookings → 500 on generic DB error", async () => {
    await request(app).post("/auth/register").send({
      email: "err@example.com", phone: "99112234", password: "secret123",
    });
    const login = await request(app).post("/auth/login").send({
      email_or_phone: "err@example.com", password: "secret123",
    });
    const token = login.body?.access_token;

    jest.spyOn(Booking, "create").mockRejectedValueOnce(new Error("db down"));

    await request(app)
      .post("/bookings/")
      .set("Authorization", `Bearer ${token}`)
      .send({ service_id: "s1", staff_id: "st1", start: "2030-01-01T10:00:00.000Z" })
      .expect(500);
  });
});
