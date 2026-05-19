import { runChain } from "../lib/langchain.js";

export async function runReferenceAgent(candidate, baseUrl) {
  const refs = candidate.candidate_references || [];
  if (!refs.length) return { check_type:"reference", status:"flagged", severity:"medium", result:{}, summary:"No references provided." };

  const personalDomains = ["gmail","yahoo","hotmail","outlook","rediffmail","ymail"];
  let personalEmailCount = 0;
  let unverifiedCompanyCount = 0;
  const flags = [];

  for (const ref of refs) {
    const domain = (ref.email || "").split("@")[1]?.toLowerCase() || "";
    const isPersonal = personalDomains.some(d => domain.startsWith(d));
    if (isPersonal) {
      personalEmailCount++;
      flags.push(`${ref.name}: Personal email used for corporate reference`);
    }

    const mcaRes = await fetch(`${baseUrl}/api/mock/mca`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company: ref.company }),
    }).then(r => r.json()).catch(() => ({ verified: false }));

    if (!mcaRes.verified) {
      unverifiedCompanyCount++;
      flags.push(`${ref.company}: Not found in MCA21 registry`);
    }
  }

  // Decide from data directly
  let status = "passed";
  let severity = "low";
  let summary = "Reference verification passed with no issues.";

  if (unverifiedCompanyCount > 0 && personalEmailCount > 1) {
    status = "flagged"; severity = "high";
    summary = `${flags.length} reference issues found including unverified companies and personal emails.`;
  } else if (unverifiedCompanyCount > 0) {
    status = "flagged"; severity = "high";
    summary = `Reference company not found in MCA21: ${flags[0]}`;
  } else if (personalEmailCount > 1) {
    status = "flagged"; severity = "medium";
    summary = `Multiple personal emails used for corporate references.`;
  }

  return {
    check_type: "reference",
    status,
    severity,
    result: { refs, analysis: { overall_status: status, severity, flags } },
    summary,
  };
}
