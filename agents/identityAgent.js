import { runChain } from "../lib/langchain.js";

export async function runIdentityAgent(candidate, baseUrl) {
  const uidaiRes = await fetch(`${baseUrl}/api/mock/uidai`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ aadhaar: candidate.aadhaar, pan: candidate.pan }),
  }).then(r => r.json()).catch(() => ({ status: "error" }));

  // Decide from mock API directly
  const addressMismatch = uidaiRes.address_mismatch_detected === true;
  const nameMismatch    = uidaiRes.name_match === false;
  const dobMismatch     = uidaiRes.dob_match === false;
  const isError         = uidaiRes.status === "error";

  let status = "passed";
  let severity = "low";
  let discrepancies = [];
  let summary = "All declared data matches with UIDAI verified data.";

  if (isError) {
    status = "flagged"; severity = "medium";
    discrepancies = ["UIDAI verification service unavailable"];
    summary = "Could not verify identity with UIDAI.";
  } else if (nameMismatch || dobMismatch) {
    status = "flagged"; severity = "high";
    discrepancies = ["Name or DOB mismatch with UIDAI records"];
    summary = "Name or date of birth does not match UIDAI records.";
  } else if (addressMismatch) {
    status = "flagged"; severity = "medium";
    discrepancies = [`Address mismatch — UIDAI shows: ${uidaiRes.registered_address}`];
    summary = `Address mismatch detected. UIDAI registered: ${uidaiRes.registered_address}.`;
  }

  return {
    check_type: "identity",
    status,
    severity,
    result: { uidai: uidaiRes, analysis: { overall_status: status, severity, discrepancies } },
    summary,
  };
}
