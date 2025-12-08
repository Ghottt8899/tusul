/**
 * ЭХЛЭЭД security-гээ mock-доно (import-оос түрүүлж байх ёстой)
 */
jest.mock("../src/utils/security", () => {
  return {
    __esModule: true,
    hashPassword: jest.fn(async (_p: string) => "mocked_hash"),
    verifyPassword: jest.fn(async (_p: string, _h: string) => true),
    signToken: jest.fn((_sub: string, _role = "user") => "mocked.jwt.token"),
    verifyToken: jest.fn((_t: string) => ({ sub: "uid-1", role: "user" })),
  };
});

import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createApp } from "../src/app";
import * as security from "../src/utils/security";

let app: ReturnType<typeof createApp>;
let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
  app = createApp();
});

afterEach(async () => {
  // Тест бүрийн дараа цэвэрлэнэ
  const { collections } = mongoose.connection;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
  jest.clearAllMocks();
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

describe("Auth Controller — Mock & Spy Tests", () => {
  it("register — hashPassword дуудагдсан эсэх", async () => {
    const hashSpy = jest.spyOn(security, "hashPassword");

    const res = await request(app)
      .post("/auth/register")
      .send({
        email: "mock1@test.mn",
        phone: "99112233",
        password: "123456",
      });

    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(500);
    expect(hashSpy).toHaveBeenCalledTimes(1);
  });

  it("login — verifyPassword=true үед signToken дуудна", async () => {
    await request(app).post("/auth/register").send({
      email: "mock2@test.mn",
      phone: "99112234",
      password: "123456",
    });

    (security.verifyPassword as jest.Mock).mockResolvedValueOnce(true);
    const signSpy = jest.spyOn(security, "signToken");

    const res = await request(app).post("/auth/login").send({
      email_or_phone: "mock2@test.mn",
      password: "123456",
    });

    expect(res.status).toBe(200);
    expect(signSpy).toHaveBeenCalledTimes(1);
    expect(res.body).toBeDefined();
  });

  it("login — verifyPassword=false үед 401 бууна", async () => {
    await request(app).post("/auth/register").send({
      email: "mock3@test.mn",
      phone: "99112235",
      password: "123456",
    });

    (security.verifyPassword as jest.Mock).mockResolvedValueOnce(false);

    const res = await request(app).post("/auth/login").send({
      email_or_phone: "mock3@test.mn",
      password: "wrongpass",
    });

    expect(res.status).toBe(401);
  });
});
