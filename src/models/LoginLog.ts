import { Schema, model } from "mongoose";

const LoginLogSchema = new Schema({
  user_id: { type: String, index: true },
  when: { type: Date, default: () => new Date() },
  ip: String,
  ua: String,
});
export const LoginLog = model("LoginLog", LoginLogSchema);