"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      username: email,
      password,
    });

    if (res?.error) {
      setError("Email atau password yang Anda masukkan salah.");
      setLoading(false);
    } else {
      router.push("/admin/profil");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans text-slate-800">
      
      <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-[0_20px_50px_rgba(79,_70,_229,_0.07)] w-full max-w-md border border-slate-100 transition-all">
        
        <div className="text-center mb-10">
          <div className="mx-auto w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-5 border border-indigo-100 shadow-inner">
            <span className="text-3xl">☕</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Menu<span className="text-indigo-600">Digital</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Masuk ke Dashboard Owner
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder:text-slate-400"
              placeholder="Contoh: owner@cafe.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Password
            </label>
            
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} 
                required
                // Tambahan text-slate-800 font-medium agar ketikan sandi terbaca jelas
                className={`w-full bg-slate-50 border ${error ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:ring-indigo-200'} p-4 pr-12 rounded-xl focus:ring-2 outline-none transition-all placeholder:text-slate-400 text-slate-800 font-medium`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors select-none cursor-pointer"
              >
                {showPassword ? (
                  // LOGIKA DIPERBAIKI: Jika terlihat (text), tampilkan Mata Terbuka
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                ) : (
                  // LOGIKA DIPERBAIKI: Jika tersembunyi (password), tampilkan Mata Dicoret
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                    <line x1="2" y1="2" x2="22" y2="22"/>
                  </svg>
                )}
              </button>
            </div>
            
            {error && (
              <div className="flex items-center gap-1.5 text-red-500 mt-2 ml-1 animate-in fade-in zoom-in duration-300">
                <span className="text-sm">⚠️</span>
                <p className="text-xs font-bold">{error}</p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 hover:-translate-y-0.5 transition-all mt-4 disabled:bg-indigo-300 shadow-lg shadow-indigo-200"
          >
            {loading ? "Memeriksa Kredensial..." : "Masuk ke Dashboard"}
          </button>

          <p className="text-center text-sm text-slate-500 font-medium mt-1">
            Belum punya akun? <Link href="/register" className="text-indigo-600 font-bold hover:underline">Daftar di sini</Link>
          </p>
        </form>
      </div>
    </div>
  );
}