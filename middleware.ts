import NextAuth from "next-auth"
import authConfig from "./auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  // authorized callback em auth.config.ts controla o acesso
})

export const config = {
  matcher: ["/admin/:path*"],
}
