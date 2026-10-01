"use client";
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 p-4 selection:bg-amber-500/30 selection:text-amber-200">
      <Link href="/" className="font-display text-4xl font-semibold text-amber-500 mb-8 tracking-tight">Vaani</Link>
      <div className="w-full max-w-md bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-xl shadow-black/50">
        <h1 className="text-2xl font-medium text-zinc-50 mb-6">Create an account</h1>
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1" htmlFor="email">Email</label>
            <input 
              id="email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-shadow duration-150 text-zinc-50 placeholder:text-zinc-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1" htmlFor="password">Password</label>
            <input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-shadow duration-150 text-zinc-50 placeholder:text-zinc-600"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-2 px-4 bg-amber-600 hover:bg-amber-700 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-medium rounded-lg transition-colors duration-150 ring-offset-2 ring-offset-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 shadow-[0_0_15px_rgba(217,119,6,0.2)]"
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
          {error && (
            <p className="mt-4 p-3 bg-red-500/10 text-red-400 text-center text-sm rounded-lg border border-red-500/20">
              {error}
            </p>
          )}
        </form>
        <p className="mt-6 text-center text-sm text-zinc-500">
          Already have an account? <Link href="/login" className="text-amber-500 hover:text-amber-400 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
