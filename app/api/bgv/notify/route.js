import { supabase } from "../../../../lib/supabase.js";

export async function POST(request) {
  try {
    const { candidateId, email } = await request.json();

    const { data: candidate } = await supabase
      .from("candidates").select("*").eq("id", candidateId).single();

    const { data: report } = await supabase
      .from("bgv_reports").select("*").eq("candidate_id", candidateId).single();

    const { data: checks } = await supabase
      .from("bgv_checks").select("*").eq("candidate_id", candidateId);

    // Log the notification in audit trail
    await supabase.from("audit_log").insert({
      candidate_id: candidateId,
      action:       "REPORT_SENT_TO_HIRING_MANAGER",
      actor:        "hr",
      details:      {
        sent_to:        email,
        candidate_name: candidate?.full_name,
        risk_level:     report?.risk_level,
        recommendation: report?.recommendation,
        sent_at:        new Date().toISOString(),
      },
    });

    // Note: In production, integrate with SendGrid/Resend/AWS SES
    // For POC, we log the notification and return success
    console.log(`[Notify] BGV report for ${candidate?.full_name} sent to ${email}`);
    console.log(`[Notify] Risk: ${report?.risk_level} | Recommendation: ${report?.recommendation}`);

    return Response.json({
      success:        true,
      sent_to:        email,
      candidate_name: candidate?.full_name,
      risk_level:     report?.risk_level,
      recommendation: report?.recommendation,
    });
  } catch (err) {
    console.error("[Notify]", err);
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
