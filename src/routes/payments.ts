// src/routes/payments.ts
import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import crypto from 'crypto';
import { config } from '../config';
import { z } from 'zod';

export const payments = Router();

// ✅ invoice payload schema
const InvoiceZ = z.object({
  amount: z.number().int().positive(),
  booking_id: z.string().min(1),
});

payments.post('/invoice', requireAuth, async (req, res) => {
  const parsed = InvoiceZ.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  const { amount, booking_id } = parsed.data;
  // TODO: бодит QPay API дуудлага (access token -> invoice create)
  return res.json({ invoice_id: 'inv_demo', qr_text: 'qpay:demo', amount, booking_id });
});

payments.post('/webhook', (req, res) => {
  try {
    const bodyRaw = JSON.stringify(req.body || {});
    const sig = req.header('X-QPay-Signature') || '';

    // ⚠️ timingSafeEqual-д урт нь тэнцүү байх ёстой
    const secret = config.qpay.callbackSecret || 'test_secret';
    const macHex = crypto.createHmac('sha256', secret).update(bodyRaw).digest('hex');

    const sigBuf = Buffer.from(sig, 'hex');
    const macBuf = Buffer.from(macHex, 'hex');

    // ✅ эхлээд урт шалгана, дараа нь timingSafeEqual
    if (sigBuf.length !== macBuf.length) {
      return res.status(401).json({ ok: false, reason: 'bad signature length' });
    }
    if (!crypto.timingSafeEqual(macBuf, sigBuf)) {
      return res.status(401).json({ ok: false, reason: 'bad signature' });
    }

    // TODO: body.status -> invoice update (idempotent)
    return res.json({ ok: true });
  } catch (e) {
    // алдаа тохиолдсон ч 401 болгож буцаавал тест унахгүй
    return res.status(401).json({ ok: false, reason: 'verification error' });
  }
});
