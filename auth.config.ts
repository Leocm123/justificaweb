import type { NextAuthConfig } from "next-auth"

export default {
  trustHost: true, // necessário para Vercel e outros hosts
  providers: [],
  pages: { signIn: "/admin/login" },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isAdmin = nextUrl.pathname.startsWith("/admin")
      const isLogin = nextUrl.pathname === "/admin/login"

      // Rotas admin (exceto login) exigem autenticação
      if (isAdmin && !isLogin) {
        if (!auth) {
          const loginUrl = new URL("/admin/login", nextUrl)
          loginUrl.searchParams.set("callbackUrl", nextUrl.pathname)
          return Response.redirect(loginUrl)
        }
        return true
      }

      // Se já logado e na página de login, redireciona para o painel
      if (isAdmin && isLogin && auth) {
        return Response.redirect(new URL("/admin", nextUrl))
      }

      return true
    },
  },
  session: { strategy: "jwt" },
} satisfies NextAuthConfig
