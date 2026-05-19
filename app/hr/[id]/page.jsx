"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const STEPS = ["identity", "employment", "education", "reference", "risk"];

export default function CandidateDetail() {
  const { id } = useParams();
  const router  = useRouter();
  const [candidate, setCandidate]   = useState(null);
  const [checks, setChecks]         = useState([]);
  const [report, setReport]         = useState(null);
  const [running, setRunning]       = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [sendEmail, setSendEmail]   = useState(false);
  const [hiringEmail, setHiringEmail] = useState("");
  const [sending, setSending]       = useState(false);
  const [sent, setSent]             = useState(false);
  const [loading, setLoading]       = useState(true);
  const [debugLog, setDebugLog]     = useState([]);
  const [showDebug, setShowDebug]   = useState(false);

  function addLog(msg) {
    const time = new Date().toLocaleTimeString();
    console.log("[VerifAI] " + msg);
    setDebugLog(prev => [(time + ": " + msg), ...prev].slice(0, 30));
  }

  async function fetchStatus() {
    try {
      const res  = await fetch("/api/bgv/status/" + id, { cache: "no-store" });
      const json = await res.json();
      const status = json.candidate ? json.candidate.status : "unknown";
      const checksCount = (json.checks || []).length;
      const hasReport = !!json.report;
      addLog("Supabase: status=" + status + " checks=" + checksCount + " report=" + hasReport);
      setCandidate(json.candidate || null);
      setChecks(json.checks || []);
      setReport(json.report || null);
      setLoading(false);
      return json;
    } catch(err) {
      addLog("fetchStatus ERROR: " + err.message);
      setLoading(false);
      return {};
    }
  }

  useEffect(() => {
    const loggedIn = localStorage.getItem("hr_logged_in") || sessionStorage.getItem("hr_logged_in");
    if (!loggedIn) { router.push("/hr/login"); return; }
    fetchStatus();
    const interval = setInterval(async () => {
      const json = await fetchStatus();
      if (json && json.candidate && json.candidate.status === "complete") {
        clearInterval(interval);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [id]);

  const isComplete = candidate && candidate.status === "complete";
  const hasChecks  = checks.length > 0;

  async function runBGV() {
    addLog("Starting BGV...");
    setRunning(true);
    for (const step of STEPS) {
      setCurrentStep(step);
      addLog("Running step: " + step);
      try {
        const res  = await fetch("/api/bgv/run", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ candidateId: id, step }),
        });
        const json = await res.json();
        addLog("Step " + step + " response: success=" + json.success + " status=" + (json.status || "?"));
      } catch (err) {
        addLog("Step " + step + " ERROR: " + err.message);
      }
      const fresh = await fetchStatus();
      addLog("After " + step + ": candidate.status=" + (fresh && fresh.candidate ? fresh.candidate.status : "null"));
    }
    setRunning(false);
    setCurrentStep(null);
    addLog("All steps done. Final fetch...");
    await fetchStatus();
  }

  async function handleSendReport() {
    if (!hiringEmail) return alert("Please enter hiring manager email.");
    setSending(true);
    await fetch("/api/bgv/notify", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidateId: id, email: hiringEmail }),
    });
    setSending(false);
    setSent(true);
    setSendEmail(false);
  }

  async function downloadPDF() {
    if (!isComplete || !report) {
      alert("Verification must be complete before downloading.");
      return;
    }
    try {
      if (!window.jspdf) {
        await new Promise((res, rej) => {
          const s = document.createElement("script");
          s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
          s.onload = res; s.onerror = rej;
          document.head.appendChild(s);
        });
        await new Promise((res, rej) => {
          const s = document.createElement("script");
          s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js";
          s.onload = res; s.onerror = rej;
          document.head.appendChild(s);
        });
      }
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      doc.setFillColor(20,83,45); doc.rect(0,0,210,28,"F");
      doc.setTextColor(255,255,255);
      doc.setFontSize(20); doc.setFont("helvetica","bold"); doc.text("VerifAI",14,12);
      doc.setFontSize(10); doc.setFont("helvetica","normal");
      doc.text("Background Verification Report - CONFIDENTIAL",14,20);
      doc.text("Date: " + new Date().toLocaleDateString("en-IN"),150,20);

      doc.setTextColor(20,83,45); doc.setFontSize(13); doc.setFont("helvetica","bold");
      doc.text("Candidate Information",14,38);
      doc.setTextColor(80,80,80); doc.setFontSize(10); doc.setFont("helvetica","normal");
      doc.text("Name:  " + candidate.full_name,14,46);
      doc.text("Email: " + candidate.email,14,52);
      doc.text("Role:  " + (candidate.job_role||""),14,58);

      const riskLevels = {low:[22,163,74],medium:[180,130,0],high:[180,30,30],critical:[100,0,0]};
      const rc = riskLevels[report.risk_level] || [100,100,100];
      doc.setFillColor(rc[0],rc[1],rc[2]);
      doc.roundedRect(130,38,65,28,3,3,"F");
      doc.setTextColor(255,255,255); doc.setFontSize(9); doc.setFont("helvetica","bold");
      doc.text("OVERALL RISK",162.5,48,{align:"center"});
      doc.setFontSize(15); doc.text((report.risk_level||"").toUpperCase(),162.5,58,{align:"center"});

      doc.setTextColor(20,83,45); doc.setFontSize(12); doc.setFont("helvetica","bold");
      doc.text("Verification Check Results",14,78);
      doc.autoTable({
        startY:82,
        head:[["Check","Result","Severity","Summary"]],
        body:["identity","employment","education","reference"].map(function(t){
          const c=checks.find(function(x){return x.check_type===t;});
          return [
            t.charAt(0).toUpperCase()+t.slice(1),
            c ? c.status.toUpperCase() : "PENDING",
            c ? (c.severity||"").toUpperCase() : "",
            c ? (c.summary||"") : ""
          ];
        }),
        headStyles:{fillColor:[20,83,45],textColor:255,fontStyle:"bold"},
        alternateRowStyles:{fillColor:[240,253,244]},
        styles:{fontSize:9,cellPadding:4},
      });

      if (report.discrepancies && report.discrepancies.length > 0) {
        const y=doc.lastAutoTable.finalY+10;
        doc.setTextColor(180,30,30); doc.setFontSize(12); doc.setFont("helvetica","bold");
        doc.text("Discrepancies Found",14,y);
        doc.autoTable({
          startY:y+4,
          head:[["Check","Issue","Severity"]],
          body:report.discrepancies.map(function(d){
            return [d.check ? d.check.toUpperCase() : "", d.issue||"", d.severity ? d.severity.toUpperCase() : ""];
          }),
          headStyles:{fillColor:[180,30,30],textColor:255},
          styles:{fontSize:9,cellPadding:4},
        });
      }

      if (report.narrative) {
        const y2=(doc.lastAutoTable ? doc.lastAutoTable.finalY : 140)+10;
        if (y2<230) {
          doc.setTextColor(20,83,45); doc.setFontSize(12); doc.setFont("helvetica","bold");
          doc.text("BGV Report Narrative",14,y2);
          doc.setTextColor(80,80,80); doc.setFontSize(9); doc.setFont("helvetica","normal");
          doc.text(doc.splitTextToSize(report.narrative,182),14,y2+8);
        }
      }

      doc.setFillColor(240,253,244); doc.rect(0,272,210,25,"F");
      doc.setTextColor(20,83,45); doc.setFontSize(12); doc.setFont("helvetica","bold");
      doc.text("HR Recommendation: " + (report.recommendation||""),14,283);
      doc.setTextColor(150,150,150); doc.setFontSize(7); doc.setFont("helvetica","normal");
      doc.text("VerifAI - Tiger Analytics - Ref: " + candidate.id,14,291);

      doc.save("VerifAI_BGV_" + candidate.full_name.replace(/ /g,"_") + "_CONFIDENTIAL.pdf");
    } catch(err) {
      alert("PDF error: " + err.message);
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  );

  const riskColorMap = {
    low:"bg-green-100 text-green-700 border-green-200",
    medium:"bg-yellow-100 text-yellow-700 border-yellow-200",
    high:"bg-red-100 text-red-700 border-red-200",
    critical:"bg-red-200 text-red-900 border-red-300",
  };
  const riskColor = report && report.risk_level ? (riskColorMap[report.risk_level]||"") : "";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#14532d] text-white px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Verif<span className="text-green-300">AI</span>
          <span className="font-normal text-sm text-green-200 ml-2">BGV Report</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-green-300 text-sm hover:text-white">Home</Link>
          <Link href="/hr" className="text-green-200 text-sm hover:text-white">Dashboard</Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">

        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#14532d]">{candidate && candidate.full_name}</h2>
              <p className="text-gray-400 text-sm mt-1">{candidate && candidate.email} · {candidate && candidate.job_role}</p>
              <p className="text-xs text-gray-300 mt-1">Ref: {candidate && candidate.id}</p>
              <p className="text-xs text-gray-400 mt-1">
                Submitted: {candidate && new Date(candidate.created_at).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}
              </p>
              <div className="mt-3">
                {isComplete
                  ? <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">Verification Complete</span>
                  : running
                  ? <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">Running: {currentStep}...</span>
                  : <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full">Yet to Start</span>
                }
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              {isComplete && report && report.risk_level && (
                <span className={"px-4 py-2 rounded-full text-sm font-bold capitalize border " + riskColor}>
                  {report.risk_level} Risk
                </span>
              )}
              <div className="flex gap-2 flex-wrap justify-end">
                {!isComplete && !running && (
                  <button onClick={runBGV} className="px-5 py-2 bg-[#16a34a] text-white text-sm rounded-lg font-semibold hover:bg-[#14532d] transition">
                    Start Verification
                  </button>
                )}
                {running && (
                  <div className="px-4 py-2 bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm rounded-lg font-semibold">
                    Checking {currentStep}...
                  </div>
                )}
                {isComplete && (
                  <>
                    <button onClick={downloadPDF} className="px-4 py-2 bg-[#14532d] text-white text-sm rounded-lg font-semibold hover:bg-[#16a34a] transition">
                      Download PDF
                    </button>
                    <button onClick={function(){setSendEmail(true);}} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg font-semibold hover:bg-blue-700 transition">
                      Send to Hiring Manager
                    </button>
                    <a href={"/hr/interview/" + id} className="px-4 py-2 bg-amber-500 text-white text-sm rounded-lg font-semibold hover:bg-amber-600 transition">
                      Interview Check
                    </a>
                  </>
                )}
              </div>
              {sent && <p className="text-xs text-green-600 font-semibold">Report sent</p>}
            </div>
          </div>
        </div>

        {sendEmail && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="font-bold text-blue-800 mb-3">Send BGV Report to Hiring Manager</h3>
            <div className="flex gap-3">
              <input type="email" value={hiringEmail} onChange={function(e){setHiringEmail(e.target.value);}}
                placeholder="hiringmanager@tigeranalytics.com"
                className="flex-1 border border-blue-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"/>
              <button onClick={handleSendReport} disabled={sending}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
                {sending ? "Sending..." : "Send"}
              </button>
              <button onClick={function(){setSendEmail(false);}} className="px-4 py-2 border border-gray-200 text-gray-500 rounded-lg text-sm">Cancel</button>
            </div>
          </div>
        )}

        {running && (
          <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
            <p className="font-bold text-[#14532d] mb-3">AI Agents Running - Keep this page open</p>
            <div className="flex gap-2">
              {["identity","employment","education","reference"].map(function(s){
                const c=checks.find(function(x){return x.check_type===s;});
                const isDone=c && !!c.completed_at;
                const isNow=currentStep===s;
                return (
                  <div key={s} className={"flex-1 text-center py-2 rounded-lg text-xs font-semibold capitalize " + (isDone ? "bg-green-200 text-green-800" : isNow ? "bg-yellow-200 text-yellow-800" : "bg-gray-100 text-gray-400")}>
                    {isDone ? "Done" : isNow ? "Running" : "Waiting"} - {s}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {hasChecks && (
          <div className="grid grid-cols-2 gap-4">
            {["identity","employment","education","reference"].map(function(type){
              const c=checks.find(function(x){return x.check_type===type;});
              if (!c) return null;
              return (
                <div key={type} className={"bg-white rounded-xl shadow-sm p-5 border-l-4 " + (c.status==="passed" ? "border-green-400" : c.status==="flagged" ? "border-red-400" : "border-gray-200")}>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-2 font-semibold">{type} Check</p>
                  <div className="flex items-center gap-2 mb-1">
                    {c.status==="passed"
                      ? <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">Passed</span>
                      : <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-bold">Flagged</span>
                    }
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{c.summary}</p>
                </div>
              );
            })}
          </div>
        )}

        {isComplete && report && report.discrepancies && report.discrepancies.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <h3 className="font-bold text-red-700 mb-4">Discrepancies Found ({report.discrepancies.length})</h3>
            <div className="space-y-3">
              {report.discrepancies.map(function(d,i){
                return (
                  <div key={i} className="bg-white rounded-xl p-4 flex items-start gap-3 border border-red-100">
                    <span className={"px-2 py-1 rounded text-xs font-bold uppercase shrink-0 " + (d.severity==="critical" ? "bg-red-700 text-white" : d.severity==="high" ? "bg-red-200 text-red-800" : "bg-yellow-100 text-yellow-800")}>{d.severity}</span>
                    <div>
                      <p className="font-semibold text-gray-700 text-sm capitalize">{d.check} Check</p>
                      <p className="text-gray-500 text-sm mt-0.5">{d.issue}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {isComplete && report && report.positive_findings && report.positive_findings.length > 0 && (
          <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
            <h3 className="font-bold text-green-700 mb-3">Verified Successfully</h3>
            <ul className="space-y-1">
              {report.positive_findings.map(function(f,i){
                return <li key={i} className="text-sm text-green-700">- {f}</li>;
              })}
            </ul>
          </div>
        )}

        {isComplete && report && report.narrative && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="font-bold text-[#14532d] mb-3">AI-Generated BGV Narrative</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
          {typeof report.narrative === "string"
            ? report.narrative
            : report.narrative?.paragraph1
            ? report.narrative.paragraph1 + " " + (report.narrative.paragraph2 || "")
            : JSON.stringify(report.narrative)}
        </p>
          </div>
        )}

        {isComplete && report && report.recommendation && (
          <div className={"rounded-2xl p-6 border-2 " + (report.recommendation==="Candidate Cleared" ? "bg-green-50 border-green-300" : report.recommendation==="Further Review Needed" ? "bg-yellow-50 border-yellow-300" : "bg-red-50 border-red-300")}>
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">BGV Outcome</p>
            <p className={"text-2xl font-bold " + (report.recommendation==="Candidate Cleared" ? "text-green-700" : report.recommendation==="Further Review Needed" ? "text-yellow-700" : "text-red-700")}>
              {report.recommendation}
            </p>
          </div>
        )}

        {!hasChecks && !running && (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center">
            <p className="text-5xl mb-4">🤖</p>
            <p className="font-bold text-[#14532d] text-lg mb-2">Verification Not Started</p>
            <p className="text-gray-400 text-sm mb-6">Click below to run AI-powered background verification.</p>
            <button onClick={runBGV} className="px-10 py-3 bg-[#16a34a] text-white rounded-xl font-semibold hover:bg-[#14532d] transition">
              Start Verification
            </button>
          </div>
        )}

        <div className="mt-4 pb-8">
          <button onClick={function(){setShowDebug(!showDebug);}}
            className="text-xs text-gray-400 hover:text-gray-600 underline">
            {showDebug ? "Hide" : "Show"} Debug Log ({debugLog.length} entries)
          </button>
          {showDebug && (
            <div className="mt-2 bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 max-h-48 overflow-y-auto">
              {debugLog.length === 0
                ? <p className="text-gray-500">No logs yet - click Start Verification</p>
                : debugLog.map(function(l,i){ return <p key={i}>{l}</p>; })
              }
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
