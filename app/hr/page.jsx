"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase.js";

export default function HRDashboard() {
  const router = useRouter();
  const [candidates, setCandidates]   = useState([]);
  const [reports, setReports]         = useState({});
  const [loading, setLoading]         = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab]     = useState("active"); // "active" | "cleared"
  const [archiving, setArchiving]     = useState(null);

  useEffect(() => {
    const loggedIn = localStorage.getItem("hr_logged_in") || sessionStorage.getItem("hr_logged_in");
    if (!loggedIn) { router.push("/hr/login"); return; }
    setAuthChecked(true);

    async function load() {
      const { data: cands } = await supabase
        .from("candidates").select("*").order("created_at", { ascending: false });
      const { data: reps } = await supabase.from("bgv_reports").select("*");
      setCandidates(cands || []);
      const repMap = {};
      (reps || []).forEach(r => { repMap[r.candidate_id] = r; });
      setReports(repMap);
      setLoading(false);
    }
    load();
    const interval = setInterval(load, 8000);
    return () => clearInterval(interval);
  }, []);

  function handleLogout() {
    localStorage.removeItem("hr_logged_in");
    sessionStorage.removeItem("hr_logged_in");
    router.push("/hr/login");
  }

  async function resetAll() {
    if (!confirm("This will permanently delete ALL candidate data and BGV records. Are you sure?")) return;
    const res = await fetch("/api/bgv/reset", { method: "POST" });
    const json = await res.json();
    if (json.success) {
      setCandidates([]);
      setReports({});
      alert("All data cleared successfully.");
    } else {
      alert("Reset failed: " + json.error);
    }
  }

  async function handleArchive(candidate) {
    const reason = prompt(`Archive ${candidate.full_name}?\n\nReason (optional):`, "BGV cleared — proceeding with offer");
    if (reason === null) return; // cancelled
    setArchiving(candidate.id);
    await fetch("/api/bgv/archive", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidateId: candidate.id, reason }),
    });
    setCandidates(prev => prev.map(c => c.id === candidate.id ? { ...c, archived: true, archive_reason: reason } : c));
    setArchiving(null);
  }

  async function handleUnarchive(candidate) {
    setArchiving(candidate.id);
    await fetch("/api/bgv/archive", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidateId: candidate.id }),
    });
    setCandidates(prev => prev.map(c => c.id === candidate.id ? { ...c, archived: false } : c));
    setArchiving(null);
  }

  if (!authChecked) return null;

  const active  = candidates.filter(c => !c.archived);
  const cleared = candidates.filter(c => c.archived);
  const shown   = activeTab === "active" ? active : cleared;

  const stats = {
    total:     active.length,
    complete:  active.filter(c => c.status === "complete").length,
    processing:active.filter(c => c.status === "processing").length,
    high_risk: Object.values(reports).filter(r => r.risk_level === "high" || r.risk_level === "critical").length,
    cleared:   cleared.length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <div className="bg-[#14532d] text-white px-6 py-4 flex items-center justify-between shadow">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-bold hover:text-green-300 transition">
            Verif<span className="text-green-300">AI</span>
          </Link>
          <span className="text-green-300 text-sm">/ HR Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-green-200 text-sm hidden sm:block">hr@verifai.com</span>
          <button onClick={handleLogout}
            className="text-green-300 text-sm hover:text-white border border-green-600 px-3 py-1 rounded-lg transition">
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          <StatCard label="Active"      value={stats.total}      color="green"  icon="👥" />
          <StatCard label="Completed"   value={stats.complete}   color="teal"   icon="✅" />
          <StatCard label="Processing"  value={stats.processing} color="yellow" icon="⏳" />
          <StatCard label="High Risk"   value={stats.high_risk}  color="red"    icon="⚠️" />
          <StatCard label="Cleared"     value={stats.cleared}    color="gray"   icon="📁" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button onClick={() => setActiveTab("active")}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition ${activeTab === "active" ? "bg-[#14532d] text-white" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}>
            Active Candidates ({active.length})
          </button>
          <button onClick={() => setActiveTab("cleared")}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition ${activeTab === "cleared" ? "bg-[#14532d] text-white" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}>
            📁 Cleared / Archived ({cleared.length})
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-[#14532d]">
              {activeTab === "active" ? "Candidate Submissions" : "Cleared Candidates"}
            </h2>
            <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">Auto-refreshing every 8s</span>
            <button onClick={resetAll}
              className="text-xs px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition font-semibold">
              🗑 Remove Previous Runs
            </button>
          </div>
          </div>

          {loading ? (
            <div className="text-center py-16"><div className="text-4xl mb-3">⏳</div><p className="text-gray-400">Loading...</p></div>
          ) : shown.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">{activeTab === "active" ? "📭" : "📁"}</p>
              <p className="mb-2 font-semibold">{activeTab === "active" ? "No active submissions" : "No archived candidates yet"}</p>
              {activeTab === "active" && <Link href="/" className="text-[#16a34a] text-sm hover:underline font-semibold">Go to Home →</Link>}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs uppercase tracking-wide text-gray-400">
                    <th className="text-left px-6 py-3">Candidate</th>
                    <th className="text-left px-6 py-3">Role</th>
                    <th className="text-left px-6 py-3">Submitted</th>
                    <th className="text-left px-6 py-3">Status</th>
                    <th className="text-left px-6 py-3">Risk</th>
                    <th className="text-left px-6 py-3">Recommendation</th>
                    <th className="text-left px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((c, i) => {
                    const rep = reports[c.id];
                    return (
                      <tr key={c.id} className={`border-t border-gray-50 hover:bg-green-50 transition ${i % 2 === 1 ? "bg-gray-50/50" : ""}`}>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-800">{c.full_name}</p>
                          <p className="text-gray-400 text-xs">{c.email}</p>
                          {c.archived && c.archive_reason && (
                            <p className="text-xs text-green-600 mt-0.5">📁 {c.archive_reason}</p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-600">{c.job_role || "—"}</td>
                        <td className="px-6 py-4 text-gray-400 text-xs">{new Date(c.created_at).toLocaleDateString("en-IN")}</td>
                        <td className="px-6 py-4"><StatusBadge status={c.status} /></td>
                        <td className="px-6 py-4"><RiskBadge level={rep?.risk_level} /></td>
                        <td className="px-6 py-4 text-xs text-gray-600 max-w-[140px] truncate">{rep?.recommendation ? <RecommendationBadge rec={rep.recommendation} /> : <span className="text-gray-300">—</span>}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 items-center">
                            <Link href={`/hr/${c.id}`} className="text-[#16a34a] text-xs font-semibold hover:underline">View →</Link>
                            {!c.archived && c.status === "complete" && (
                              <button
                                onClick={() => handleArchive(c)}
                                disabled={archiving === c.id}
                                className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-green-100 hover:text-green-700 transition disabled:opacity-50"
                              >
                                {archiving === c.id ? "..." : "📁 Archive"}
                              </button>
                            )}
                            {c.archived && (
                              <button
                                onClick={() => handleUnarchive(c)}
                                disabled={archiving === c.id}
                                className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
                              >
                                {archiving === c.id ? "..." : "↩ Restore"}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Archive info */}
        <p className="text-xs text-gray-400 mt-3 text-center">
          📁 Archiving moves candidates to the Cleared tab — records are retained for compliance audit purposes
        </p>
      </div>
    </div>
  );
}

function RecommendationBadge({ rec }) {
  if (rec === "Candidate Cleared") return <span className="text-green-700 font-semibold text-xs">✓ Clear</span>;
  if (rec === "Further Review Needed")    return <span className="text-yellow-700 font-semibold text-xs">⚠ Review</span>;
  if (rec === "Do Not Onboard")     return <span className="text-red-700 font-semibold text-xs">✗ Do Not Onboard</span>;
  return <span className="text-gray-400 text-xs">{rec}</span>;
}

function StatCard({ label, value, color, icon }) {
  const colors = { green:"bg-green-50 text-green-800 border-green-100", teal:"bg-teal-50 text-teal-700 border-teal-100", yellow:"bg-yellow-50 text-yellow-700 border-yellow-100", red:"bg-red-50 text-red-700 border-red-100", gray:"bg-gray-50 text-gray-700 border-gray-200" };
  return (
    <div className={`rounded-xl border p-4 ${colors[color]}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xl">{icon}</span>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <p className="text-xs opacity-70">{label}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  if (status === "complete")   return <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">✓ Complete</span>;
  if (status === "processing") return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">⏳ Processing</span>;
  return <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs">Yet to Start</span>;
}

function RiskBadge({ level }) {
  if (!level) return <span className="text-gray-300 text-xs">—</span>;
  const map = { low:"bg-green-100 text-green-700", medium:"bg-yellow-100 text-yellow-700", high:"bg-red-100 text-red-700", critical:"bg-red-200 text-red-900" };
  return <span className={`px-2 py-1 rounded-full text-xs font-bold capitalize ${map[level]||""}`}>{level}</span>;
}
