import { parse } from 'csv-parse/sync';

export interface StaffRecord {
  timestamp: string;
  arabicName: string;
  englishName: string;
  nationalId: string;
  employeeNumber: string;
  branch: string;
  microsoftAccount: string;
  password: string;
}

const SHEET_ID = '1Mk8rqD4D3i_lrnsfj7Gzc3XXTtJ8TJJlvbb6hW4zSxg';
const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

let cachedStaff: StaffRecord[] = [];
let lastFetchTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

export function normalizeInput(input: string): string {
  if (!input) return '';
  return input
    .trim()
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
    .replace(/[#\s]/g, '');
}

export async function fetchStaffRecords(force = false): Promise<StaffRecord[]> {
  const now = Date.now();
  if (!force && cachedStaff.length > 0 && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedStaff;
  }

  try {
    const response = await fetch(SHEET_CSV_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch spreadsheet: ${response.status} ${response.statusText}`);
    }

    const csvText = await response.text();
    const rows = parse(csvText, {
      skip_empty_lines: true,
      relax_column_count: true,
    }) as string[][];

    if (rows.length < 2) {
      return cachedStaff;
    }

    const records: StaffRecord[] = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length < 5) continue;

      const timestamp = (row[0] || '').trim();
      const arabicName = (row[1] || '').trim();
      const englishName = (row[2] || '').trim();
      const nationalId = (row[3] || '').trim();
      const employeeNumber = (row[4] || '').trim();
      const branch = (row[5] || '').trim();
      const microsoftAccount = (row[6] || '').trim();
      const password = (row[7] || '').trim();

      if (employeeNumber || englishName || arabicName) {
        records.push({
          timestamp,
          arabicName,
          englishName,
          nationalId,
          employeeNumber,
          branch,
          microsoftAccount,
          password,
        });
      }
    }

    cachedStaff = records;
    lastFetchTime = now;
    return cachedStaff;
  } catch (error) {
    console.error('[StaffCache] Error fetching sheet records:', error);
    if (cachedStaff.length > 0) {
      return cachedStaff;
    }
    throw error;
  }
}
