import { signToken, verifyJwt } from "../src/utils/security";

describe("security.verifyJwt branches", () => {
  it("valid token → payload returned", () => {
    const t = signToken("u1", "user");    // default expiry OK
    const p = verifyJwt(t);
    expect(p?.sub).toBe("u1");
    expect(p?.role).toBe("user");
  });

  it("invalid token → null", () => {
    const p = verifyJwt("bad.token.value");
    expect(p).toBeNull();
  });
});
