import { runChain } from "../lib/langchain.js";

export async function runRiskAgent(candidate, identity, employment, education, reference) {
  // Extract discrepancies directly from agent results — no LLM interpretation
  const idIssues  = identity.result?.analysis?.discrepancies || [];
  const empIssues = employment.result?.analysis?.discrepancies ||
    (employment.result?.employers || []).flatMap(e => e.discrepancies || []);
  const eduIssues = education.result?.analysis?.discrepancies || [];
  const refIssues = reference.result?.analysis?.flags || [];

  const allIssues = [...idIssues, ...empIssues, ...eduIssues, ...refIssues];

  // Calculate risk score from actual check statuses
  const severityScore = { low:0, medium:20, high:40, critical:60 };
  let score = 0;
  score += severityScore[identity.severity]   || 0;
  score += severityScore[employment.severity] || 0;
  score += severityScore[education.severity]  || 0;
  score += severityScore[reference.severity]  || 0;
  score = Math.min(score, 100);

  const riskLevel = score <= 30 ? "low" : score <= 60 ? "medium" : score <= 85 ? "high" : "critical";
  const recommendation = riskLevel === "low" ? "Candidate Cleared"
    : riskLevel === "medium" ? "Further Review Needed"
    : riskLevel === "high" ? "Do Not Onboard"
    : "Do Not Onboard";

  // Use LLM only to write the narrative — plain text, no JSON structure
  const narrative = await runChain(
    `Write a professional 2-paragraph BGV narrative for {candidate_name} applying as {job_role}.
Risk level: {risk_level}. Issues found: {issues}. Verified items: {positive}.
Return JSON: {{"narrative": "Write exactly 2 paragraphs as a single string separated by a newline. Do not use keys like paragraph1 or paragraph2.", "summary": "one sentence conclusion"}}`,
    {
      candidate_name: candidate.full_name || "",
      job_role:       candidate.job_role || "the role",
      risk_level:     riskLevel,
      issues:         allIssues.join("; ") || "none",
      positive:       [
        identity.status === "passed" ? "Identity verified" : "",
        employment.status === "passed" ? "Employment verified" : "",
        education.status === "passed" ? "Education verified" : "",
        reference.status === "passed" ? "References verified" : "",
      ].filter(Boolean).join(", ") || "none",
    }
  );

  // Build structured discrepancies list
  const discrepancies = [
    ...idIssues.map(i => ({ check:"identity", issue:i, severity:identity.severity||"low" })),
    ...empIssues.map(i => ({ check:"employment", issue:i, severity:employment.severity||"low" })),
    ...eduIssues.map(i => ({ check:"education", issue:i, severity:education.severity||"low" })),
    ...refIssues.map(i => ({ check:"reference", issue:i, severity:reference.severity||"low" })),
  ];

  const positive_findings = [
    identity.status === "passed" ? "Identity verified against UIDAI" : null,
    employment.status === "passed" ? "Employment history confirmed" : null,
    education.status === "passed" ? "Educational qualifications verified" : null,
    reference.status === "passed" ? "Professional references verified" : null,
  ].filter(Boolean);

  const result = {
    risk_score:       score,
    risk_level:       riskLevel,
    recommendation,
    discrepancies,
    positive_findings,
    narrative:        typeof narrative?.narrative === "string"
      ? narrative.narrative
      : `BGV completed for ${candidate.full_name}. Risk level: ${riskLevel}.`,
    summary:          typeof narrative?.summary === "string"
      ? narrative.summary
      : `${candidate.full_name} assessed as ${riskLevel} risk.`,
  };

  return {
    check_type: "risk",
    status:     riskLevel === "low" ? "passed" : "flagged",
    severity:   riskLevel,
    result,
    summary:    result.summary,
  };
}
