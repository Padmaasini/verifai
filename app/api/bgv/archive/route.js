import { supabase } from "../../../../lib/supabase.js";

export async function POST(request) {
  try {
    const { candidateId, reason } = await request.json();

    await supabase
      .from("candidates")
      .update({
        archived:       true,
        archive_reason: reason || "BGV cleared",
        archived_at:    new Date().toISOString(),
      })
      .eq("id", candidateId);

    await supabase.from("audit_log").insert({
      candidate_id: candidateId,
      action:       "CANDIDATE_ARCHIVED",
      actor:        "hr",
      details:      { reason: reason || "BGV cleared" },
    });

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { candidateId } = await request.json();

    await supabase
      .from("candidates")
      .update({ archived: false, archive_reason: null, archived_at: null })
      .eq("id", candidateId);

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
