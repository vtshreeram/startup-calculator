# Developer Task Checklist

---

## Phase 1 — Foundation Setup

- [ ] Install new dependencies: `react-router-dom`, `zod`, `react-hook-form`
- [ ] Add routing to `App.tsx` with 4 routes: `/startup`, `/evaluation`, `/team`, `/equity`
- [ ] Create `Navigation.tsx` with stepper UI
- [ ] Extend `types.ts` with new interfaces: `StartupProfile`, `Persona`, `RoleEvaluation`, `ResponsibilityCommitment`, `AuthorityRequest`, `SupportRequirement`, `Evidence`
- [ ] Create `src/data/industries.ts` with 5 industry definitions
- [ ] Create `src/data/personas.ts` with role templates per industry
- [ ] Create `src/data/responsibilityFrameworks.ts` with stage-based weights
- [ ] Create `src/contexts/EvaluationContext.tsx` with state + localStorage persistence

---

## Phase 2 — Evaluation UI Components

- [ ] Build `IndustrySelector.tsx` — card grid for industry selection
- [ ] Build `StartupProfileWizard.tsx` — industry + stage + team size form
- [ ] Build `PersonaSelector.tsx` — dynamic role cards filtered by industry
- [ ] Build `ResponsibilityMatrix.tsx` — checklist + commitment level + hours slider
- [ ] Build `AuthorityBuilder.tsx` — domain + scope selector + reasoning input
- [ ] Build `SupportRequirements.tsx` — type + description + criticality toggle
- [ ] Build `EvidenceUploader.tsx` — evidence type + URL/description input
- [ ] Build `EvaluationFlow.tsx` — multi-step page connecting all above components
- [ ] Build reusable `Stepper.tsx`, `ScoreCard.tsx`, `Badge.tsx` in `components/ui/`

---

## Phase 3 — Backend API

- [ ] Create `server/routes/startups.ts` — CRUD for startup profiles
- [ ] Create `server/routes/evaluations.ts` — CRUD for role evaluations
- [ ] Create `server/routes/ai.ts` — POST `/api/evaluate/role` and `/api/evaluate/team`
- [ ] Create `server/services/geminiService.ts` — prompt builder + Gemini API call + JSON parser
- [ ] Create `server/services/evaluationService.ts` — scoring logic + validation
- [ ] Add `server/middleware/validation.ts` — Zod request validation
- [ ] Add `server/middleware/errorHandler.ts` — global error handler
- [ ] Store data in JSON files initially (plan SQLite migration later)

---

## Phase 4 — Gemini AI Integration

- [ ] Write role readiness evaluation prompt template
- [ ] Write team composition gap analysis prompt template
- [ ] Implement structured JSON output parsing with fallback handling
- [ ] Add response caching to avoid duplicate API calls
- [ ] Test prompts with 3–5 sample inputs, tune for consistency
- [ ] Set temperature to 0.3 for evaluation endpoints

---

## Phase 5 — Results & Team Review

- [ ] Build `RoleReadinessCard.tsx` — score circle + strengths/gaps/recommendations
- [ ] Build `TeamCompositionView.tsx` — side-by-side cards + overlap/gap warnings
- [ ] Add approval workflow — approve/reject each evaluation
- [ ] Add validation gate — block equity tab until team is approved
- [ ] Wire Gemini responses to frontend via API calls

---

## Phase 6 — Equity Calculator Integration

- [ ] Modify `FounderSection.tsx` to accept pre-filled data from evaluations
- [ ] Add readiness score as a weight multiplier in `calculations.ts`
- [ ] Factor commitment level (full-time/part-time) into equity weights
- [ ] Factor authority scope into equity weights
- [ ] Add suggested equity range display from AI output
- [ ] Auto-navigate from approved team → pre-populated equity calculator

---

## Phase 7 — Polish & UX

- [ ] Add Framer Motion transitions between evaluation steps
- [ ] Add loading states for Gemini API calls with skeleton UI
- [ ] Add Recharts visualizations for team composition overlaps
- [ ] Add warning modals for low readiness scores (<60)
- [ ] Mobile responsive pass on all new components
- [ ] Add feature flags in `config.ts` for gradual rollout

---

## Phase 8 — Testing & Cleanup

- [ ] Unit tests for `roleEvaluation.ts` scoring logic
- [ ] Unit tests for updated `calculations.ts`
- [ ] Integration tests for Gemini endpoints (mocked)
- [ ] E2E test: full flow from startup creation → equity output
- [ ] Code review for clean separation between `/evaluation` and `/equity`
- [ ] Update `README.md` with new architecture docs

---

> **Priority Order:** Phase 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8
> **MVP Cutoff:** After Phase 5 you have a working demo
