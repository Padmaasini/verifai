import { supabase } from "../../../../../lib/supabase.js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request, { params }) {
  const { id } = params;

  const { data: candidate } = await supabase
    .from("candidates")
    .select("*")
    .eq("id", id)
    .single();

  const { data: checks } = await supabase
    .from("bgv_checks")
    .select("*")
    .eq("candidate_id", id);

  const { data: report } = await supabase
    .from("bgv_reports")
    .select("*")
    .eq("candidate_id", id)
    .single();

  return Response.json(
    { candidate, checks: checks || [], report },
    { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
  );
}
