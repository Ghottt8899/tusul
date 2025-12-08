// src/utils/errors.ts
export class AppError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status = 500, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}
export class ValidationError extends AppError {
  constructor(message = "Invalid input") { super(message, 400, "VALIDATION"); }
}
export class AuthError extends AppError {
  constructor(message = "Unauthorized") { super(message, 401, "AUTH"); }
}
export class NotFoundError extends AppError {
  constructor(message = "Not found") { super(message, 404, "NOT_FOUND"); }
}
