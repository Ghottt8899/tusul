import request from "supertest";
import { createApp } from "../src/app";
import { testDBSetup, testDBTeardown, testDBClear } from "./utils/test-db";

describe("Bookings validation", () => {
  const app = createApp();

  beforeAll(testDBSetup);
  afterAll(testDBTeardown);
  afterEach(testDBClear);

  it("missing required fields → 400", async () => {
    // login авч токенгүйгээр POST хийвэл аль хэдийн 401 болно — тиймээс эхлээд бүртгэж нэвтэрч токентой хийнэ
    await request(app).post("/auth/register").send({
      email: "b1@example.com", phone: "99112233", password: "secret123",
    });
    const login = await request(app).post("/auth/login").send({
      email_or_phone: "b1@example.com", password: "secret123",
    });
    const token = login.body?.access_token;

    await request(app)
      .post("/bookings/")
      .set("Authorization", `Bearer ${token}`)
      .send({
        // service_id дутуу, staff_id дутуу → 400 хүлээнэ
        start: "2030-01-01T10:00:00.000Z",
      })
      .expect(400);
  });
});
