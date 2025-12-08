import request from "supertest";
import { createApp } from "../src/app"; // src/app.ts байх ёстой!
import { testDBSetup, testDBTeardown, testDBClear } from "./utils/test-db";

describe("Auth & Bookings E2E", () => {
  const app = createApp();
  let token = "";

  beforeAll(async () => {
    await testDBSetup();
  });

  afterAll(async () => {
    await testDBTeardown();
  });

  afterEach(async () => {
    await testDBClear();
  });

  it("register → login → create booking", async () => {
    // register
    const reg = await request(app)
      .post("/auth/register")
      .send({
        email: "u@example.com",
        phone: "99999999",
        full_name: "Test User",
        password: "secret123",
      })
      .expect(200);
    expect(reg.body.email).toBe("u@example.com");

    // login
    const login = await request(app)
      .post("/auth/login")
      .send({ email_or_phone: "u@example.com", password: "secret123" })
      .expect(200);
    token = login.body.access_token;
    expect(typeof token).toBe("string");

    // create booking (protected)
    const booking = await request(app)
      .post("/bookings/")
      .set("Authorization", `Bearer ${token}`)
      .send({
        service_id: "svc-1",
        staff_id: "staff-1",
        start: "2030-01-01T10:00:00.000Z",
        notes: "first",
      })
      .expect(200);

    expect(booking.body.status).toBe("pending");
    expect(booking.body.service_id).toBe("svc-1");
  });

  it("rejects protected route without token", async () => {
    await request(app)
      .post("/bookings/")
      .send({
        service_id: "svc-1",
        staff_id: "staff-1",
        start: "2030-01-01T10:00:00.000Z",
      })
      .expect(401);
  });
});
