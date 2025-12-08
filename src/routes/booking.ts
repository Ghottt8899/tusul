import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { BookingCreateZ } from '../utils/validate';
import { Booking } from '../models/Booking';

export const bookings = Router();

bookings.post('/', requireAuth, async (req, res) => {
  const parsed = BookingCreateZ.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);
  const { service_id, staff_id, start, notes } = parsed.data;

  try {
    const doc = await Booking.create({
      user_id: (req as any).user.id,
      service_id, staff_id,
      start: new Date(start),
      status: 'pending',
      notes
    });
    res.json({
      id: doc._id, user_id: doc.user_id, service_id: doc.service_id,
      staff_id: doc.staff_id, start: doc.start, status: doc.status
    });
  } catch (e: any) {
    if (e.code === 11000) return res.status(409).json({ message: 'Timeslot already booked' });
    return res.status(500).json({ message: 'Create failed' });
  }
});

bookings.get('/:id', requireAuth, async (req, res) => {
  const doc = await Booking.findOne({ _id: req.params.id, user_id: (req as any).user.id });
  if (!doc) return res.status(404).json({ message: 'Not found' });
  res.json({
    id: doc._id, user_id: doc.user_id, service_id: doc.service_id,
    staff_id: doc.staff_id, start: doc.start, status: doc.status
  });
});
