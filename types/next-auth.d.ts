import { DefaultSession } from "next-auth"

// ขยาย Type ของ Session ให้รู้จักตัวแปร role
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string 
    } & DefaultSession["user"]
  }

  interface User {
    role: string
  }
}

// ขยาย Type ของ JWT
declare module "next-auth/jwt" {
  interface JWT {
    role: string
    id: string
  }
}