import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "text" }, // kita gunakan email untuk login
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await connectDB();

        if (!credentials?.username || !credentials?.password) {
          throw new Error("Email dan password wajib diisi");
        }

        // 1. Cari user berdasarkan email di database
        const user = await User.findOne({ email: credentials.username });
        if (!user) {
          throw new Error("Akun tidak ditemukan");
        }

        // 2. Cocokkan password inputan dengan password terenkripsi di DB
        const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordMatch) {
          throw new Error("Password salah");
        }

        // 3. Jika lolos, kirim data user ke session
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      }
    })
  ],
  callbacks: {
    // Memasukkan ID User ke dalam token jwt
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // Memasukkan ID User dari token ke session frontend
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login", // Arahkan ke halaman login kustom kita
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };