import Link from 'next/link';
import { Mic, Zap, MessageSquare, User, Sparkles } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 selection:bg-amber-500/30 selection:text-amber-200">
      <header className="w-full flex items-center justify-between px-6 py-4 md:px-12 md:py-6 border-b border-zinc-800 bg-zinc-950">
        <div className="font-display text-3xl font-semibold tracking-tight text-amber-500">Vaani</div>
        <div className="flex gap-4">
          <Link href="/login" className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-50 transition-colors duration-150">
            Sign in
          </Link>
          <Link href="/signup" className="px-4 py-2 text-sm font-medium bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors duration-150">
            Get started
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center pt-24 pb-12 px-6">
        <div className="max-w-3xl text-center">
          <h1 className="font-display font-medium text-5xl md:text-7xl text-zinc-50 mb-6 leading-tight tracking-tight">
            Speak your career question.<br />Get an answer in seconds.
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
            Vaani is a voice-first AI career coach for students in India. Ask in English or Hindi, and get direct, practical advice instantly.
          </p>
          <Link href="/signup" className="inline-flex items-center justify-center px-6 py-3 text-base font-medium bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors duration-150 ring-offset-2 ring-offset-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 shadow-[0_0_20px_rgba(217,119,6,0.3)]">
            Start talking now
          </Link>
        </div>

        <div className="mt-32 max-w-5xl w-full grid md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mb-4">
              <Mic size={24} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-medium text-zinc-50 mb-2">1. Ask aloud</h3>
            <p className="text-zinc-400">Speak your question directly into your device in English or Hindi. No typing required.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mb-4">
              <Zap size={24} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-medium text-zinc-50 mb-2">2. Instant advice</h3>
            <p className="text-zinc-400">Vaani analyzes your question and provides actionable, personalized career steps.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mb-4">
              <MessageSquare size={24} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-medium text-zinc-50 mb-2">3. Listen back</h3>
            <p className="text-zinc-400">Hear the response spoken back to you, and save the session to revisit later.</p>
          </div>
        </div>

        <div className="mt-32 max-w-2xl w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl shadow-black/50">
          <div className="text-sm font-medium text-zinc-500 mb-6 uppercase tracking-wider">Example Session</div>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 p-5 rounded-2xl bg-zinc-800/50">
              <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0 mt-1">
                <User size={16} className="text-zinc-400" />
              </div>
              <div className="text-zinc-50 text-lg leading-relaxed pt-1">
                "I am in 12th commerce but I don't want to do CA. What are my options?"
              </div>
            </div>
            
            <div className="flex gap-4 p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                <Sparkles size={16} className="text-amber-500" />
              </div>
              <div className="text-zinc-300 leading-relaxed pt-1">
                <p className="mb-3 text-zinc-50">It is completely fine to skip CA if it doesn't align with your interests. Commerce opens many other strong career paths.</p>
                <p className="mb-3">First, look into BBA (Bachelor of Business Administration) if you want to enter management or marketing. Second, consider B.Com(Hons) and pair it with a specialized certification like CMA or CFA later. Third, data analytics in finance is growing rapidly, so exploring basic data courses could give you an edge.</p>
                <p>Which of these areas—management, pure finance, or data—sounds most interesting to you right now?</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-8 text-center text-zinc-600 text-sm border-t border-zinc-800 mt-20">
        © {new Date().getFullYear()} Vaani. Built for the Voice & Conversational Intelligence Hackathon.
      </footer>
    </div>
  );
}
