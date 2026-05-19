/**
 * Mock DigiLocker Gateway API
 * Returns verified government documents for a given Aadhaar number.
 */
export async function POST(request) {
  const body = await request.json();
  await new Promise((r) => setTimeout(r, 400));

  return Response.json({
    status: "authentic",
    documents: [
      { type: "PAN_CARD",          authentic: true,  issued: "2017-03-15" },
      { type: "AADHAAR",           authentic: true,  issued: "2015-06-20" },
      { type: "DRIVING_LICENCE",   authentic: true,  issued: "2020-09-10" },
    ],
    source: "DigiLocker",
  });
}
