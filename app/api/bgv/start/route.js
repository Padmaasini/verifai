import { supabase } from "../../../../lib/supabase.js";

export async function POST(request) {
  try {
    const body = await request.json();
    const { data: candidate, error } = await supabase
      .from("candidates")
      .insert({
        full_name:            body.full_name,
        email:                body.email,
        phone:                body.phone,
        dob:                  body.dob,
        gender:               body.gender,
        nationality:          body.nationality,
        aadhaar:              body.aadhaar,
        pan:                  body.pan,
        passport:             body.passport,
        uan_number:           body.uan_number,
        nps_pran:             body.nps_pran,
        job_role:             body.job_role,
        father_name:          body.father_name,
        mother_name:          body.mother_name,
        marital_status:       body.marital_status,
        spouse_name:          body.spouse_name,
        addresses:            body.addresses    || [],
        employment:           body.employment   || [],
        education:            body.education    || [],
        candidate_references: body.references   || [],
        status:               "pending",  // stays pending until HR runs verification
      })
      .select().single();

    if (error) throw error;

    return Response.json({ success: true, candidateId: candidate.id });
  } catch (err) {
    console.error("[BGV Start]", err);
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
