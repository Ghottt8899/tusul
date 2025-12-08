import request from "supertest";
import { createApp } from "../src/app";
import { testDBSetup, testDBTeardown, testDBClear } from "./utils/test-db";

describe("Uploads route", () => {
  const app = createApp();

  beforeAll(testDBSetup);
  afterAll(testDBTeardown);
  afterEach(testDBClear);

  it("no file provided → 400/415/404", async () => {
    await request(app)
      .post("/uploads")
      .expect(res => expect([400, 404, 415]).toContain(res.status));
  });
});
