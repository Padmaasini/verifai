import { supabase } from "../../../../lib/supabase.js";
import { runInterviewFraudAgent } from "../../../../agents/interviewFraudAgent.js";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const candidateId = formData.get("candidateId");
    const interviewFile = formData.get("interviewFile");
    const idFile = formData.get("idFile");

    if (!candidateId || !interviewFile) {
      return Response.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Convert files to base64 for Gemini Vision
    const interviewBuffer = await interviewFile.arrayBuffer();
    const interviewBase64 = Buffer.from(interviewBuffer).toString("base64");

    let idBase64 = null;
    if (idFile) {
      const idBuffer = await idFile.arrayBuffer();
      idBase64 = Buffer.from(idBuffer).toString("base64");
    }

    // Get candidate name
    const { data: candidate } = await supabase
      .from("candidates")
      .select("full_name")
      .eq("id", candidateId)
      .single();

    // Run interview fraud agent
    const result = await runInterviewFraudAgent(
      interviewBase64,
      idBase64,
      candidate?.full_name || "Unknown"
    );

    // Save result to bgv_checks
    await supabase.from("bgv_checks").upsert({
      candidate_id: candidateId,
      check_type: "interview_fraud",
      status: result.status,
      severity: result.severity,
      result: result.result,
      summary: result.summary,
      completed_at: new Date().toISOString(),
    }, { onConflict: "candidate_id,check_type" });

    // Update report if exists
    await supabase.from("bgv_reports")
      .update({ interview_fraud_detected: result.status === "flagged" })
      .eq("candidate_id", candidateId);

    return Response.json({ success: true, result });
  } catch (err) {
    console.error("[Interview Upload]", err);
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
