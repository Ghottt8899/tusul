import { Router, Request, Response, NextFunction } from "express";
import { RegisterZ, LoginZ } from "../utils/validate";
import { User } from "../models/User";
import { hashPassword, verifyPassword, signToken } from "../utils/security";
import * as otplib from "otplib";
import mongoose from "mongoose";
import { ValidationError, AuthError } from "../utils/errors"; // ← centralized errors
import { logger } from "../utils/logger";

export const auth = Router();

/**
 * POST /auth/register
 * Шинэ хэрэглэгч бүртгэх
 */
auth.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = RegisterZ.safeParse(req.body);
      if (!parsed.success) throw new ValidationError();

      const { email, phone, full_name, password } = parsed.data;

      const exists = await User.findOne({ $or: [{ email }, { phone }] });
      if (exists) throw new ValidationError("User exists");

      const doc = await User.create({
        email,
        phone,
        full_name,
        password: await hashPassword(password),
      });

      return res.json({
        id: doc._id,
        email: doc.email,
        phone: doc.phone,
        full_name: doc.full_name,
        role: doc.role,
        twofa_enabled: doc.twofa_enabled,
      });
    } catch (e) {
      next(e);
    }
  }
);

/**
 * POST /auth/login
 * Имэйл/утас + нууц үгээр нэвтрэх (+ 2FA баталгаажуулалт)
 */
auth.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = LoginZ.safeParse(req.body);
      if (!parsed.success) throw new ValidationError();

      const { email_or_phone, password, totp } = parsed.data;

      const user = await User.findOne({
        $or: [{ email: email_or_phone }, { phone: email_or_phone }],
      });

      const ok =
        user && user.password ? await verifyPassword(password, user.password) : false;
      if (!ok) throw new AuthError("Invalid credentials");

      if (user!.twofa_enabled) {
        const verified =
          !!totp &&
          !!user!.twofa_secret &&
          otplib.authenticator.verify({
            token: totp,
            secret: user!.twofa_secret,
          });
        if (!verified) throw new AuthError("Invalid 2FA code");
      }

      const token = signToken(
        (user!._id as mongoose.Types.ObjectId).toString(),
        user!.role
      );

      return res.json({ access_token: token, token_type: "bearer" });
    } catch (e) {
      next(e);
    }
  }
);

/**
 * POST /auth/2fa/setup
 * 2FA нууц үг үүсгээд буцаана (otpauth URL-тай)
 */
auth.post(
  "/2fa/setup",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id } = req.body || {};
      if (!user_id) throw new ValidationError("user_id required");

      const secret = otplib.authenticator.generateSecret();
      await User.updateOne({ _id: user_id }, { $set: { twofa_secret: secret } });

      const uri = otplib.authenticator.keyuri(
        `user-${user_id}`,
        "SalonApp",
        secret
      );

      return res.json({ secret, otpauth_url: uri });
    } catch (e) {
      next(e);
    }
  }
);

/**
 * POST /auth/2fa/enable
 * Хэрэглэгчийн 2FA-г идэвхжүүлэх (зөв код ирсэн тохиолдолд)
 */
auth.post(
  "/2fa/enable",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id, code } = req.body || {};
      if (!user_id || !code) throw new ValidationError("user_id, code required");

      const user = await User.findById(user_id);
      if (!user?.twofa_secret) throw new ValidationError("Setup first");

      const ok = otplib.authenticator.verify({
        token: code,
        secret: user.twofa_secret,
      });
      if (!ok) throw new ValidationError("Wrong code");

      user.twofa_enabled = true;
      await user.save();

      return res.json({ enabled: true });
    } catch (e) {
      logger.debug("2FA enable error", e);
      next(e);
    }
  }
);