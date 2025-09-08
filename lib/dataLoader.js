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
  // Prefer a single source file if present
  const preferred = entries.find(e => e.isFile() && e.name.toLowerCase() === 'combined_disease_data.csv');
  const scan = preferred ? [preferred] : entries;

  for (const entry of scan) {
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
  // Coalesce helper
  const pick = (...keys) => {
    for (const k of keys) {
      if (item[k] !== undefined && String(item[k]).trim() !== '') return String(item[k]).trim();
    }
    return '';
  };

  // Combined dataset friendly fields
  const condition = pick('Condition', 'condition', 'Disease', 'disease', 'disease_name') || 'Unknown';
  const symptoms = pick('Symptoms', 'Symptom', 'symptoms', 'symptom', 'symptoms_list');
  const prevention = pick('Prevention', 'precautions', 'Precautions', 'prevention');
  const treatment = pick('Treatment', 'treatment');
  const year = pick('Year', 'year');
  const region = pick('Region', 'region', 'State', 'state', 'Location', 'location');
  const cases = pick('Reported_Cases', 'Cases', 'cases');
  const deaths = pick('Deaths', 'deaths');
  const source = pick('Source', 'source', 'Reference', 'reference', 'url');

  // Prefer symptom/prevention/treatment style content when available
  if (symptoms || prevention || treatment) {
    const parts = [
      `Condition: ${condition}`,
      symptoms ? `Symptoms: ${symptoms}` : '',
      prevention ? `Prevention: ${prevention}` : '',
      treatment ? `Treatment: ${treatment}` : '',
      year ? `Year: ${year}` : '',
      region ? `Region: ${region}` : '',
      source ? `Source: ${source}` : '',
    ].filter(Boolean);
    return { id: idx, content: parts.join('. ') + '.', metadata: { condition, year, region, source } };
  }

  // Fallback to original disease incidence style
  const demographics = pick('Affected_Demographics', 'demographics');
  return {
    id: idx,
    content: `Condition: ${condition}. Year: ${year}. Reported Cases: ${cases}. Deaths: ${deaths || 'Not Available'}. Affected Demographics: ${demographics}. Source: ${source}.`,
    metadata: { condition, year, cases, deaths, demographics, source },
  };
}

