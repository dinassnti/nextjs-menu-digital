import Link from "next/link";
import { connectDB } from "@/lib/db";
import Profile from "@/models/Profile";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  await connectDB();
  const profile = await Profile.findOne().lean();

  const cafeName = profile?.cafeName || "Kafe Belum Diberi Nama";
  const address = profile?.address || "Alamat belum diatur oleh admin.";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans text-slate-800 relative overflow-hidden">
      {/* Hiasan background lingkaran tipis */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-96 bg-indigo-50 blur-[120px] rounded-full opacity-60 pointer-events-none"></div>

      <div className="w-full max-w-xl bg-white p-8 md:p-12 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100 text-center relative z-10">
        {/* Logo Ikon */}
        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-8 shadow-inner border border-indigo-100">
          ☕
        </div>

        {/* Nama Kafe */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          {cafeName}
        </h1>

        {/* Alamat Kafe */}
        <p className="text-slate-500 font-medium text-sm md:text-base mb-10 max-w-sm mx-auto flex items-center justify-center gap-2">
          <span>📍</span> {address}
        </p>

        {/* 2 TOMBOL UTAMA */}
        <div className="flex flex-col gap-4">
          {/* Tombol Katalog Menu (Pindah ke halaman baru /katalog) */}
          <Link 
            href="/katalog" 
            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all block text-center"
          >
            📖 Lihat Katalog Menu
          </Link>

          {/* Tombol Admin */}
          <Link 
            href="/login" 
            className="w-full py-4 bg-slate-50 text-slate-700 font-bold rounded-2xl shadow-sm border border-slate-200 hover:bg-slate-100 transition-all block text-center"
          >
            ⚙️ Masuk Sebagai Admin
          </Link>
        </div>
      </div>
    </div>
  );
}