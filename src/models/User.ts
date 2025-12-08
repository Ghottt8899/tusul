import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  email: { type: String, index: true, unique: true },
  phone: { type: String, index: true, unique: true },
  full_name: String,
  password: String,
  role: { type: String, default: 'user' },     // user/admin
  twofa_secret: { type: String, default: null },
  twofa_enabled: { type: Boolean, default: false },
}, { timestamps: true });

export const User = model('User', userSchema);
