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

// 1. FUNGSI GET: Mengambil detail satu menu berdasarkan ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // <-- PERUBAHAN TIPE DATA
) {
  try {
    await connectDB();
    
    // <-- SOLUSI ERROR: Wajib menggunakan await sebelum mengekstrak id
    const { id } = await params;

    const menu = await Menu.findById(id);
    if (!menu) {
      return NextResponse.json({ pesan: 'Menu tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ pesan: 'Berhasil mengambil detail menu', data: menu }, { status: 200 });
  } catch (error) {
    console.error('Gagal mengambil detail menu:', error);
    return NextResponse.json({ pesan: 'Gagal mengambil detail menu' }, { status: 500 });
  }
}

// 2. FUNGSI PUT: Mengubah Informasi Menu atau Status Best Seller
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // <-- PERUBAHAN TIPE DATA
) {
  try {
    await connectDB();
    
    // <-- SOLUSI ERROR NEXT.JS
    const { id } = await params; 
    
    const body = await request.json(); 

    const updatedMenu = await Menu.findByIdAndUpdate(
      id,
      body,
      // <-- SOLUSI WARNING MONGOOSE: Ganti 'new: true' menjadi 'returnDocument: "after"'
      { returnDocument: 'after', runValidators: true } 
    );

    if (!updatedMenu) {
      return NextResponse.json({ pesan: 'Menu tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ pesan: 'Menu berhasil diperbarui', data: updatedMenu }, { status: 200 });
  } catch (error) {
    console.error('Gagal memperbarui menu:', error);
    return NextResponse.json({ pesan: 'Gagal memperbarui menu' }, { status: 500 });
  }
}

// 3. FUNGSI DELETE: Menghapus data di MongoDB dan aset gambarnya di Cloudinary
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // <-- PERUBAHAN TIPE DATA
) {
  try {
    await connectDB();
    
    // <-- SOLUSI ERROR NEXT.JS
    const { id } = await params;

    const menu = await Menu.findById(id);
    if (!menu) {
      return NextResponse.json({ pesan: 'Menu tidak ditemukan' }, { status: 404 });
    }

    if (menu.image) {
      try {
        const urlParts = menu.image.split('/');
        const publicIdWithExt = urlParts[urlParts.length - 1];
        const publicId = `menu-digital/${publicIdWithExt.split('.')[0]}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error('Gagal menghapus gambar dari Cloudinary:', error);
      }
    }

    await Menu.findByIdAndDelete(id);

    return NextResponse.json({ pesan: 'Menu berhasil dihapus!' }, { status: 200 });
  } catch (error) {
    console.error('Gagal menghapus menu:', error);
    return NextResponse.json({ pesan: 'Gagal menghapus menu' }, { status: 500 });
  }
}