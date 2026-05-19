import { runChain } from "../lib/langchain.js";

export async function runEmploymentAgent(candidate, baseUrl) {
  const employment = candidate.employment || [];
  if (!employment.length) return { check_type:"employment", status:"flagged", severity:"medium", result:{}, summary:"No employment provided." };

  const results = [];
  let worstStatus   = "passed";
  let worstSeverity = "low";
  const allDiscrepancies = [];

  const severityOrder = ["low","medium","high","critical"];

  for (const emp of employment) {
    const empRes = await fetch(`${baseUrl}/api/mock/employer`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company: emp.company, candidate_name: candidate.full_name,
        declared_start: emp.start, declared_end: emp.end, declared_title: emp.designation }),
    }).then(r => r.json()).catch(() => ({ employment_confirmed: false }));

    let status = "passed";
    let severity = "low";
    const discrepancies = [];

    if (!empRes.employment_confirmed) {
      status = "flagged"; severity = "high";
      discrepancies.push(`${emp.company}: Employment could not be confirmed — company may not exist`);
    } else if (empRes.salary_inflation_detected) {
      status = "flagged"; severity = "medium";
      discrepancies.push(`${emp.company}: Salary inflation — declared ₹${empRes.declared_last_salary?.toLocaleString()}, confirmed ₹${empRes.confirmed_last_salary?.toLocaleString()}`);
    } else if (empRes.confirmed_tenure_months && empRes.declared_tenure_months) {
      const gap = empRes.declared_tenure_months - empRes.confirmed_tenure_months;
      if (gap > 3) {
        status = "flagged"; severity = "high";
        discrepancies.push(`${emp.company}: Tenure fraud — declared ${empRes.declared_tenure_months} months, confirmed ${empRes.confirmed_tenure_months} months`);
      }
    }

    if (severityOrder.indexOf(severity) > severityOrder.indexOf(worstSeverity)) {
      worstSeverity = severity;
    }
    if (status === "flagged") worstStatus = "flagged";
    allDiscrepancies.push(...discrepancies);
    results.push({ company: emp.company, empRes, status, severity, discrepancies });
  }

  // Check for employment gaps between jobs
  if (employment.length > 1) {
    const sorted = [...employment].sort((a, b) => {
      const aDate = new Date(a.end || "2099-01");
      const bDate = new Date(b.end || "2099-01");
      return aDate - bDate;
    });
    for (let i = 0; i < sorted.length - 1; i++) {
      const endDate   = sorted[i].end ? new Date(sorted[i].end + "-01") : null;
      const startNext = sorted[i+1].start ? new Date(sorted[i+1].start + "-01") : null;
      if (endDate && startNext) {
        const gapMonths = Math.round((startNext - endDate) / (1000 * 60 * 60 * 24 * 30));
        if (gapMonths > 6) {
          if (worstSeverity !== "critical" && worstSeverity !== "high") {
            worstSeverity = "medium";
          }
          if (worstStatus !== "flagged") worstStatus = "flagged";
          allDiscrepancies.push(
            `Employment gap of ${gapMonths} months detected between ${sorted[i].company} and ${sorted[i+1].company}`
          );
        }
      }
    }
  }

  const summary = allDiscrepancies.length > 0
    ? allDiscrepancies[0]
    : "All employers verified successfully.";

  return {
    check_type: "employment",
    status:     worstStatus,
    severity:   worstSeverity,
    result:     { employers: results, analysis: { overall_status: worstStatus, severity: worstSeverity, discrepancies: allDiscrepancies } },
    summary,
  };
}
