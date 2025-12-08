import { Router } from 'express';
import { requireAuth } from '../middleware/auth';

export const surveys = Router();

function computeRisk(answers: Record<string, any>) {
  let score = 0;
  for (const v of Object.values(answers)) {
    if (typeof v === 'boolean' && v) score += 2;
    if (typeof v === 'number' && v > 0) score += 1;
  }
  const level = score >= 8 ? 'high' : score >= 4 ? 'medium' : 'low';
  return { score, level };
}

surveys.post('/submit', requireAuth, (req, res) => {
  const result = computeRisk(req.body?.answers || {});
  res.json(result);
});
