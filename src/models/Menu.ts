import mongoose, { Schema, model, models } from 'mongoose';

// 1. Membuat rancangan struktur data (Schema)
const MenuSchema = new Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Nama menu wajib diisi'] 
    },
    price: { 
      type: Number, 
      required: [true, 'Harga menu wajib diisi'] 
    },
    description: { 
      type: String, 
      default: '' 
    },
    image: { 
      type: String, 
      default: '' // Nanti akan diisi URL gambar dari Cloudinary
    },
    category: { 
      type: String, 
      required: [true, 'Kategori wajib dipilih'],
      enum: ['Makanan', 'Minuman', 'Snack'] // Membatasi pilihan kategori awal
    },
    isBestSeller: { 
      type: Boolean, 
      default: false // Secara default tidak otomatis jadi best seller
    }
  },
  {
    timestamps: true // Otomatis membuat kolom tanggal input & edit data (createdAt & updatedAt)
  }
);

// 2. Membuat Model. Jika model 'Menu' sudah ada, pakai yang sudah ada (mencegah error Next.js)
const Menu = models.Menu || model('Menu', MenuSchema);

export default Menu;