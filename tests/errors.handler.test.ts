import request from "supertest";
import { createApp } from "../src/app";

const app = createApp();

describe("Error handler", () => {
  it("register invalid → 400", async () => {
    const r = await request(app).post("/auth/register").send({}); // зөрүүтэй payload
    expect(r.status).toBe(400);
    expect(r.body.message).toBeTruthy();
  });
  it("login wrong creds → 401", async () => {
    const r = await request(app).post("/auth/login").send({ email_or_phone:"x", password:"y" });
    expect(r.status).toBe(401);
  });
});