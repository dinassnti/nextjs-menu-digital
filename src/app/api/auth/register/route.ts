import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// FUNGSI POST: Menerima pendaftaran akun admin/owner baru
export async function POST(request: Request) {
  try {
    // 1. Nyalakan koneksi ke database MongoDB
    await connectDB();

    // 2. Tangkap data JSON yang dikirim dari halaman register front-end
    const { name, email, password, confirmPassword } = await request.json();

    // 3. Validasi: Pastikan tidak ada kolom yang kosong
    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { pesan: 'Semua kolom wajib diisi!' }, 
        { status: 400 }
      );
    }

    // 4. Validasi: Pastikan password utama dan konfirmasinya sama persis
    if (password !== confirmPassword) {
      return NextResponse.json(
        { pesan: 'Konfirmasi password tidak cocok!' }, 
        { status: 400 }
      );
    }

    // 5. Validasi: Periksa apakah email sudah pernah dipakai orang lain
    const userExist = await User.findOne({ email });
    if (userExist) {
      return NextResponse.json(
        { pesan: 'Email ini sudah terdaftar! Gunakan email lain.' }, 
        { status: 400 }
      );
    }

    // 6. Kriptografi: Enkripsi password menggunakan bcryptjs biar aman di DB
    // Angka 10 adalah tingkat kekuatan enkripsinya (salt rounds)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 7. Masukkan data admin baru ke tabel 'users' di MongoDB
    await User.create({
      name,
      email,
      password: hashedPassword, // Simpan password yang sudah di-hash (berwujud kode acak)
    });

    // 8. Kirim respon sukses ke front-end
    return NextResponse.json(
      { pesan: 'Berhasil terdaftar' }, 
      { status: 201 }
    );

  } catch (error) {
    console.error('Gagal Registrasi:', error);
    return NextResponse.json(
      { pesan: 'Terjadi kesalahan sistem saat registrasi' }, 
      { status: 500 }
    );
  }
}