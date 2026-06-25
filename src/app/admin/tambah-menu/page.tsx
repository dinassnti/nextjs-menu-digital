"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Kita pisahkan komponen form agar bisa menggunakan useSearchParams dengan aman di Next.js
function FormMenuContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId"); // Mengambil ID jika sedang dalam mode Edit

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "", price: "", category: "Makanan", description: "",
  });

  // Jika ada editId, cari data menu tersebut agar otomatis terisi di form
  useEffect(() => {
    if (editId) {
      const fetchSingleMenu = async () => {
        try {
          const response = await fetch("/api/menu");
          const data = await response.json();
          if (response.ok) {
            const menuToEdit = data.data.find((m: any) => m._id === editId);
            if (menuToEdit) {
              setFormData({
                name: menuToEdit.name,
                price: menuToEdit.price,
                category: menuToEdit.category,
                description: menuToEdit.description || "",
              });
            }
          }
        } catch (error) {
          console.error("Gagal menarik data edit:", error);
        }
      };
      fetchSingleMenu();
    }
  }, [editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editId) {
        // --- JALUR EDIT (PUT) ---
        const response = await fetch(`/api/menu/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            price: Number(formData.price),
            category: formData.category,
            description: formData.description,
          }),
        });

        if (response.ok) {
          alert("🎉 Menu berhasil diperbarui!");
          router.push("/admin");
        } else {
          alert("Gagal memperbarui menu.");
        }
      } else {
        // --- JALUR TAMBAH BARU (POST) ---
        if (!file) {
          setLoading(false);
          return alert("Tolong pilih foto terlebih dahulu!");
        }
        const dataKirim = new FormData();
        dataKirim.append("name", formData.name);
        dataKirim.append("price", formData.price);
        dataKirim.append("category", formData.category);
        dataKirim.append("description", formData.description);
        dataKirim.append("image", file); 

        const response = await fetch("/api/menu", { method: "POST", body: dataKirim });
        if (response.ok) {
          alert("🎉 Menu baru berhasil disimpan!");
          router.push("/admin");
        } else {
          alert("Gagal menyimpan menu baru.");
        }
      }
    } catch (error) {
      alert("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-indigo-50">
      <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">
        {editId ? "📝 Edit Menu Kuliner" : "Daftarkan Menu Baru"}
      </h2>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">Nama Menu</label>
          <input type="text" required placeholder="Contoh: Kopi Susu Aren" className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-slate-800" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
        </div>
        
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">Harga (Rp)</label>
          <input type="number" required placeholder="Contoh: 15000" className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-slate-800" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">Kategori</label>
          <select className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-slate-800" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
            <option value="Makanan">Makanan</option>
            <option value="Minuman">Minuman</option>
            <option value="Snack">Snack</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">Foto Menu {editId && <span className="text-xs text-slate-400">(Opsional saat edit)</span>}</label>
          <input type="file" accept="image/*" required={!editId} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 cursor-pointer" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </div>

        <div className="md:col-span-2 space-y-1">
          <label className="text-sm font-semibold text-slate-700">Deskripsi Singkat</label>
          <textarea placeholder="Jelaskan citarasa menu..." rows={2} className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-slate-800" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
        </div>

        <div className="md:col-span-2 flex justify-end gap-3 pt-4">
          <button type="button" onClick={() => router.push("/admin")} className="bg-slate-100 text-slate-600 font-bold py-3.5 px-6 rounded-xl hover:bg-slate-200 transition-all">
            Batal
          </button>
          <button type="submit" disabled={loading} className="bg-indigo-600 text-white font-bold py-3.5 px-8 rounded-xl hover:bg-indigo-700 transition-all shadow-md disabled:bg-indigo-400">
            {loading ? "Memproses Data..." : editId ? "💾 Perbarui Menu Kuliner" : "💾 Simpan Menu Baru"}
          </button>
        </div>
      </form>
    </div>
  );
}

// Wrapper utama halaman untuk Next.js Suspense agar aman saat mengambil URL Params
export default function TambahMenuPage() {
  const router = useRouter();
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button onClick={() => router.back()} className="text-slate-500 font-bold hover:text-indigo-600 transition-colors">
        ← Kembali
      </button>
      <Suspense fallback={<div className="p-8 text-center text-slate-500">Memuat form...</div>}>
        <FormMenuContent />
      </Suspense>
    </div>
  );
}