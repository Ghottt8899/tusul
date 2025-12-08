import { z } from 'zod';

export const RegisterZ = z.object({
  email: z.string().email(),
  phone: z.string().min(3),
  full_name: z.string().optional().default(''),
  password: z.string().min(6),
});

export const LoginZ = z.object({
  email_or_phone: z.string(),
  password: z.string(),
  totp: z.string().optional(),
});

export const BookingCreateZ = z.object({
  service_id: z.string(),
  staff_id: z.string(),
  start: z.string(), // ISO
  notes: z.string().optional(),
});
