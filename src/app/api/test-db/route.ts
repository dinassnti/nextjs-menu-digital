import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';

export async function GET() {
  try {
    // 1. Jalankan fungsi koneksi
    await connectDB();

    // 2. Opsi A: Cek readyState Mongoose
    // (0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting)
    const isConnected = mongoose.connection.readyState === 1;

    // 3. Opsi B: Kirim perintah Ping ke MongoDB Atlas (Paling Valid)
    // Ini hanya meminta response "ok" dari server MongoDB tanpa menyentuh data
    const db = mongoose.connection.db;
    const pingResult = await db?.admin().ping();

    if (isConnected && pingResult) {
      return NextResponse.json(
        {
          success: true,
          message: 'Koneksi ke MongoDB Atlas Berhasil!',
          connectionState: 'Connected (Code 1)',
          ping: pingResult, // Biasanya mengembalikan { ok: 1 }
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Database terhubung tapi status tidak valid.',
      },
      { status: 500 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal terhubung ke database!',
        error: error.message,
      },
      { status: 500 }
    );
  }
}