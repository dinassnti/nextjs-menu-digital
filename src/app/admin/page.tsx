"use client";

import { useState, useEffect } from "react";

export default function AdminPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [menus, setMenus] = useState<any[]>([]);
  
  // STATE UNTUK FORM INTERAKTIF
  const [formData, setFormData] = useState({
    name: "", price: "", category: "Makanan", description: "",
  });
  const [file, setFile] = useState<File | null>(null);

  // STATE BARU: Untuk menandai apakah sedang EDIT atau TAMBAH
  const [editId, setEditId] = useState<string | null>(null);

  // 1. AMBIL DATA MENU DARI MONGODB
  const fetchMenus = async () => {
    try {
      const response = await fetch("/api/menu");
      const data = await response.json();
      if (response.ok) {
        setMenus(data.data); 
      }
    } catch (error) {
      console.error("Gagal menarik data menu:", error);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  // 2. TOMBOL AKSI: TOMBOL TAMBAH / EDIT DIKLIK
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editId) {
        // --- JALUR EDIT DATA (PUT) ---
        // Kita kirim data teks dalam bentuk JSON sesuai spesifikasi API PUT milikmu
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
          resetForm();
          fetchMenus();
        } else {
          alert("Gagal memperbarui menu.");
        }
      } else {
        // --- JALUR TAMBAH DATA BARU (POST) ---
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
          resetForm();
          fetchMenus();
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

  // 3. FUNGSI SAAT TOMBOL EDIT DI TABEL DIKLIK
  const handleEditClick = (menu: any) => {
    setEditId(menu._id); // Kunci ID yang mau diedit
    setFormData({
      name: menu.name,
      price: menu.price,
      category: menu.category,
      description: menu.description || "",
    });
    setIsFormOpen(true); // Buka form otomatis
    window.scrollTo({ top: 0, behavior: "smooth" }); // Kelompokkan layar ke atas form
  };

  // 4. LOGIKA TOGGLE BEST SELLER (PUT)
  const handleToggleBestSeller = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/menu/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBestSeller: !currentStatus }), 
      });
      
      if (response.ok) {
        fetchMenus(); // Refresh data tabel tanpa reload halaman penuh
      }
    } catch (error) {
      alert("Gagal mengubah status Best Seller.");
    }
  };

  // 5. LOGIKA HAPUS DATA (DELETE)
  const handleDelete = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus menu ini?")) return;

    try {
      const response = await fetch(`/api/menu/${id}`, { method: "DELETE" });
      if (response.ok) {
        alert("Menu sukses dihapus dari DB dan Cloudinary!");
        fetchMenus(); 
      } else {
        alert("Gagal menghapus menu.");
      }
    } catch (error) {
      alert("Terjadi kesalahan sistem saat menghapus.");
    }
  };

  // 6. RESET FORM KEMBALI NORMAL
  const resetForm = () => {
    setFormData({ name: "", price: "", category: "Makanan", description: "" });
    setFile(null);
    setEditId(null);
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER DASHBOARD */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Menu</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola hidangan, status best seller, dan harga kafe.</p>
        </div>
        
        <button 
          onClick={() => { if (isFormOpen) { resetForm(); } else { setIsFormOpen(true); } }}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
            isFormOpen 
            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
            : 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700'
          }`}
        >
          {isFormOpen ? '✖ Tutup Panel' : '➕ Tambah Menu Baru'}
        </button>
      </div>

      {/* AREA FORM MULTIFUNGSI (TAMBAH / EDIT) */}
      {isFormOpen && (
        <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-indigo-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">
            {editId ? "📝 Edit Menu Kuliner" : "➕ Daftarkan Menu Baru"}
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
              {editId && (
                <button type="button" onClick={resetForm} className="bg-slate-100 text-slate-600 font-bold py-3.5 px-6 rounded-xl hover:bg-slate-200 transition-all">
                  Batal
                </button>
              )}
              <button type="submit" disabled={loading} className="bg-indigo-600 text-white font-bold py-3.5 px-8 rounded-xl hover:bg-indigo-700 transition-all shadow-md disabled:bg-indigo-400">
                {loading ? "Memproses Data..." : editId ? "💾 Perbarui Menu Kuliner" : "💾 Simpan Menu Baru"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TABEL DATA DINAMIS */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-xs border-b border-slate-100">
              <tr>
                <th className="px-6 py-5">Foto</th>
                <th className="px-6 py-5">Nama Menu</th>
                <th className="px-6 py-5 text-center">Best Seller</th>
                <th className="px-6 py-5">Harga</th>
                <th className="px-6 py-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {menus.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-400 font-medium">
                    Belum ada data menu kuliner.
                  </td>
                </tr>
              ) : (
                menus.map((menu: any) => (
                  <tr key={menu._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <img src={menu.image} alt={menu.name} className="w-16 h-16 object-cover rounded-xl shadow-sm border border-slate-100" />
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800 text-base">{menu.name}</p>
                      <p className="text-xs text-slate-500 font-medium">{menu.category}</p>
                    </td>

                    {/* INTERAKSI TOGGLE BEST SELLER */}
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => handleToggleBestSeller(menu._id, menu.isBestSeller)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                          menu.isBestSeller 
                          ? 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100' 
                          : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {menu.isBestSeller ? '⭐ BEST SELLER' : '☆ BIASA'}
                      </button>
                    </td>

                    <td className="px-6 py-4 text-indigo-600 font-bold text-base">
                      Rp {menu.price.toLocaleString('id-ID')}
                    </td>
                    
                    {/* AKSI EDIT DAN HAPUS */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEditClick(menu)}
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

    </div>
  );
}