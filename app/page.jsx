import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#14532d] to-[#16a34a] flex flex-col">

      {/* HR Login - top right */}
      <div className="flex justify-end px-8 py-4">
        <Link href="/hr/login" className="text-green-200 text-sm hover:text-white transition flex items-center gap-1">
          🔒 HR Login
        </Link>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-20">

        {/* Logo */}
        <div className="mb-6 text-center">
          <h1 className="text-7xl font-bold text-white tracking-tight">
            Verif<span className="text-green-300">AI</span>
          </h1>
          <p className="text-green-100 text-sm mt-2 opacity-80">Tiger Analytics</p>
        </div>

        {/* Main headline */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-white mb-3">
            Let's Get You Onboarded! 🚀
          </h2>
          <p className="text-green-100 text-xl">
            Your new team is waiting — let's verify your details first
          </p>
        </div>

        {/* CTA Button */}
        <Link
          href="/candidate"
          className="bg-white text-[#14532d] px-14 py-5 rounded-2xl text-xl font-bold shadow-2xl hover:-translate-y-1 transition-all"
        >
          Start Verification →
        </Link>

        <p className="text-green-200 text-sm mt-5">
          Takes less than 5 minutes · Secure · Confidential
        </p>

        {/* 3 steps */}
        <div className="flex gap-10 mt-14 text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white/20 text-white font-bold text-lg flex items-center justify-center">1</div>
            <p className="text-green-100 text-sm max-w-[100px]">Fill your details</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white/20 text-white font-bold text-lg flex items-center justify-center">2</div>
            <p className="text-green-100 text-sm max-w-[100px]">AI verifies instantly</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white/20 text-white font-bold text-lg flex items-center justify-center">3</div>
            <p className="text-green-100 text-sm max-w-[100px]">HR gets your report</p>
          </div>
        </div>
      </div>

      <p className="text-center text-green-400 text-xs pb-4 opacity-60">
        VerifAI · Hackathon 2025 · AI-Powered Background Verification
      </p>
    </div>
  );
}
