import { runChain } from "../lib/langchain.js";

export async function runEducationAgent(candidate, baseUrl) {
  const edu = (candidate.education || [])[0];
  if (!edu) return { check_type:"education", status:"flagged", severity:"medium", result:{}, summary:"No education provided." };

  const nadRes = await fetch(`${baseUrl}/api/mock/nad`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ candidate_name: candidate.full_name,
      institution: edu.institution, degree: edu.degree, year: edu.year, grade: edu.grade }),
  }).then(r => r.json()).catch(() => ({ verified: false, certificate_authentic: false }));

  // Determine outcome directly from mock API — do NOT let LLM guess
  const isFakeDegree     = nadRes.certificate_authentic === false;
  const isGradeInflation = nadRes.grade_inflation_detected === true;

  let status   = "passed";
  let severity = "low";
  let discrepancies = [];
  let summary  = "Education verified — no discrepancies found.";

  if (isFakeDegree) {
    status = "flagged";
    severity = "critical";
    discrepancies = ["Degree certificate not found in NAD registry — possible fake certificate"];
    summary = "Degree certificate could not be verified in NAD registry.";
  } else if (isGradeInflation) {
    status = "flagged";
    severity = "medium";
    const declared = edu.grade;
    const actual   = nadRes.grade;
    discrepancies = [`Grade inflation detected — declared ${declared}, NAD shows ${actual}`];
    summary = `Grade inflation detected: declared ${declared} but NAD records show ${actual}.`;
  }

  // Use LLM only to write a professional narrative summary
  const narrative = await runChain(
    `Write a one-sentence professional BGV education check summary.
Institution: {institution}, Degree: {degree}, Verified: {verified}, Issues: {issues}
Return JSON: {{"summary": "one professional sentence"}}`,
    {
      institution: edu.institution || "",
      degree:      edu.degree || "",
      verified:    String(!isFakeDegree),
      issues:      discrepancies.join(", ") || "none",
    }
  );

  return {
    check_type: "education",
    status,
    severity,
    result: { nad: nadRes, analysis: { overall_status: status, severity, discrepancies } },
    summary: narrative?.summary || summary,
  };
}
