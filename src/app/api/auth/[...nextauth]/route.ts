import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Login Admin",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Ketik: admin" },
        password: { label: "Password", type: "password", placeholder: "Ketik: admin123" }
      },
      async authorize(credentials) {
        // Karena ini khusus untuk satu pemilik kafe, kita atur username & password statis
        if (credentials?.username === "admin" && credentials?.password === "admin123") {
          return { id: "1", name: "Owner Kafe" };
        }
        return null; // Jika salah, login otomatis ditolak
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login", // Mengarahkan ke halaman login kustom kita
  }, 
});

export { handler as GET, handler as POST };