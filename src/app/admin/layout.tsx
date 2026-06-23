"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans text-slate-800">
      
      {/* SIDEBAR ELEGAN */}
      <aside className="w-72 bg-white shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex flex-col z-20 border-r border-slate-100">
        
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-xl border border-indigo-100 shadow-inner">
            ☕
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Menu<span className="text-indigo-600">Digital</span>
          </h2>
        </div>
        
        <nav className="flex-1 px-4 flex flex-col gap-2 overflow-y-auto mt-4">
          <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Menu Utama</p>
          
          {/* Cukup 1 Menu Utama Saja Sekarang */}
          <Link 
            href="/admin" 
            className={`px-4 py-3.5 rounded-2xl transition-all duration-300 flex items-center gap-4 font-semibold ${
              pathname === '/admin' 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200/50 translate-x-1' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
            }`}
          >
            <span className="text-xl">📋</span> Manajemen Menu
          </Link>

          <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mt-6 mb-2">Pengaturan</p>
          
          <Link 
            href="/admin/profil" 
            className={`px-4 py-3.5 rounded-2xl transition-all duration-300 flex items-center gap-4 font-semibold ${
              pathname === '/admin/profil' 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200/50 translate-x-1' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
            }`}
          >
            <span className="text-xl">⚙️</span> Profil Kafe
          </Link>
        </nav>

        <div className="p-6">
          <button 
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full py-3.5 px-4 flex items-center justify-center gap-3 bg-white border-2 border-red-50 text-red-500 rounded-2xl font-bold hover:bg-red-50 hover:text-red-600 transition-all active:scale-[0.98]"
          >
            <span className="text-lg">🚪</span> Keluar
          </button>
        </div>
      </aside>

      {/* KONTEN KANAN */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-10 flex justify-end items-center shrink-0 z-10">
           <div className="flex items-center gap-4 cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors">
              <div className="text-right">
                 <p className="text-sm font-bold text-slate-900">Admin Utama</p>
                 <p className="text-xs text-slate-500 font-medium">Owner Kafe</p>
              </div>
              <div className="w-11 h-11 bg-indigo-100 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-indigo-600 font-bold">
                A
              </div>
           </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-8 lg:p-12">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}