import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';

function getAiClient() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
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

export type RoleEvaluationResult = z.infer<typeof responseSchema>;

const roleEvaluationPrompt = `
You are an expert startup advisor evaluating a co-founder's role readiness for a startup.

Analyze the following role evaluation data and provide:
1. A readiness score (0-100)
2. Key strengths
3. Key gaps/weaknesses
4. Recommendations for improvement
5. A suggested equity range (as percentage of total founder equity)

Role Evaluation Data:
- Persona: {{PERSONA}}
- Responsibilities: {{RESPONSIBILITIES}}
- Authority Scope: {{AUTHORITIES}}
- Support Requirements: {{SUPPORT}}
- Evidence: {{EVIDENCE}}

Industry: {{INDUSTRY}}
Stage: {{STAGE}}

Provide your response as a JSON object with this exact structure:
{
  "score": number,
  "strengths": ["string"],
  "gaps": ["string"],
  "recommendations": ["string"],
  "suggestedEquityRange": { "min": number, "max": number }
}

Ensure the score reflects:
- Clarity of responsibilities (25%)
- Appropriate authority scope (25%)
- Evidence of capability (25%)
- Critical dependencies addressed (25%)

Respond with ONLY valid JSON, no additional text.
`;

const teamAnalysisPrompt = `
You are an expert startup advisor analyzing team composition.

Analyze the following team evaluations and identify:
1. Role overlaps/conflicts
2. Missing critical roles
3. Gaps in authority coverage
4. Recommendations for team balance

Team Evaluations:
{{TEAM_EVALUATIONS}}

Startup Industry: {{INDUSTRY}}
Startup Stage: {{STAGE}}

Provide your response as a JSON object with this exact structure:
{
  "overlaps": [{ "roles": ["string"], "severity": "high|medium|low", "recommendation": "string" }],
  "missingRoles": [{ "role": "string", "criticality": "high|medium|low", "suggestedAction": "string" }],
  "authorityGaps": [{ "domain": "string", "severity": "high|medium|low", "recommendation": "string" }],
  "overallScore": number,
  "recommendations": ["string"]
}

Respond with ONLY valid JSON, no additional text.
`;

function buildRolePrompt(
  persona: string,
  responsibilities: string[],
  authorities: string[],
  support: string[],
  evidence: string[],
  industry: string,
  stage: string
): string {
  return roleEvaluationPrompt
    .replace('{{PERSONA}}', persona)
    .replace('{{RESPONSIBILITIES}}', responsibilities.join(', '))
    .replace('{{AUTHORITIES}}', authorities.join(', '))
    .replace('{{SUPPORT}}', support.join(', '))
    .replace('{{EVIDENCE}}', evidence.join(', '))
    .replace('{{INDUSTRY}}', industry)
    .replace('{{STAGE}}', stage);
}

function buildTeamPrompt(evaluations: any[], industry: string, stage: string): string {
  const teamData = evaluations.map(e => JSON.stringify(e)).join('\n\n');
  return teamAnalysisPrompt
    .replace('{{TEAM_EVALUATIONS}}', teamData)
    .replace('{{INDUSTRY}}', industry)
    .replace('{{STAGE}}', stage);
}

export async function evaluateRole(
  persona: string,
  responsibilities: string[],
  authorities: string[],
  support: string[],
  evidence: string[],
  industry: string,
  stage: string
): Promise<RoleEvaluationResult> {
  const prompt = buildRolePrompt(persona, responsibilities, authorities, support, evidence, industry, stage);

  const response = await getAiClient().models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: {
      temperature: 0.3,
      responseMimeType: 'application/json',
    },
  });

  const text = response.text || '';
  
  try {
    const parsed = JSON.parse(text);
    return responseSchema.parse(parsed);
  } catch {
    console.error('Failed to parse Gemini response:', text);
    throw new Error('Failed to parse AI response');
  }
}

export async function evaluateTeam(
  evaluations: any[],
  industry: string,
  stage: string
): Promise<any> {
  const prompt = buildTeamPrompt(evaluations, industry, stage);

  const response = await getAiClient().models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: {
      temperature: 0.3,
      responseMimeType: 'application/json',
    },
  });

  const text = response.text || '';
  
  try {
    return JSON.parse(text);
  } catch {
    console.error('Failed to parse Gemini team response:', text);
    throw new Error('Failed to parse AI team response');
  }
}
