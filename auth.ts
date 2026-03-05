import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import * as bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import authConfig from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null

        const admin = await prisma.admin.findUnique({
          where: { email: String(credentials.email) },
        })

        if (!admin) return null

        const valid = await bcrypt.compare(String(credentials.password), admin.password)
        if (!valid) return null

        return { id: admin.id, email: admin.email, name: "Admin" }
      },
    }),
  ],
})
