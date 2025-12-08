import { signToken, verifyToken, parseBearer } from "../src/utils/security";

describe("security branches", () => {
  it("parseBearer: зөв ба буруу header", () => {
    expect(parseBearer("Bearer abc.xyz")).toBe("abc.xyz");      // зөв зам
    expect(parseBearer("bearer abc")).toBe(null);               // case-sensitive → буруу зам
    expect(parseBearer("Something xyz")).toBe(null);            // буруу зам
    expect(parseBearer(undefined as any)).toBe(null);           // буруу зам
  });

  it("signToken: role default-ийг шалгах + verifyToken guard", () => {
    // role дамжуулахгүй үед 'user' default салах ёстой
    const tok = signToken("u2");
    const decoded = verifyToken(tok);
    expect(decoded?.role).toBe("user");

    // guard-салбар: token байхгүй үед null буцаах ёстой
    expect(verifyToken(undefined as any)).toBe(null);
  });

  it("verifyToken: зөв токен OK, эвдэрсэн токен FAIL", () => {
    const tok = signToken("u1", "user");
    const ok = verifyToken(tok);
    expect(ok?.sub).toBe("u1");

    // эвдэлсэн токен → verify салбар
    const bad = tok.slice(0, -2) + "xx";
    const fail = verifyToken(bad);
    // implementation-аасаа хамаараад null/undefined буцаадаг — аль алиныг нь зөвшөөрөе
    expect(fail == null).toBe(true);
  });
});
