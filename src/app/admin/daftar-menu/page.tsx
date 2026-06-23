"use client";

import { useEffect, useState } from "react";

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  createdAt: string;
}

export default function DaftarMenuPage() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await fetch("/api/menu");
        const data = await response.json();

        if (response.ok) {
          setMenus(data.data || []);
        } else {
          setError("Gagal mengambil data menu");
        }
      } catch (err) {
        setError("Error mengambil data: " + (err instanceof Error ? err.message : "Unknown error"));
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus menu ini?")) return;

    try {
      const response = await fetch(`/api/menu/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Menu berhasil dihapus!");
        setMenus(menus.filter((menu) => menu._id !== id));
      } else {
        alert("Gagal menghapus menu");
      }
    } catch (error) {
      alert("Error: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white rounded-lg">
      <h1 className="text-3xl font-bold mb-6">Daftar Menu Kafe</h1>

      {error && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {menus.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Belum ada menu. <a href="/admin" className="text-blue-600 hover:underline">Tambah menu sekarang</a></p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menus.map((menu) => (
            <div key={menu._id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
              {/* Gambar Menu */}
              <div className="relative h-48 bg-gray-100">
                <img
                  src={menu.image}
                  alt={menu.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {menu.category}
                </span>
              </div>

              {/* Info Menu */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{menu.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{menu.description || "Tidak ada deskripsi"}</p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-blue-600">Rp {menu.price.toLocaleString("id-ID")}</span>
                </div>

                {/* Tombol Aksi */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors font-semibold">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(menu._id)}
                    className="flex-1 bg-red-600 text-white p-2 rounded hover:bg-red-700 transition-colors font-semibold"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
