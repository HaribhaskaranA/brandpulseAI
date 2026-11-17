const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL ? process.env.DATABASE_URL.replace('db.vxruhsoxwfsbwtnxktvm.supabase.co:5432', 'aws-0-ap-southeast-1.pooler.supabase.com:5432') : undefined,
  ssl: { rejectUnauthorized: false }
});

async function seed() {
  await client.connect();
  console.log('Connected to PostgreSQL for seeding...');

  // 1. Seed brand guidelines
  await client.query(`
    insert into public.brand_guidelines (id, name, version, approved_colors, tone_profile)
    values (
      'brand-kit-acme-v2',
      'Acme Cloud Brand Book v2.1',
      '2.1',
      '[
        {"name": "Primary Deep Navy", "hex": "#0F172A", "role": "Headers, Primary Text"},
        {"name": "Brand Forest Emerald", "hex": "#059669", "role": "Primary Accents, Positive States"},
        {"name": "Slate Canvas", "hex": "#F8FAFC", "role": "Surface Background"},
        {"name": "Border Slate", "hex": "#E2E8F0", "role": "Dividers, Card Borders"},
        {"name": "Accent Blue", "hex": "#2563EB", "role": "Interactive Links, Informational Focus"}
      ]'::jsonb,
      '{
        "archetype": "Authoritative, Empathetic, Precise",
        "targetReadingLevel": "Grade 9-11 (Clear B2B Tech)",
        "bannedToneMarkers": ["Aggressive superlatives", "Street colloquialisms", "Fear-mongering (FUD)"],
        "preferredVoice": "Calm, evidence-based, customer-focused"
      }'::jsonb
    )
    on conflict (id) do update set 
      name = excluded.name, 
      version = excluded.version, 
      approved_colors = excluded.approved_colors,
      tone_profile = excluded.tone_profile;
  `);

  console.log('Seed completed successfully.');
  await client.end();
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
