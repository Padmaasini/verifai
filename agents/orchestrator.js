import { supabase } from "../lib/supabase.js";
import { runIdentityAgent }    from "./identityAgent.js";
import { runEmploymentAgent }  from "./employmentAgent.js";
import { runEducationAgent }   from "./educationAgent.js";
import { runReferenceAgent }   from "./referenceAgent.js";
import { runRiskAgent }        from "./riskAgent.js";

/**
 * VerifAI Orchestrator Agent
 *
 * Built with LangChain pattern:
 * - Each sub-agent uses LangChain PromptTemplate + ChatGoogleGenerativeAI + StructuredOutputParser
 * - The orchestrator coordinates the pipeline: Identity → Employment → Education → Reference → Risk
 * - All results are persisted to Supabase after each step
 * - Audit trail written at every stage
 *
 * LangChain Chain pattern used in each agent:
 * PromptTemplate | ChatGoogleGenerativeAI | StructuredOutputParser
 */
export async function runOrchestrator(candidateId, baseUrl) {
  // Load candidate from Supabase
  const { data: candidate, error } = await supabase
    .from("candidates").select("*").eq("id", candidateId).single();

  if (error || !candidate) throw new Error("Candidate not found: " + candidateId);

  await supabase.from("candidates").update({ status: "processing" }).eq("id", candidateId);
  await logAudit(candidateId, "BGV_STARTED", { agent: "Orchestrator", framework: "LangChain" });

  // Helper: save check result to Supabase
  async function saveCheck(result) {
    await supabase.from("bgv_checks").upsert({
      candidate_id: candidateId,
      check_type:   result.check_type,
      status:       result.status,
      severity:     result.severity,
      result:       result.result,
      summary:      result.summary,
      completed_at: new Date().toISOString(),
    }, { onConflict: "candidate_id,check_type" });
  }

  // ── Step 1: Identity Agent ─────────────────────────────────
  console.log(`[Orchestrator] Running Identity Agent (LangChain) for ${candidate.full_name}`);
  const identityResult = await runIdentityAgent(candidate, baseUrl);
  await saveCheck(identityResult);
  await logAudit(candidateId, "IDENTITY_CHECK_COMPLETE", { status: identityResult.status, severity: identityResult.severity });

  // ── Step 2: Employment Agent ───────────────────────────────
  console.log(`[Orchestrator] Running Employment Agent (LangChain) for ${candidate.full_name}`);
  const employmentResult = await runEmploymentAgent(candidate, baseUrl);
  await saveCheck(employmentResult);
  await logAudit(candidateId, "EMPLOYMENT_CHECK_COMPLETE", { status: employmentResult.status, severity: employmentResult.severity });

  // ── Step 3: Education Agent ────────────────────────────────
  console.log(`[Orchestrator] Running Education Agent (LangChain) for ${candidate.full_name}`);
  const educationResult = await runEducationAgent(candidate, baseUrl);
  await saveCheck(educationResult);
  await logAudit(candidateId, "EDUCATION_CHECK_COMPLETE", { status: educationResult.status, severity: educationResult.severity });

  // ── Step 4: Reference Agent ────────────────────────────────
  console.log(`[Orchestrator] Running Reference Agent (LangChain) for ${candidate.full_name}`);
  const referenceResult = await runReferenceAgent(candidate, baseUrl);
  await saveCheck(referenceResult);
  await logAudit(candidateId, "REFERENCE_CHECK_COMPLETE", { status: referenceResult.status, severity: referenceResult.severity });

  // ── Step 5: Risk Agent — aggregates all results ────────────
  console.log(`[Orchestrator] Running Risk Agent (LangChain) for ${candidate.full_name}`);
  const riskResult = await runRiskAgent(candidate, identityResult, employmentResult, educationResult, referenceResult);
  await saveCheck(riskResult);

  // ── Save Final BGV Report ──────────────────────────────────
  const report = riskResult.result;
  await supabase.from("bgv_reports").upsert({
    candidate_id:             candidateId,
    risk_level:               report.risk_level,
    risk_score:               report.risk_score,
    narrative:                report.narrative,
    discrepancies:            report.discrepancies,
    recommendation:           report.recommendation,
    interview_fraud_detected: false,
    generated_at:             new Date().toISOString(),
  }, { onConflict: "candidate_id" });

  await supabase.from("candidates").update({ status: "complete" }).eq("id", candidateId);
  await logAudit(candidateId, "BGV_COMPLETE", {
    risk_level:     report.risk_level,
    recommendation: report.recommendation,
    framework:      "LangChain",
  });

  console.log(`[Orchestrator] BGV complete for ${candidate.full_name} — ${report.risk_level} risk — ${report.recommendation}`);
  return { candidateId, risk_level: report.risk_level, recommendation: report.recommendation };
}

async function logAudit(candidateId, action, details) {
  await supabase.from("audit_log").insert({
    candidate_id: candidateId, action, actor: "system", details,
  });
}
