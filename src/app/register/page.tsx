"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);  
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const hasil = await response.json();

      if (response.ok) {
        alert("🎉 Registrasi Berhasil! Silakan login.");
        router.push("/login");
      } else {
        setError(hasil.pesan || "Gagal registrasi.");
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans text-slate-800">
      <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-[0_20px_50px_rgba(79,_70,_229,_0.07)] w-full max-w-md border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Register<span className="text-indigo-600">Owner</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Daftarkan akun admin cafemu</p>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 ml-1">Nama Owner</label>
            <input type="text" required className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200 transition-all text-slate-800" placeholder="Nama Anda" onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
            <input type="email" required className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200 transition-all text-slate-800" placeholder="owner@cafe.com" onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>

{/* KOLOM PASSWORD UTAMA */}
        <div className="space-y-1">
          <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              required 
              className="w-full bg-slate-50 border border-slate-200 p-3.5 pr-12 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200 transition-all text-slate-800" 
              placeholder="••••••••" 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
            />
            <button
              type="button"
              /* PERBAIKAN: Gunakan setShowPassword untuk kolom ini */
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors select-none cursor-pointer"
            >
              {showPassword ? (
                // Mata Terbuka (Jika type="text")
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              ) : (
                // Mata Dicoret (Jika type="password")
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
              )}
            </button>
          </div>
        </div>

        {/* KOLOM KONFIRMASI PASSWORD */}
        <div className="space-y-1">
          <label className="text-sm font-bold text-slate-700 ml-1">Konfirmasi Password</label>
          <div className="relative">
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              required 
              className="w-full bg-slate-50 border border-slate-200 p-3.5 pr-12 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200 transition-all text-slate-800" 
              placeholder="••••••••" 
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
            />
            <button
              type="button"
              /* PERBAIKAN: Gunakan setShowConfirmPassword untuk kolom ini */
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors select-none cursor-pointer"
            >
              {showConfirmPassword ? (
                // Mata Terbuka (Jika type="text")
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              ) : (
                // Mata Dicoret (Jika type="password")
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
              )}
            </button>
          </div>
        </div>

          {error && <p className="text-red-500 text-xs font-bold ml-1">⚠️ {error}</p>}

          <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all mt-2 shadow-lg shadow-indigo-200 disabled:bg-indigo-300">
            {loading ? "Memproses Pendaftaran..." : "Daftar Akun Sekarang"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6 font-medium">
          Sudah punya akun? <Link href="/login" className="text-indigo-600 font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}