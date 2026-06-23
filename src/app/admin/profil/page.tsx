"use client";

import { useState } from "react";

export default function ProfilKafePage() {
  const [profil, setProfil] = useState({
    namakafe: "Kafe Digital Mudapedia",
    deskripsi: "Kafe dengan menu digital yang modern dan interaktif",
    alamat: "Jalan Digital No. 123, Bandung",
    telepon: "0821-xxxx-xxxx",
    email: "kafe@mudapedia.com",
    jamBuka: "09:00",
    jamTutup: "22:00",
    hari: "Senin - Minggu",
  });

  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfil((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // TODO: Simpan data ke backend API
    alert("Profil kafe berhasil disimpan!");
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg">
      <h1 className="text-3xl font-bold mb-6">Profil Kafe</h1>

      {saved && (
        <div className="p-4 mb-6 bg-green-50 border border-green-200 rounded-lg text-green-700 font-semibold">
          ✅ Profil berhasil disimpan!
        </div>
      )}

      <div className="space-y-6">
        {/* Nama Kafe */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Kafe</label>
          <input
            type="text"
            name="namakafe"
            value={profil.namakafe}
            onChange={handleChange}
            disabled={!editing}
            className={`w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              !editing ? "bg-gray-50 cursor-not-allowed" : "bg-white"
            }`}
          />
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi</label>
          <textarea
            name="deskripsi"
            value={profil.deskripsi}
            onChange={handleChange}
            disabled={!editing}
            rows={4}
            className={`w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              !editing ? "bg-gray-50 cursor-not-allowed" : "bg-white"
            }`}
          />
        </div>

        {/* Alamat */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Alamat</label>
          <input
            type="text"
            name="alamat"
            value={profil.alamat}
            onChange={handleChange}
            disabled={!editing}
            className={`w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              !editing ? "bg-gray-50 cursor-not-allowed" : "bg-white"
            }`}
          />
        </div>

        {/* Telepon */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Telepon</label>
          <input
            type="tel"
            name="telepon"
            value={profil.telepon}
            onChange={handleChange}
            disabled={!editing}
            className={`w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              !editing ? "bg-gray-50 cursor-not-allowed" : "bg-white"
            }`}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={profil.email}
            onChange={handleChange}
            disabled={!editing}
            className={`w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              !editing ? "bg-gray-50 cursor-not-allowed" : "bg-white"
            }`}
          />
        </div>

        {/* Jam Operasional */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Hari</label>
            <input
              type="text"
              name="hari"
              value={profil.hari}
              onChange={handleChange}
              disabled={!editing}
              className={`w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                !editing ? "bg-gray-50 cursor-not-allowed" : "bg-white"
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Jam Buka</label>
            <input
              type="time"
              name="jamBuka"
              value={profil.jamBuka}
              onChange={handleChange}
              disabled={!editing}
              className={`w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                !editing ? "bg-gray-50 cursor-not-allowed" : "bg-white"
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Jam Tutup</label>
            <input
              type="time"
              name="jamTutup"
              value={profil.jamTutup}
              onChange={handleChange}
              disabled={!editing}
              className={`w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                !editing ? "bg-gray-50 cursor-not-allowed" : "bg-white"
              }`}
            />
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex gap-4 pt-6 border-t border-gray-200">
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              ✏️ Edit Profil
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="flex-1 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                ✅ Simpan Perubahan
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                }}
                className="flex-1 bg-gray-400 text-white p-3 rounded-lg hover:bg-gray-500 transition-colors font-semibold"
              >
                ❌ Batal
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
