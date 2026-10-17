import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { fetchStaffRecords, normalizeInput } from './api/_staffService.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));

// Pre-warm cache on start
fetchStaffRecords().catch((err) => console.warn('Initial staff fetch warning:', err.message));

// API: Search employee
app.get('/api/lookup', async (req: Request, res: Response) => {
  const query = req.query.employeeNumber as string;
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
    console.error('Lookup error:', err);
    return res.status(500).json({
      error: 'Unable to connect to the staff directory at this moment. Please try again shortly.',
      details: err.message,
    });
  }
});

// API: Cache Status
app.get('/api/status', async (_req: Request, res: Response) => {
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
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} (mode: ${isProd ? 'production' : 'development'})`);
  });
}

startServer();
