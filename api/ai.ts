import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';

function getAiClient() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set');
  }
  return new GoogleGenAI({ apiKey: GEMINI_API_KEY });
}

const responseSchema = z.object({
  score: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  gaps: z.array(z.string()),
  recommendations: z.array(z.string()),
  suggestedEquityRange: z.object({
    min: z.number(),
    max: z.number(),
  }),
});

const roleEvaluationPrompt = `
You are an expert startup advisor evaluating a co-founder's role readiness.

Analyze and provide:
1. A readiness score (0-100)
2. Key strengths
3. Key gaps
4. Recommendations
5. Suggested equity range

Role Data:
- Persona: {{PERSONA}}
- Responsibilities: {{RESPONSIBILITIES}}
- Authority: {{AUTHORITIES}}
- Support: {{SUPPORT}}
- Evidence: {{EVIDENCE}}

Industry: {{INDUSTRY}}, Stage: {{STAGE}}

Respond ONLY with valid JSON:
{"score": number, "strengths": [], "gaps": [], "recommendations": [], "suggestedEquityRange": {"min": number, "max": number}}
`;

const teamAnalysisPrompt = `
You are a startup advisor analyzing team composition.

Analyze:
1. Role overlaps
2. Missing critical roles  
3. Authority gaps
4. Overall team score

Team: {{TEAM}}

Respond ONLY with valid JSON:
{"overlaps": [], "missingRoles": [], "authorityGaps": [], "overallScore": number, "recommendations": []}
`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action } = req.body;

  try {
    if (action === 'evaluateRole') {
      const { persona, responsibilities, authorities, support, evidence, industry, stage } = req.body;
      
      const prompt = roleEvaluationPrompt
        .replace('{{PERSONA}}', persona || 'General')
        .replace('{{RESPONSIBILITIES}}', (responsibilities || []).map(r => r.label).join(', '))
        .replace('{{AUTHORITIES}}', (authorities || []).map(a => `${a.domain}: ${a.scope}`).join(', '))
        .replace('{{SUPPORT}}', (support || []).map(s => `${s.type}: ${s.description}`).join(', '))
        .replace('{{EVIDENCE}}', (evidence || []).map(e => e.value).join(', '))
        .replace('{{INDUSTRY}}', industry || 'SaaS')
        .replace('{{STAGE}}', stage || 'Seed');

      const response = await getAiClient().models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
        config: { temperature: 0.3, responseMimeType: 'application/json' },
      });

      const text = response.text || '';
      const parsed = JSON.parse(text);
      return res.status(200).json({ success: true, data: responseSchema.parse(parsed) });
    }

    if (action === 'evaluateTeam') {
      const { evaluations, industry, stage } = req.body;
      
      const prompt = teamAnalysisPrompt
        .replace('{{TEAM}}', JSON.stringify(evaluations || []))
        .replace('{{INDUSTRY}}', industry || 'SaaS')
        .replace('{{STAGE}}', stage || 'Seed');

      const response = await getAiClient().models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
        config: { temperature: 0.3, responseMimeType: 'application/json' },
      });

      const text = response.text || '';
      return res.status(200).json({ success: true, data: JSON.parse(text) });
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (error) {
    console.error('API Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
