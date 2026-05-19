export async function POST(request) {
  const { company } = await request.json();
  await new Promise(r => setTimeout(r, 200));

  const co = (company || "").toLowerCase();

  // FRAUD: Ravi Kumar scenario — fake company
  if (co.includes("fake corp") || co.includes("fakecorp") || co.includes("fake corp solutions")) {
    return Response.json({
      verified: false, company,
      status: "NOT_FOUND",
      message: "Company not found in MCA21 registry",
      source: "MCA21",
    });
  }

  // FRAUD: Deepika Reddy scenario — BrandBoost is fake
  if (co.includes("brandboost")) {
    return Response.json({
      verified: false, company,
      status: "NOT_FOUND",
      message: "Company not found in MCA21 registry",
      source: "MCA21",
    });
  }

  // CLEAN: All other companies — verified
  return Response.json({
    verified: true, company,
    cin: "U72900KA2015PTC082754",
    status: "ACTIVE",
    incorporation_date: "2015-03-15",
    registered_address: "India",
    source: "MCA21",
  });
}
