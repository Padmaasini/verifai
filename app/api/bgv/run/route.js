import { supabase } from "../../../../lib/supabase.js";
import { runIdentityAgent }   from "../../../../agents/identityAgent.js";
import { runEmploymentAgent } from "../../../../agents/employmentAgent.js";
import { runEducationAgent }  from "../../../../agents/educationAgent.js";
import { runReferenceAgent }  from "../../../../agents/referenceAgent.js";
import { runRiskAgent }       from "../../../../agents/riskAgent.js";

export const maxDuration = 300;

export async function POST(request) {
  const { candidateId, step } = await request.json();
  console.log(`[BGV Run] Starting step: ${step} for candidate: ${candidateId}`);

  try {
    const baseUrl = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL;

    const { data: candidate } = await supabase
      .from("candidates").select("*").eq("id", candidateId).single();

    if (!candidate) {
      console.error("[BGV Run] Candidate not found:", candidateId);
      return Response.json({ success: false, error: "Candidate not found" }, { status: 404 });
    }

    console.log(`[BGV Run] Running ${step} for ${candidate.full_name}`);

    async function saveCheck(result) {
      console.log(`[BGV Run] Saving ${result.check_type}: ${result.status}`);
      // Delete existing check first, then insert fresh
      await supabase.from("bgv_checks")
        .delete()
        .eq("candidate_id", candidateId)
        .eq("check_type", result.check_type);

      const { error } = await supabase.from("bgv_checks").insert({
        candidate_id: candidateId,
        check_type:   result.check_type,
        status:       result.status,
        severity:     result.severity,
        result:       result.result,
        summary:      result.summary,
        completed_at: new Date().toISOString(),
      });
      if (error) console.error(`[BGV Run] Save error:`, error.message);
      return result;
    }

    // Fallback result if agent fails
    function fallback(check_type, error) {
      console.error(`[BGV Run] Agent failed for ${check_type}:`, error);
      return {
        check_type,
        status:   "flagged",
        severity: "medium",
        result:   { error: String(error) },
        summary:  `${check_type} check encountered an error.`,
      };
    }

    let result;

    if (step === "identity") {
      await supabase.from("candidates").update({ status: "processing" }).eq("id", candidateId);
      try { result = await runIdentityAgent(candidate, baseUrl); }
      catch(e) { result = fallback("identity", e); }
      await saveCheck(result);

    } else if (step === "employment") {
      try { result = await runEmploymentAgent(candidate, baseUrl); }
      catch(e) { result = fallback("employment", e); }
      await saveCheck(result);

    } else if (step === "education") {
      try { result = await runEducationAgent(candidate, baseUrl); }
      catch(e) { result = fallback("education", e); }
      await saveCheck(result);

    } else if (step === "reference") {
      try { result = await runReferenceAgent(candidate, baseUrl); }
      catch(e) { result = fallback("reference", e); }
      await saveCheck(result);

    } else if (step === "risk") {
      const { data: checks, error: checksError } = await supabase
        .from("bgv_checks").select("*").eq("candidate_id", candidateId);

      console.log(`[BGV Run] Checks found:`, JSON.stringify(checks?.map(c => ({type: c.check_type, status: c.status}))));
      if (checksError) console.error("[BGV Run] Checks query error:", checksError.message);

      const get = (t) => {
        const found = checks?.find(c => c.check_type === t);
        if (!found) console.log(`[BGV Run] Missing check: ${t}`);
        return found || { check_type: t, status: "flagged", severity: "medium", result: {}, summary: "Check not completed." };
      };

      try {
        result = await runRiskAgent(candidate, get("identity"), get("employment"), get("education"), get("reference"));
      } catch(e) {
        result = fallback("risk", e);
      }
      await saveCheck(result);

      // Save final report regardless
      const report = result.result || {};
      await supabase.from("bgv_reports").upsert({
        candidate_id:   candidateId,
        risk_level:     report.risk_level || "medium",
        risk_score:     report.risk_score || 50,
        narrative:      report.narrative || "BGV completed.",
        discrepancies:  report.discrepancies || [],
        recommendation: report.recommendation || "Review Required",
        generated_at:   new Date().toISOString(),
      }, { onConflict: "candidate_id" });

      await supabase.from("candidates").update({ status: "complete" }).eq("id", candidateId);
      console.log(`[BGV Run] BGV Complete for ${candidate.full_name}`);
    }

    return Response.json({ success: true, step, status: result?.status });

  } catch (err) {
    console.error(`[BGV Run] Fatal error on step ${step}:`, err.message, err.stack);
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
