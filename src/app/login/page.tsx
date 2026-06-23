"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (res?.error) {
      setError("Username atau password yang Anda masukkan salah.");
      setLoading(false);
    } else {
      router.push("/admin");
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
              Username
            </label>
            <input
              type="text"
              required
              className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder:text-slate-400"
              placeholder="Ketik: admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Password
            </label>
            <input
              type="password"
              required
              className={`w-full bg-slate-50 border ${error ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:ring-indigo-200'} p-4 rounded-xl focus:ring-2 outline-none transition-all placeholder:text-slate-400`}
              placeholder="Ketik: admin123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
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
        </form>
      </div>
    </div>
  );
}