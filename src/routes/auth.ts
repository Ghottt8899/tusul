import { Router } from 'express';
import { RegisterZ, LoginZ } from '../utils/validate';
import { User } from '../models/User';
import { hashPassword, verifyPassword, signToken } from '../utils/security';
import * as otplib from 'otplib';
import mongoose from 'mongoose';

export const auth = Router();

auth.post('/register', async (req, res) => {
  const parsed = RegisterZ.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);
  const { email, phone, full_name, password } = parsed.data;

  const exists = await User.findOne({ $or: [{ email }, { phone }] });
  if (exists) return res.status(409).json({ message: 'User exists' });

  const doc = await User.create({
    email, phone, full_name,
    password: await hashPassword(password),
  });
  res.json({
    id: doc._id, email: doc.email, phone: doc.phone,
    full_name: doc.full_name, role: doc.role, twofa_enabled: doc.twofa_enabled
  });
});

auth.post('/login', async (req, res) => {
  const parsed = LoginZ.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);
  const { email_or_phone, password, totp } = parsed.data;

  const user = await User.findOne({
    $or: [{ email: email_or_phone }, { phone: email_or_phone }]
  });
  if (!user || !(await verifyPassword(password, user.password!)))
    return res.status(401).json({ message: 'Invalid credentials' });

  if (user.twofa_enabled) {
    if (!totp || !otplib.authenticator.verify({ token: totp, secret: user.twofa_secret! })) {
      return res.status(401).json({ message: 'Invalid 2FA code' });
    }
  }
  const token = signToken((user._id as mongoose.Types.ObjectId).toString(), user.role);
  res.json({ access_token: token, token_type: 'bearer' });
});

auth.post('/2fa/setup', async (req, res) => {
  const { user_id } = req.body;
  const secret = otplib.authenticator.generateSecret();
  await User.updateOne({ _id: user_id }, { $set: { twofa_secret: secret } });
  const uri = otplib.authenticator.keyuri(`user-${user_id}`, 'SalonApp', secret);
  res.json({ secret, otpauth_url: uri });
});

auth.post('/2fa/enable', async (req, res) => {
  const { user_id, code } = req.body;
  const user = await User.findById(user_id);
  if (!user?.twofa_secret) return res.status(400).json({ message: 'Setup first' });
  const ok = otplib.authenticator.verify({ token: code, secret: user.twofa_secret });
  if (!ok) return res.status(400).json({ message: 'Wrong code' });
  user.twofa_enabled = true;
  await user.save();
  res.json({ enabled: true });
});
