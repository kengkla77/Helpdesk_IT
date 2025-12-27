// src/middleware.ts
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl
  const userRole = req.auth?.user?.role

  // 1. ดักจับว่ากำลังเข้าโซนไหน
  const isOnAdmin = pathname.startsWith('/admin')
  const isOnDashboard = pathname.startsWith('/dashboard')
  const isOnLogin = pathname.startsWith('/login')

  // 2. ถ้าเข้าหน้า Dashboard หรือ Admin แต่ยังไม่ล็อกอิน -> ดีดไปหน้า Login
  if ((isOnDashboard || isOnAdmin) && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // 3. ถ้าล็อกอินแล้ว พยายามเข้าหน้า Login -> ดีดไปที่ที่ควรอยู่
  if (isOnLogin && isLoggedIn) {
    if (userRole === 'ADMIN' || userRole === 'AGENT') {
        return NextResponse.redirect(new URL('/admin', req.url))
    }
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // 4. เช็คสิทธิ์หน้า Admin (ต้องเป็น ADMIN หรือ AGENT เท่านั้น)
  if (isOnAdmin) {
    if (userRole !== 'ADMIN' && userRole !== 'AGENT') {
      // ถ้าเป็น User ธรรมดา พยายามเข้า Admin -> ดีดกลับ Dashboard
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}