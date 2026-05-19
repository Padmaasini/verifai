export async function POST(request) {
  const { candidate_name, institution, degree, year, grade } = await request.json();
  await new Promise(r => setTimeout(r, 300));

  const inst = (institution || "").toLowerCase();
  const name = (candidate_name || "").toLowerCase();
  const deg  = (degree || "").toLowerCase();

  // FRAUD: Arjun + VIT — CGPA inflation (declared 8.9, actual 7.6)
  if (inst.includes("vit") && name.includes("arjun")) {
    return Response.json({
      verified: true, institution: "Vellore Institute of Technology",
      degree: "B.Tech Computer Science", year: "2021", grade: "7.6",
      grade_inflation_detected: true, certificate_authentic: true,
      source: "NAD / UGC",
    });
  }

  // FRAUD: Priya + IIM — fake degree (not in NAD)
  if (inst.includes("iim") && name.includes("priya")) {
    return Response.json({
      verified: false, institution, degree, year, grade,
      grade_inflation_detected: false, certificate_authentic: false,
      error: "No matching record found in NAD registry",
      source: "NAD / UGC",
    });
  }

  // CLEAN: Professional qualifications — CA, CFA, ICAI, ICSI
  if (inst.includes("icai") || inst.includes("icsi") || inst.includes("icmai") ||
      deg === "ca" || deg.startsWith("ca ") || deg.includes("chartered accountant") ||
      deg.includes("cfa") || deg.includes("cma") || deg.includes("cs")) {
    return Response.json({
      verified: true, institution, degree, year, grade,
      grade_inflation_detected: false, certificate_authentic: true,
      note: "Professional qualification verified via regulatory body registry",
      source: "ICAI / Professional Bodies",
    });
  }

  // CLEAN: All other candidates — verified as declared, no fraud
  return Response.json({
    verified: true,
    institution: institution || "As Declared",
    degree: degree || "As Declared",
    year: year || "As Declared",
    grade: grade || "As Declared",
    grade_inflation_detected: false,
    certificate_authentic: true,
    source: "NAD / UGC",
  });
}
