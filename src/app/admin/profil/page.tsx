"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

// Daftar hari untuk dropdown
const DAFTAR_HARI = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export default function ProfileAdminPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    ownerName: "", email: "", cafeName: "", address: "", phone: ""
  });

  // STATE KHUSUS UNTUK HARI DAN JAM BUKA-TUTUP
  const [startDay, setStartDay] = useState("Senin");
  const [endDay, setEndDay] = useState("Minggu");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("22:00");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user) return;
      try {
        const userId = (session.user as any).id;
        const response = await fetch(`/api/profile/${userId}`);
        const hasil = await response.json();
        
        if (response.ok && hasil.data) {
          // Masukkan data dasar
          setProfileData({
            ownerName: hasil.data.ownerName || "",
            email: hasil.data.email || "",
            cafeName: hasil.data.cafeName || "",
            address: hasil.data.address || "",
            phone: hasil.data.phone || "",
          });

          // Pecah data hari (contoh: "Senin - Minggu" menjadi startDay: "Senin", endDay: "Minggu")
          if (hasil.data.openDays) {
            const days = hasil.data.openDays.split(" - ");
            if (days.length === 2) {
              setStartDay(days[0]);
              setEndDay(days[1]);
            }
          }

          // Pecah data jam (contoh: "09:00 - 22:00" menjadi startTime: "09:00", endTime: "22:00")
          if (hasil.data.openHours) {
            const hours = hasil.data.openHours.split(" - ");
            if (hours.length === 2) {
              setStartTime(hours[0]);
              setEndTime(hours[1]);
            }
          }
        }
      } catch (error) {
        console.error("Gagal memuat profil:", error);
      }
    };
    fetchProfile();
  }, [session]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) return;
    setLoading(true);

    try {
      const userId = (session.user as any).id;
      
      // Gabungkan kembali hari dan jam sebelum dikirim ke database
      const payloadData = {
        ...profileData,
        openDays: `${startDay} - ${endDay}`,
        openHours: `${startTime} - ${endTime}`,
      };

      const response = await fetch(`/api/profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadData),
      });

      if (response.ok) {
        alert("Berhasil Diperbarui!");
      } else {
        alert("Gagal menyimpan perubahan profil.");
      }
    } catch (error) {
      alert("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi khusus untuk menyaring input nomor telepon agar murni angka
  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hanyaAngka = e.target.value.replace(/\D/g, ""); // Hapus semua karakter yang bukan angka
    setProfileData({ ...profileData, phone: hanyaAngka });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-2">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-800">Pengaturan Profil Kafe</h1>
        <p className="text-slate-500 text-sm mt-1">Lengkapi data operasional lapak digital kafemu.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* BAGIAN DATA AKUN */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-400">Nama Owner</label>
            <input type="text" disabled className="w-full bg-slate-100 border border-slate-200 p-3.5 rounded-xl text-slate-500 cursor-not-allowed font-medium" value={profileData.ownerName} />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-400">Email Utama</label>
            <input type="text" disabled className="w-full bg-slate-100 border border-slate-200 p-3.5 rounded-xl text-slate-500 cursor-not-allowed font-medium" value={profileData.email} />
          </div>

          <div className="border-b md:col-span-2 my-2 border-slate-100"></div>

          {/* BAGIAN DATA KAFE */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700">Nama Kafe</label>
            <input type="text" required placeholder="Contoh: Dewitari Coffee" className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200 transition-all text-slate-800 font-medium" value={profileData.cafeName} onChange={(e) => setProfileData({...profileData, cafeName: e.target.value})} />
          </div>

          {/* INPUT NOMOR TELEPON (HANYA ANGKA) */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700">Nomor Telepon</label>
            <input type="text" inputMode="numeric" required placeholder="Contoh: 08123456789" className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200 transition-all text-slate-800 font-medium" value={profileData.phone} onChange={handlePhoneInput} />
          </div>

          {/* DROPDOWN HARI OPERASIONAL */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Hari Operasional</label>
            <div className="flex items-center gap-3">
              <select className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200 transition-all text-slate-800 font-medium cursor-pointer" value={startDay} onChange={(e) => setStartDay(e.target.value)}>
                {DAFTAR_HARI.map(hari => <option key={`start-${hari}`} value={hari}>{hari}</option>)}
              </select>
              <span className="text-slate-400 font-bold text-sm">s/d</span>
              <select className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200 transition-all text-slate-800 font-medium cursor-pointer" value={endDay} onChange={(e) => setEndDay(e.target.value)}>
                {DAFTAR_HARI.map(hari => <option key={`end-${hari}`} value={hari}>{hari}</option>)}
              </select>
            </div>
          </div>

          {/* TIME PICKER JAM OPERASIONAL */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Jam Operasional</label>
            <div className="flex items-center gap-3">
              <input type="time" required className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200 transition-all text-slate-800 font-medium cursor-pointer" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              <span className="text-slate-400 font-bold text-sm">s/d</span>
              <input type="time" required className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200 transition-all text-slate-800 font-medium cursor-pointer" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-sm font-bold text-slate-700">Alamat Lengkap Kafe</label>
            <textarea required placeholder="Tuliskan alamat fisik kedai Anda agar mudah dicari di maps..." rows={3} className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200 transition-all text-slate-800 font-medium" value={profileData.address} onChange={(e) => setProfileData({...profileData, address: e.target.value})}></textarea>
          </div>

          <div className="md:col-span-2 flex justify-end pt-4">
            <button type="submit" disabled={loading} className="bg-indigo-600 text-white font-bold py-3.5 px-10 rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 disabled:bg-indigo-400">
              {loading ? "Menyimpan Konfigurasi..." : "💾 Simpan Perubahan Profil"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}