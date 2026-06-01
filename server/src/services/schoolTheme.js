const Anthropic = require('@anthropic-ai/sdk');
const db = require('../db');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const FALLBACK = { primary: '#14B8A6', secondary: '#0D9488', light: '#CCFBF1', bg: '#F0FDFA' };

// Basic sanity check — skip API call for obvious junk domains
function isLikelyRealSchool(domain) {
  if (!domain || !domain.endsWith('.edu')) return false;
  const name = domain.slice(0, -4); // strip .edu
  if (name.length < 3) return false;          // too short (e.g. "x.edu")
  if (/^\d+$/.test(name)) return false;       // all numbers
  if (/[^a-z0-9.\-]/i.test(name)) return false; // weird chars
  return true;
}

async function getSchoolTheme(domain) {
  // Return cached if exists
  const cached = await db.query('SELECT * FROM school_themes WHERE domain=$1', [domain]);
  if (cached.rows.length) return cached.rows[0];

  // Skip API call for domains that don't look like real schools
  if (!isLikelyRealSchool(domain)) {
    return { domain, primary_color: FALLBACK.primary, secondary_color: FALLBACK.secondary };
  }

  // Ask Claude Haiku — cheapest model, perfect for a simple lookup
  let colors = FALLBACK;
  try {
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 150,
      messages: [{
        role: 'user',
        content: `What are the official primary and secondary brand colors for the university with email domain "${domain}"?
Reply with ONLY valid JSON — no explanation, no markdown:
{"primary":"#hexcode","secondary":"#hexcode"}
Use the school's actual official colors. If the domain is unknown, use {"primary":"#14B8A6","secondary":"#0D9488"}.`,
      }],
    });

    const text = msg.content[0].text.trim().replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(text);
    if (parsed.primary && parsed.secondary) colors = { ...FALLBACK, ...parsed };
  } catch (e) {
    console.error('School theme fetch failed:', e.message);
  }

  // Derive light/bg tints from primary (simple lightening via opacity)
  const row = {
    domain,
    primary_color: colors.primary,
    secondary_color: colors.secondary,
  };

  await db.query(
    `INSERT INTO school_themes (domain, primary_color, secondary_color)
     VALUES ($1,$2,$3) ON CONFLICT (domain) DO NOTHING`,
    [row.domain, row.primary_color, row.secondary_color]
  );

  return row;
}

module.exports = { getSchoolTheme };
