"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const DEMO_EMAIL    = "hr@verifai.com";
const DEMO_PASSWORD = "verifai2025";

export default function HRLogin() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        localStorage.setItem("hr_logged_in", "true");
        sessionStorage.setItem("hr_logged_in", "true");
        router.push("/hr");
      } else {
        setError("Invalid email or password.");
        setLoading(false);
      }
    }, 800);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#14532d] to-[#16a34a] flex flex-col">
      {/* Nav */}
      <div className="flex justify-between px-8 py-4">
        <Link href="/" className="text-2xl font-bold text-white">Verif<span className="text-green-300">AI</span></Link>
        <Link href="/" className="text-green-200 text-sm hover:text-white">← Home</Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className="text-3xl mb-2">🏢</div>
            <h2 className="text-xl font-bold text-[#14532d]">HR Login</h2>
            <p className="text-gray-400 text-sm mt-1">Track candidate BGV submissions</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="hr@verifai.com" required
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
            </div>
            {error && <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-[#16a34a] text-white py-3 rounded-lg font-semibold hover:bg-[#14532d] transition disabled:opacity-50">
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <div className="mt-5 bg-green-50 rounded-xl p-4 border border-green-100">
            <p className="text-xs font-bold text-green-700 mb-1">Demo Credentials</p>
            <p className="text-xs text-gray-500">Email: <span className="font-mono text-gray-700">hr@verifai.com</span></p>
            <p className="text-xs text-gray-500">Password: <span className="font-mono text-gray-700">verifai2025</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
