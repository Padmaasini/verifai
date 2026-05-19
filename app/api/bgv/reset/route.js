import { supabase } from "../../../../lib/supabase.js";

export async function POST() {
  try {
    await supabase.from("audit_log").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("bgv_reports").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("bgv_checks").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("documents").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("candidates").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
