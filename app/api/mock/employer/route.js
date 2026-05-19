export async function POST(request) {
  const { company, candidate_name, declared_start, declared_end, declared_title } = await request.json();
  await new Promise(r => setTimeout(r, 300));

  const co   = (company || "").toLowerCase();
  const name = (candidate_name || "").toLowerCase();

  // FRAUD: Arjun + FinTech Corp — tenure fraud (declared 36mo, actual 18mo)
  if (co.includes("fintech corp") && name.includes("arjun")) {
    return Response.json({
      employment_confirmed: true,
      company: "FinTech Corp",
      confirmed_title: "Junior Software Engineer",
      confirmed_start: "2021-01-10",
      confirmed_end: "2022-06-30",
      confirmed_tenure_months: 18,
      declared_tenure_months: 36,
      exit_reason: "Resignation",
      source: "FinTech Corp HR Portal",
    });
  }

  // FRAUD: Ravi Kumar — Fake Corp doesn't respond
  if (co.includes("fake corp") || co.includes("fakecorp") || co.includes("fake corp solutions")) {
    return Response.json({
      employment_confirmed: false,
      company,
      error: "Company not found or unresponsive — not registered in MCA21",
      confirmed_title: null,
      confirmed_start: null,
      confirmed_end: null,
      confirmed_tenure_months: 0,
      source: "Employer Portal",
    });
  }

  // FRAUD: Deepika Reddy — BrandBoost doesn't respond
  if (co.includes("brandboost")) {
    return Response.json({
      employment_confirmed: false,
      company,
      error: "Company not found or unresponsive — not registered in MCA21",
      confirmed_title: null,
      confirmed_start: null,
      confirmed_end: null,
      confirmed_tenure_months: 0,
      source: "Employer Portal",
    });
  }

  // FRAUD: Farhan Sheikh — RetailEdge confirms lower salary
  if (co.includes("retailedge") && name.includes("farhan")) {
    return Response.json({
      employment_confirmed: true,
      company: "RetailEdge India",
      confirmed_title: "Sales Manager",
      confirmed_start: declared_start,
      confirmed_end: declared_end || "Present",
      confirmed_tenure_months: null,
      confirmed_last_salary: 95000,
      declared_last_salary: 180000,
      salary_inflation_detected: true,
      exit_reason: "Still employed",
      source: "RetailEdge HR Portal",
    });
  }

  // CLEAN: All other employers — confirm as declared
  return Response.json({
    employment_confirmed: true,
    company: company || "As Declared",
    confirmed_title: declared_title || "As Declared",
    confirmed_start: declared_start || "As Declared",
    confirmed_end: declared_end || "Present",
    confirmed_tenure_months: null,
    exit_reason: "Resignation",
    source: "Employer HR Portal",
  });
}
