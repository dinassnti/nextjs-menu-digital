"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [menus, setMenus] = useState<any[]>([]);

  const fetchMenus = async () => {
    try {
      const response = await fetch("/api/menu");
      const data = await response.json();
      if (response.ok) setMenus(data.data);
    } catch (error) {
      console.error("Gagal menarik data:", error);
    }
  };

  useEffect(() => { fetchMenus(); }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus menu ini?")) return;
    try {
      const response = await fetch(`/api/menu/${id}`, { method: "DELETE" });
      if (response.ok) {
        alert("Menu berhasil dihapus!");
        fetchMenus(); 
      }
    } catch (error) {
      alert("Gagal menghapus menu.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Menu</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola daftar hidangan kafe kamu.</p>
        </div>
        <Link 
          href="/admin/tambah-menu" 
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md"
        >
          ➕ Tambah Menu Baru
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-xs">
            <tr>
              <th className="px-6 py-5">Foto</th>
              <th className="px-6 py-5">Nama Menu</th>
              <th className="px-6 py-5">Kategori</th>
              <th className="px-6 py-5">Harga</th>
              <th className="px-6 py-5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {menus.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-slate-400 font-medium">
                  Belum ada data menu.
                </td>
              </tr>
            ) : (
              menus.map((menu: any) => (
                <tr key={menu._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <img src={menu.image} alt={menu.name} className="w-16 h-16 object-cover rounded-xl shadow-sm border border-slate-100" />
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800 text-base">{menu.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-xl border border-indigo-100 inline-block">
                      {menu.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-indigo-600 font-bold text-base">
                    Rp {menu.price.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {/* Tombol Edit yang melempar ID ke halaman form */}
                      <button 
                        onClick={() => router.push(`/admin/tambah-menu?editId=${menu._id}`)}
                        className="text-blue-600 hover:text-blue-800 font-bold px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(menu._id)}
                        className="text-red-500 hover:text-red-700 font-bold px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}