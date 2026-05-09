// Serverless function that proxies requests to the Anthropic API.
// Deployed automatically by Vercel as /api/claude.
// The ANTHROPIC_API_KEY is set in Vercel's environment variables — never exposed to the browser.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Look up the key under several common variant names, just in case
  const apiKey =
    process.env.ANTHROPIC_API_KEY ||
    process.env.anthropic_api_key ||
    process.env.ANTHROPIC_KEY ||
    process.env.CLAUDE_API_KEY;

  if (!apiKey) {
    const envKeysSeen = Object.keys(process.env)
      .filter(k => /anthropic|claude/i.test(k))
      .join(', ') || '(none found)';
    return res.status(500).json({
      error: 'No Anthropic API key found in server environment.',
      hint: 'Vercel Settings → Environment Variables. Name must be ANTHROPIC_API_KEY.',
      env_keys_matching_pattern: envKeysSeen,
    });
  }

  // Strip whitespace just in case it was pasted with a trailing space
  const cleanKey = apiKey.trim();

  if (!cleanKey.startsWith('sk-ant-')) {
    return res.status(500).json({
      error: 'API key found but does not look like an Anthropic key.',
      hint: 'Anthropic keys start with sk-ant-. Get one at console.anthropic.com.',
      key_starts_with: cleanKey.slice(0, 7) + '...',
    });
  }

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': cleanKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    });

    const text = await upstream.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: 'Anthropic API rejected the request',
        status: upstream.status,
        anthropic_response: data,
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Anthropic proxy error:', err);
    return res.status(500).json({
      error: 'Network or runtime error talking to Anthropic',
      detail: String(err),
      stack: err && err.stack ? String(err.stack).split('\n').slice(0, 3).join(' | ') : null,
    });
  }
}
