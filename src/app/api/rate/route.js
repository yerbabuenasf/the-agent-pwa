import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function buildPrompt(role, data) {
  const isContractor = role === 'contractor';

  const context = isContractor
    ? `
You are an expert rate negotiation advisor for freelance photographers and videographers.
A CONTRACTOR is asking what they should charge for a project.
Your job: give them a confident, justified rate with a floor, ceiling, and negotiation coaching.

Project details:
- Media type: ${data.mediaType} (photo / video / photo+video — this significantly affects the rate)
- Project type: ${data.projectType}
- Deliverables: ${data.deliverables}
- Client type: ${data.clientType}
- Usage rights: ${data.usageRights}
- Timeline: ${data.timeline}
- Experience level: ${data.experienceLevel}
- Location: ${data.location || 'Not specified'}

IMPORTANT RATE GUIDANCE:
- Photo-only projects: base day rates typically $800–$3,500 depending on experience and usage
- Video-only projects: base day rates typically $1,500–$6,000 — video commands a significant premium due to equipment, editing time, and complexity
- Photo + Video combined: should be priced as a bundle (not simply additive) — typically 1.4–1.7x the photo rate alone, representing a discount for bundling while still compensating for the added complexity
`
    : `
You are an expert budget advisor for brands and agencies hiring creative talent.
An EMPLOYER/CLIENT is asking what they should budget for a creative project.
Your job: give them a fair market rate range, help them make an offer that attracts good talent, and suggest specific ways they can reduce their budget if needed.

Project details:
- Media type needed: ${data.mediaType} (photo / video / photo+video)
- Use case / purpose: ${data.useCase}
- Deliverables needed: ${data.deliverables}
- Usage rights needed: ${data.usageRights}
- Timeline: ${data.timeline}
- Talent level preferred: ${data.talentLevel}
- Location: ${data.location || 'Not specified'}
${data.ownBudget ? `- EMPLOYER'S SET BUDGET: $${Number(data.ownBudget).toLocaleString()}

IMPORTANT — The employer has given you a specific budget to work with. Your job shifts:
1. Tell them honestly whether this budget is realistic for what they're asking (use the rationale field)
2. Set "recommended" to the fair market rate — not their budget — so they understand the real market
3. If their budget is BELOW the floor, the rationale should clearly explain the gap and what they'd need to cut to make it work
4. If their budget is WITHIN the range, affirm it and help them make a strong offer
5. If their budget is ABOVE the ceiling, tell them they have room to negotiate down
6. All savings suggestions should be SPECIFICALLY about making their $${Number(data.ownBudget).toLocaleString()} budget work, not generic tips` : ''}

IMPORTANT RATE GUIDANCE:
- Photo-only projects: typically $800–$3,500/day depending on talent tier and usage
- Video-only projects: typically $1,500–$6,000/day — significantly more than photo due to equipment, crew, and post-production
- Photo + Video combined: bundle pricing typically 1.4–1.7x the photo rate (a discount vs. hiring separately)
`;

  const savingsField = !isContractor ? `
  "savings": [
    { "icon": "<single emoji>", "suggestion": "<specific actionable way to reduce cost, max 15 words>", "impact": "<e.g. 'Save ~$300–500' or 'Reduce by ~20%'>" }
  ],` : '';

  return `${context}

Consider all standard industry factors:
- Day rate vs. half-day rate vs. hourly
- Post-production / editing time (video editing is 2–4x longer than photo editing)
- Usage rights and licensing value
- Client type and typical budget
- Market rate for location
- Rush fees if applicable
- Talent experience tier

Return ONLY a valid JSON object — no markdown, no explanation outside the JSON — with exactly this structure:

{
  "recommended": <number, the single best rate to quote>,
  "floor": <number, the absolute minimum>,
  "ceiling": <number, the top of what this market can bear>,
  "rationale": "<1–2 sentence plain-English explanation of the recommended rate>",
  "factors": [
    { "icon": "<single emoji>", "text": "<concise factor explanation, max 12 words>", "impact": "<up|down|neutral>" }
  ],${savingsField}
  "script": "<50–80 word word-for-word ${isContractor ? 'response to use when the client says the rate is too high' : 'offer script to send to the contractor — professional, respectful, leaves room to negotiate'}>"
}

Rules:
- All rates must be realistic USD amounts for the US market
- Include 3–5 factors maximum
- ${isContractor ? '' : 'Include 3–4 savings suggestions — be specific and practical, not generic (e.g. "Drop to 6-month usage rights instead of 2-year" not just "Reduce usage rights")'}
- The script must be natural and conversational, not corporate-sounding
- Do not include currency symbols in number fields — just the number
- Respond with ONLY the JSON object`;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { role, ...data } = body;

    if (!role || !['contractor', 'employer'].includes(role)) {
      return Response.json({ error: 'Invalid role' }, { status: 400 });
    }

    const prompt = buildPrompt(role, data);

    const message = await client.messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      messages:   [{ role: 'user', content: prompt }],
    });

    const raw = message.content[0].text.trim();
    const jsonStr = raw.replace(/^```json?\n?/, '').replace(/\n?```$/, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch {
      console.error('Claude returned non-JSON:', raw);
      return Response.json({ error: 'Failed to parse rate response. Please try again.' }, { status: 500 });
    }

    const required = ['recommended', 'floor', 'ceiling', 'factors', 'script'];
    for (const field of required) {
      if (parsed[field] === undefined) {
        return Response.json({ error: `Missing field in response: ${field}` }, { status: 500 });
      }
    }

    return Response.json(parsed);

  } catch (err) {
    console.error('Rate API error:', err);
    if (err.status === 401) {
      return Response.json({ error: 'Invalid API key. Check your ANTHROPIC_API_KEY in .env.local.' }, { status: 500 });
    }
    if (err.status === 429) {
      return Response.json({ error: 'Rate limit hit. Wait a moment and try again.' }, { status: 429 });
    }
    return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
