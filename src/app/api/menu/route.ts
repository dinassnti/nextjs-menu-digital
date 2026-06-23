import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Menu from '@/models/Menu';
import { v2 as cloudinary } from 'cloudinary';

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 1. FUNGSI GET: Mengambil SEMUA data menu untuk tabel admin
export async function GET() {
  try {
    await connectDB();
    
    // Menampilkan semua menu, diurutkan dari yang paling baru diinput
    const menus = await Menu.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({ data: menus }, { status: 200 });
  } catch (error) {
    console.error('Gagal mengambil data menu:', error);
    return NextResponse.json(
      { pesan: 'Gagal mengambil data menu' },
      { status: 500 }
    );
  }
}

// 2. FUNGSI POST: Memproses input menu baru + Upload Gambar ke Cloudinary
export async function POST(request: Request) {
  try {
    await connectDB();
    
    // Menangkap data FormData dari Frontend
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const price = formData.get('price') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const imageFile = formData.get('image') as File;

    // Validasi data wajib
    if (!name || !price || !category || !imageFile) {
      return NextResponse.json(
        { pesan: 'Mohon isi semua data yang wajib!' },
        { status: 400 }
      );
    }

    // Mengubah File gambar menjadi Buffer agar bisa dikirim ke Cloudinary
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Proses terbang/upload ke Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'menu-digital' }, // Nama folder penyimpanan di Cloudinary Anda
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    // Mengambil URL aman hasil upload gambar
    const imageUrl = (uploadResult as any).secure_url;

    // Simpan informasi lengkap ke MongoDB
    const newMenu = await Menu.create({
      name,
      price: Number(price),
      category,
      description: description || '',
      image: imageUrl,
      isBestSeller: false, // Default awal bernilai salah/bukan
    });

    return NextResponse.json(
      { pesan: 'Menu baru berhasil disimpan!', data: newMenu },
      { status: 201 }
    );

  } catch (error) {
    console.error('Gagal memproses data menu:', error);
    return NextResponse.json(
      { pesan: 'Gagal memproses data menu' },
      { status: 500 }
    );
  }
}