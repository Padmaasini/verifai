import { z } from "zod";

const InterviewFraudSchema = z.object({
  face_match:                    z.boolean(),
  face_match_confidence:         z.number(),
  same_person_likely:            z.boolean(),
  pre_recorded_video_detected:   z.boolean(),
  pre_recorded_confidence:       z.number(),
  lip_sync_anomaly:              z.boolean(),
  screen_within_screen_detected: z.boolean(),
  lighting_inconsistency:        z.boolean(),
  fraud_indicators:              z.array(z.string()),
  overall_status:                z.enum(["clear", "suspicious", "fraud_detected"]),
  severity:                      z.enum(["low", "medium", "high", "critical"]),
  summary:                       z.string(),
});

const PROMPT = `You are an Interview Fraud Detection Agent for a Background Verification system.
Analyse the provided interview image for fraud indicators:
1. FACE MATCH: Does the face match the ID photo?
2. PRE-RECORDED VIDEO: Look for screen bezels, reflections, pixelation.
3. LIP SYNC: Do lips move naturally and in sync with speech?
4. SCREEN-WITHIN-SCREEN: Is there a laptop/phone screen visible?
5. LIGHTING: Is lighting consistent with a live video call?

Candidate: {candidate_name}`;

export async function runInterviewFraudAgent(interviewImageBase64, idImageBase64, candidateName) {
  if (!interviewImageBase64) {
    return {
      check_type: "interview_fraud",
      status:     "pending",
      severity:   "low",
      result:     { message: "No interview media provided." },
      summary:    "Interview fraud check skipped — no media uploaded.",
    };
  }

  try {
    // Lazy import — only loads when actually called, not at build time
    const { runVisionChain } = await import("../lib/langchain.js");

    const analysis = await runVisionChain(
      PROMPT.replace("{candidate_name}", candidateName || "Unknown"),
      interviewImageBase64,
      "image/jpeg",
      InterviewFraudSchema
    );

    const isFraud = analysis.overall_status === "fraud_detected" || analysis.pre_recorded_video_detected;

    return {
      check_type: "interview_fraud",
      status:     isFraud ? "flagged" : analysis.overall_status === "suspicious" ? "flagged" : "passed",
      severity:   analysis.severity || "medium",
      result:     analysis,
      summary:    analysis.summary || "Interview fraud analysis complete.",
    };
  } catch (err) {
    console.error("[Interview Fraud Agent]", err);
    return {
      check_type: "interview_fraud",
      status:     "flagged",
      severity:   "medium",
      result:     { error: err.message },
      summary:    "Interview fraud analysis could not be completed.",
    };
  }
}
