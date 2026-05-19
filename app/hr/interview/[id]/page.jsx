"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function InterviewUpload() {
  const { id } = useParams();
  const router = useRouter();
  const [candidate, setCandidate] = useState(null);
  const [interviewFile, setInterviewFile] = useState(null);
  const [idFile, setIdFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !sessionStorage.getItem("hr_logged_in")) {
      router.push("/hr/login");
    }
    fetch(`/api/bgv/status/${id}`).then(r => r.json()).then(d => setCandidate(d.candidate));
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!interviewFile) return alert("Please upload the interview recording.");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("candidateId", id);
      fd.append("interviewFile", interviewFile);
      if (idFile) fd.append("idFile", idFile);

      const res = await fetch("/api/bgv/interview", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) setResult(data.result);
      else alert("Error: " + data.error);
    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#14532d] text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Verif<span className="text-green-300">AI</span> <span className="font-normal text-sm text-green-200 ml-2">Interview Fraud Check</span></h1>
        <Link href={`/hr/${id}`} className="text-green-200 text-sm hover:text-white">← Back to Report</Link>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* Candidate info */}
        {candidate && (
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <p className="text-xs text-gray-400 mb-1">Checking interview for</p>
            <h2 className="text-xl font-bold text-[#14532d]">{candidate.full_name}</h2>
            <p className="text-sm text-gray-400">{candidate.email} · {candidate.job_role}</p>
          </div>
        )}

        {/* What we check */}
        <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
          <h3 className="font-bold text-[#14532d] mb-3">What VerifAI checks in the interview recording:</h3>
          <div className="space-y-2">
            {[
              ["🎭", "Face Match", "Compares interview face against submitted ID photo to confirm same person"],
              ["🎬", "Pre-recorded Video Detection", "Detects if candidate played a pre-recorded video instead of appearing live"],
              ["👄", "Lip Sync Analysis", "Flags if lip movement does not match the audio — indicates video fraud"],
              ["💡", "Lighting & Screen Analysis", "Detects screen-within-screen artifacts indicating a played video"],
              ["🔄", "Consistency Check", "Ensures the same person appeared throughout the entire interview"],
            ].map(([icon, title, desc]) => (
              <div key={title} className="flex gap-3 bg-white rounded-xl p-3">
                <span className="text-xl">{icon}</span>
                <div>
                  <p className="text-sm font-semibold text-[#14532d]">{title}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upload form */}
        {!result && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6 space-y-5">
            <h3 className="font-bold text-[#14532d]">Upload Interview Media</h3>

            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-green-400 transition">
              <p className="text-2xl mb-2">🎥</p>
              <p className="text-sm font-semibold text-gray-700 mb-1">Interview Recording / Screenshot *</p>
              <p className="text-xs text-gray-400 mb-3">Upload a screenshot from the interview or the recording file</p>
              <label className="cursor-pointer px-4 py-2 bg-[#16a34a] text-white text-sm rounded-lg hover:bg-[#14532d] transition">
                {interviewFile ? `✓ ${interviewFile.name}` : "Choose File"}
                <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.mp4,.webm" onChange={e => { if (e.target.files[0]) setInterviewFile(e.target.files[0]); }} />
              </label>
            </div>

            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-green-400 transition">
              <p className="text-2xl mb-2">🪪</p>
              <p className="text-sm font-semibold text-gray-700 mb-1">Candidate ID Photo (for face match)</p>
              <p className="text-xs text-gray-400 mb-3">Upload candidate's Aadhaar / passport photo for comparison</p>
              <label className="cursor-pointer px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition">
                {idFile ? `✓ ${idFile.name}` : "Choose File (Optional)"}
                <input type="file" className="hidden" accept=".jpg,.jpeg,.png" onChange={e => { if (e.target.files[0]) setIdFile(e.target.files[0]); }} />
              </label>
            </div>

            <button type="submit" disabled={loading || !interviewFile} className="w-full py-3 bg-[#16a34a] text-white rounded-xl font-semibold hover:bg-[#14532d] transition disabled:opacity-50">
              {loading ? "⏳ Analysing with AI..." : "Run Interview Fraud Check →"}
            </button>
          </form>
        )}

        {/* Results */}
        {result && (
          <div className={`bg-white rounded-2xl shadow-md p-6 border-2 ${
            result.status === "passed" ? "border-green-200" :
            result.result?.overall_status === "suspicious" ? "border-yellow-200" : "border-red-200"
          }`}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-[#14532d]">Interview Fraud Analysis Result</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                result.status === "passed" ? "bg-green-100 text-green-700" :
                result.result?.overall_status === "suspicious" ? "bg-yellow-100 text-yellow-700" :
                "bg-red-100 text-red-700"
              }`}>
                {result.status === "passed" ? "✓ Clear" : result.result?.overall_status === "suspicious" ? "⚠ Suspicious" : "🚨 Fraud Detected"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <Check label="Face Match" value={result.result?.face_match} score={result.result?.face_match_confidence} />
              <Check label="Same Person" value={result.result?.same_person_likely} />
              <Check label="Pre-recorded Video" value={!result.result?.pre_recorded_video_detected} invert score={result.result?.pre_recorded_confidence} />
              <Check label="Lip Sync Normal" value={!result.result?.lip_sync_anomaly} invert />
              <Check label="No Screen-in-Screen" value={!result.result?.screen_within_screen_detected} invert />
              <Check label="Lighting Consistent" value={!result.result?.lighting_inconsistency} invert />
            </div>

            {result.result?.fraud_indicators?.length > 0 && (
              <div className="bg-red-50 rounded-xl p-4 mb-4">
                <p className="text-sm font-bold text-red-700 mb-2">⚠ Fraud Indicators Detected:</p>
                <ul className="space-y-1">
                  {result.result.fraud_indicators.map((f, i) => (
                    <li key={i} className="text-sm text-red-600 flex gap-2"><span>•</span>{f}</li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4">{result.summary}</p>

            <div className="flex gap-3 mt-5">
              <Link href={`/hr/${id}`} className="flex-1 text-center py-2 bg-[#16a34a] text-white rounded-lg text-sm font-semibold hover:bg-[#14532d] transition">
                View Full BGV Report →
              </Link>
              <button onClick={() => setResult(null)} className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50">
                Run Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Check({ label, value, score, invert }) {
  const pass = invert ? !value : value;
  return (
    <div className={`rounded-xl p-3 flex items-center justify-between ${pass ? "bg-green-50" : "bg-red-50"}`}>
      <p className="text-xs font-semibold text-gray-700">{label}</p>
      <div className="flex items-center gap-1">
        {score !== undefined && <span className="text-xs text-gray-400">{score}%</span>}
        <span className={`text-sm font-bold ${pass ? "text-green-600" : "text-red-600"}`}>{pass ? "✓" : "✗"}</span>
      </div>
    </div>
  );
}
