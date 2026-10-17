import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchStaffRecords, normalizeInput } from './_staffService.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const query = (req.query.employeeNumber as string) || '';
  const force = req.query.force === 'true';

  if (!query || !query.trim()) {
    return res.status(400).json({
      error: 'Please enter an Employee Number.',
    });
  }

  const normalizedQuery = normalizeInput(query);

  try {
    const records = await fetchStaffRecords(force);

    // Primary search: Column E (employee number)
    let matched = records.find((rec) => {
      const recEmp = normalizeInput(rec.employeeNumber);
      if (!recEmp) return false;
      if (recEmp.toLowerCase() === normalizedQuery.toLowerCase()) return true;
      const numQuery = parseInt(normalizedQuery, 10);
      const numRec = parseInt(recEmp, 10);
      return !isNaN(numQuery) && !isNaN(numRec) && numQuery === numRec;
    });

    let matchedBy: 'employee_number' | 'national_id' = 'employee_number';

    // Fallback: Check National ID
    if (!matched) {
      matched = records.find((rec) => {
        const recId = normalizeInput(rec.nationalId);
        if (!recId) return false;
        return recId === normalizedQuery;
      });
      if (matched) {
        matchedBy = 'national_id';
      }
    }

    if (!matched) {
      return res.status(404).json({
        found: false,
        message: `No teacher record found for Employee Number "${query}". Please check your number or contact MEIS IT Administration.`,
      });
    }

    return res.json({
      found: true,
      matchedBy,
      data: {
        englishName: matched.englishName,
        arabicName: matched.arabicName,
        employeeNumber: matched.employeeNumber,
        branch: matched.branch || 'Middle East International School',
        microsoftAccount: matched.microsoftAccount,
        password: matched.password,
        maskedNationalId: matched.nationalId
          ? matched.nationalId.length > 4
            ? matched.nationalId.slice(0, 3) + '****' + matched.nationalId.slice(-3)
            : matched.nationalId
          : '',
        lastUpdated: matched.timestamp,
      },
    });
  } catch (err: any) {
    console.error('Vercel serverless lookup error:', err);
    return res.status(500).json({
      error: 'Unable to connect to the staff directory at this moment. Please try again shortly.',
      details: err.message,
    });
  }
}
