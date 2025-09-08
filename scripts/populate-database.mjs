// scripts/populate-database.mjs
import { createClient } from '@supabase/supabase-js';
import { pipeline } from '@xenova/transformers';
import fs from 'fs';
import path from 'path';

// IMPORTANT: Make sure you have your service_role key in a .env.local file
// SUPABASE_SERVICE_KEY=your_supabase_service_role_key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Read the local JSON data file
const dataPath = path.join(process.cwd(), 'lib/data/health_data.json');
const fileContent = fs.readFileSync(dataPath, 'utf8');
const healthData = JSON.parse(fileContent);

async function populateDatabase() {
  console.log('Loading embedding model...');
  const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

  console.log('Processing and embedding documents...');
  const documents = healthData.map(item => ({
    content: `Condition: ${item.Condition}. Year: ${item.Year}. Reported Cases: ${item.Reported_Cases}. Deaths: ${item.Deaths || 'Not Available'}. Affected Demographics: ${item.Affected_Demographics}. Source: ${item.Source}.`,
    category: 'Public Health'
  }));

  const embeddingsOutput = await extractor(documents.map(d => d.content), { pooling: 'mean', normalize: true });

  const rowsToInsert = documents.map((doc, i) => ({
    ...doc,
    embedding: Array.from(embeddingsOutput.data.slice(i * 384, (i + 1) * 384))
  }));

  console.log(`Upserting ${rowsToInsert.length} documents to Supabase...`);
  const { error } = await supabaseAdmin.from('documents').upsert(rowsToInsert, { onConflict: 'content' });

  if (error) {
    console.error("Error upserting data:", error);
  } else {
    console.log("Successfully populated the database!");
  }
}

populateDatabase();