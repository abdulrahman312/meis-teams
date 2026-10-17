import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchStaffRecords } from './_staffService.ts';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const records = await fetchStaffRecords();
    res.json({
      status: 'online',
      recordCount: records.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(500).json({ status: 'error', error: err.message });
  }
}
