"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function StatusContent() {
  const params = useSearchParams();
  const id = params.get("id");
  const [submitted, setSubmitted] = useState(true);

  // Just show thank you — no polling needed
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#14532d] to-[#16a34a] flex flex-col">
      <div className="flex justify-between px-8 py-4">
        <Link href="/" className="text-2xl font-bold text-white">Verif<span className="text-green-300">AI</span></Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
          <div className="text-6xl mb-5">🎉</div>
          <h2 className="text-2xl font-bold text-[#14532d] mb-3">
            You're all set!
          </h2>
          <p className="text-gray-500 mb-2">
            Your details have been submitted successfully.
          </p>
          <p className="text-gray-400 text-sm mb-6">
            Our AI agents are now verifying your background. HR will be notified once the report is ready. You don't need to do anything else.
          </p>
          <div className="bg-green-50 rounded-xl p-4 mb-6">
            <p className="text-xs text-green-700 font-semibold">Reference ID</p>
            <p className="text-xs font-mono text-gray-500 mt-1 break-all">{id}</p>
          </div>
          <Link href="/"
            className="block w-full py-3 bg-[#16a34a] text-white rounded-xl font-semibold hover:bg-[#14532d] transition text-sm">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CandidateStatus() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#14532d] to-[#16a34a] flex items-center justify-center">
        <p className="text-white text-lg">Loading...</p>
      </div>
    }>
      <StatusContent />
    </Suspense>
  );
}
