// lib/dataLoader.js
import fs from 'fs';
import path from 'path';

// Minimal CSV parser (header=true, commas, quoted values, no native deps)
function parseCSV(text) {
  const rows = [];
  let i = 0, field = '', row = [], inQuotes = false;
  const pushField = () => { row.push(field); field = ''; };
  const pushRow = () => { if (row.length) rows.push(row); row = []; };
  while (i < text.length) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else { inQuotes = false; }
      } else { field += char; }
    } else {
      if (char === '"') inQuotes = true;
      else if (char === ',') pushField();
      else if (char === '\n') { pushField(); pushRow(); }
      else if (char === '\r') { /* skip */ }
      else field += char;
    }
    i++;
  }
  if (field.length || row.length) { pushField(); pushRow(); }
  if (rows.length === 0) return [];
  const headers = rows[0];
  return rows.slice(1).map(r => {
    const obj = {};
    headers.forEach((h, idx) => { obj[h?.trim?.() || `col${idx}`] = (r[idx] ?? '').trim(); });
    return obj;
  });
}

export async function loadHealthRecords() {
  const dataDir = path.join(process.cwd(), 'lib', 'data');
  const records = [];

  if (!fs.existsSync(dataDir)) return records;

  const entries = fs.readdirSync(dataDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const filePath = path.join(dataDir, entry.name);
    if (entry.name.endsWith('.json')) {
      try {
        const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (Array.isArray(json)) {
          for (const item of json) {
            if (item && typeof item === 'object') records.push(item);
          }
        }
      } catch {}
    } else if (entry.name.endsWith('.csv')) {
      try {
        const csv = fs.readFileSync(filePath, 'utf8');
        const rows = parseCSV(csv);
        for (const row of rows) {
          if (row && Object.keys(row).length > 0) records.push(row);
        }
      } catch {}
    }
  }
  return records;
}

export function recordToDocument(item, idx) {
  const condition = item.Condition || item.condition || item.disease || 'Unknown';
  const year = item.Year ?? item.year ?? '';
  const cases = item.Reported_Cases ?? item.cases ?? item.Cases ?? '';
  const deaths = item.Deaths ?? item.deaths ?? '';
  const demographics = item.Affected_Demographics ?? item.demographics ?? '';
  const source = item.Source ?? item.source ?? '';

  return {
    id: idx,
    content: `Condition: ${condition}. Year: ${year}. Reported Cases: ${cases}. Deaths: ${deaths || 'Not Available'}. Affected Demographics: ${demographics}. Source: ${source}.`,
    metadata: { condition, year, cases, deaths, demographics, source },
  };
}

