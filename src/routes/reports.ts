import { Router } from 'express';
import { requireAuth } from '../middleware/auth';

export const reports = Router();

reports.get('/bookings.csv', requireAuth, async (_req, res) => {
  const rows = [
    ['booking_id', 'status'],
    ['b1', 'confirmed'],
    ['b2', 'pending'],
  ];
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.send(rows.map(r => r.join(',')).join('\n'));
});
