import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Profile from '@/models/Profile';
import User from '@/models/User';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await connectDB();
    const { userId } = await params;

    // Cari data user asli saat registrasi
    const userAccount = await User.findById(userId).select('name email');
    if (!userAccount) {
      return NextResponse.json({ pesan: 'Akun owner tidak ditemukan' }, { status: 404 });
    }

    let profile = await Profile.findOne({ userId });

    // Gabungkan data: Nama & Email dari User, sisanya dari Profile
    const dataResponse = {
      ownerName: userAccount.name,
      email: userAccount.email,
      cafeName: profile?.cafeName || '',
      address: profile?.address || '',
      phone: profile?.phone || '',
      openDays: profile?.openDays || '',
      openHours: profile?.openHours || '',
    };

    return NextResponse.json({ data: dataResponse }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ pesan: 'Gagal mengambil profil' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await connectDB();
    const { userId } = await params;
    const body = await request.json();

    const updatedProfile = await Profile.findOneAndUpdate(
      { userId },
      {
        cafeName: body.cafeName,
        address: body.address,
        phone: body.phone,
        openDays: body.openDays,
        openHours: body.openHours,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ pesan: 'Profil diperbarui!', data: updatedProfile }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ pesan: 'Gagal memperbarui profil' }, { status: 500 });
  }
}