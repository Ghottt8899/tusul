// Tests covering config.ts branches (env defaults vs overrides)

const baseEnv = { ...process.env };

function loadConfig(env: Record<string, string | undefined>) {
  jest.resetModules();
  process.env = { ...baseEnv, ...env };
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require("../src/config").config as typeof import("../src/config").config;
}

afterEach(() => {
  process.env = { ...baseEnv };
  jest.resetModules();
});

describe("config env branches", () => {
  it("uses defaults when env vars are missing", () => {
    const cfg = loadConfig({
      PORT: undefined,
      MONGO_URI: undefined,
      JWT_SECRET: undefined,
      JWT_EXPIRES_MIN: undefined,
      CORS_ORIGINS: undefined,
      QPAY_USERNAME: undefined,
      QPAY_PASSWORD: undefined,
      QPAY_CALLBACK_SECRET: undefined,
    });

    expect(cfg.port).toBe(8000);
    expect(cfg.mongoUri).toBe("mongodb://localhost:27017/salon");
    expect(cfg.jwtSecret).toBe("dev_secret_change_me");
    expect(cfg.jwtExpiresMin).toBe(60 * 24 * 7);
    expect(cfg.corsOrigins).toEqual(["http://localhost:3000"]);
    expect(cfg.qpay).toEqual({ username: "", password: "", callbackSecret: "" });
  });

  it("reads env overrides and trims cors origins", () => {
    const cfg = loadConfig({
      PORT: "1234",
      MONGO_URI: "mongodb://custom:27017/db",
      JWT_SECRET: "override_secret",
      JWT_EXPIRES_MIN: "5",
      CORS_ORIGINS: "http://a.com, http://b.com ",
      QPAY_USERNAME: "u",
      QPAY_PASSWORD: "p",
      QPAY_CALLBACK_SECRET: "cb",
    });

    expect(cfg.port).toBe(1234);
    expect(cfg.mongoUri).toBe("mongodb://custom:27017/db");
    expect(cfg.jwtSecret).toBe("override_secret");
    expect(cfg.jwtExpiresMin).toBe(5);
    expect(cfg.corsOrigins).toEqual(["http://a.com", "http://b.com"]);
    expect(cfg.qpay).toEqual({ username: "u", password: "p", callbackSecret: "cb" });
  });
});
