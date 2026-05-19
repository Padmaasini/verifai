export async function POST(request) {
  const { aadhaar, pan } = await request.json();
  await new Promise(r => setTimeout(r, 200));

  // FRAUD: Karthik Nair — address mismatch
  if (aadhaar === "321032103210") {
    return Response.json({
      status: "verified",
      name_match: true,
      dob_match: true,
      address_match: false,
      registered_address: "7 Thiruvananthapuram, Kerala 695001",
      submitted_address: "14 Powai, Mumbai 400076",
      address_mismatch_detected: true,
      source: "UIDAI",
    });
  }

  // CLEAN: All others — verified
  return Response.json({
    status: "verified",
    name_match: true,
    dob_match: true,
    address_match: true,
    address_mismatch_detected: false,
    source: "UIDAI",
  });
}
