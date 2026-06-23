import { withAuth } from "next-auth/middleware";

// Next.js versi terbaru mewajibkan kita mengekspornya sebagai fungsi nyata
export default withAuth(function proxy(req) {
  // Bagian dalam fungsi dibiarkan kosong karena NextAuth akan otomatis 
  // mengambil alih tugas mencegat dan melempar pengguna ke halaman login.
});

// Menentukan halaman mana saja yang wajib dikunci
export const config = {
  matcher: ["/admin/:path*"], 
};