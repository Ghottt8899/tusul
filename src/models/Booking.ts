import { Schema, model } from 'mongoose';

const bookingSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  service_id: String,
  staff_id: String,
  start: Date,
  status: { type: String, default: 'pending' }, // pending/confirmed/cancelled
  notes: String
}, { timestamps: true });

bookingSchema.index({ staff_id: 1, start: 1 }, { unique: true }); // давхардсан цагээс сэргийлнэ
export const Booking = model('Booking', bookingSchema);
