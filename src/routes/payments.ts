import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import crypto from 'crypto';
import { config } from '../config';

export const payments = Router();

payments.post('/invoice', requireAuth, async (req, res) => {
  const { amount, booking_id } = req.body || {};
  // TODO: бодит QPay API дуудлага (axios/http client) — access token → invoice create
  res.json({ invoice_id: 'inv_demo', qr_text: 'qpay:demo', amount, booking_id });
});

payments.post('/webhook', (req, res) => {
  const bodyRaw = JSON.stringify(req.body || {});
  const sig = req.header('X-QPay-Signature') || '';
  const mac = crypto.createHmac('sha256', config.qpay.callbackSecret).update(bodyRaw).digest('hex');
  if (!crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(sig))) {
    return res.status(401).json({ ok: false, reason: 'bad signature' });
  }
  // TODO: body-д буй төлбөрийн статус → invoice update (idempotent)
  res.json({ ok: true });
});
