// Cover default vs custom branches in custom error classes
import { AppError, AuthError, NotFoundError, ValidationError } from "../src/utils/errors";

describe("errors branches", () => {
  it("AppError defaults to 500 status and undefined code", () => {
    const err = new AppError("boom");
    expect(err.message).toBe("boom");
    expect(err.status).toBe(500);
    expect(err.code).toBeUndefined();
  });

  it("AppError accepts custom status and code", () => {
    const err = new AppError("teapot", 418, "TEAPOT");
    expect(err.status).toBe(418);
    expect(err.code).toBe("TEAPOT");
  });

  it("ValidationError default message/code", () => {
    const err = new ValidationError();
    expect(err.message).toBe("Invalid input");
    expect(err.status).toBe(400);
    expect(err.code).toBe("VALIDATION");
  });

  it("ValidationError custom message still sets code/status", () => {
    const err = new ValidationError("Bad request");
    expect(err.message).toBe("Bad request");
    expect(err.status).toBe(400);
    expect(err.code).toBe("VALIDATION");
  });

  it("AuthError default and custom message", () => {
    expect(new AuthError().message).toBe("Unauthorized");
    const custom = new AuthError("Nope");
    expect(custom.message).toBe("Nope");
    expect(custom.code).toBe("AUTH");
    expect(custom.status).toBe(401);
  });

  it("NotFoundError default and custom message", () => {
    expect(new NotFoundError().message).toBe("Not found");
    const custom = new NotFoundError("Missing");
    expect(custom.message).toBe("Missing");
    expect(custom.code).toBe("NOT_FOUND");
    expect(custom.status).toBe(404);
  });
});
