// src/app/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  // ถ้าล็อกอินแล้ว ให้เด้งไป Dashboard เลย
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-slate-900 text-white p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 text-center">
        <h1 className="text-4xl font-bold mb-2">IT Helpdesk</h1>
        <p className="text-blue-200 mb-8">ระบบแจ้งปัญหาและติดตามงานแจ้งซ่อม</p>

        <div className="space-y-4">
          <Link 
            href="/login"
            className="block w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl transition-all transform hover:scale-105 shadow-lg"
          >
            เข้าสู่ระบบ
          </Link>
          
          <div className="text-sm text-gray-400 mt-6">
            หรือติดต่อเจ้าหน้าที่: <span className="text-white">ITsupport@polyfoam.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}