import { RegisterZ, LoginZ, BookingCreateZ } from "../src/utils/validate";
import { ZodError } from "zod";

describe("validate schemas (Zod)", () => {
  it("RegisterZ — valid data", () => {
    const data = {
      email: "user@example.com",
      phone: "99112233",
      password: "secret123",
    };
    const parsed = RegisterZ.parse(data);
    expect(parsed.email).toBe("user@example.com");
  });

  it("RegisterZ — invalid email", () => {
    expect(() =>
      RegisterZ.parse({
        email: "bademail",
        phone: "99112233",
        password: "secret123",
      })
    ).toThrow(ZodError);
  });

  it("LoginZ — requires both fields", () => {
    const parsed = LoginZ.parse({
      email_or_phone: "user@example.com",
      password: "pw123",
    });
    expect(parsed.password).toBe("pw123");
  });

  it("BookingCreateZ — missing required field", () => {
    expect(() =>
      BookingCreateZ.parse({
        staff_id: "s1",
        start: "2030-01-01T10:00:00Z",
      })
    ).toThrow(ZodError);
  });

  it("BookingCreateZ — valid booking", () => {
    const parsed = BookingCreateZ.parse({
      service_id: "svc1",
      staff_id: "stf1",
      start: "2030-01-01T10:00:00Z",
      notes: "Test",
    });
    expect(parsed.service_id).toBe("svc1");
  });
});
