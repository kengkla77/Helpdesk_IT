import { auth, signOut } from "@/auth";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LogOut,
  User as UserIcon,
  Plus,
  FileText,
  ShieldCheck
} from "lucide-react";
import Image from "next/image";
import { Prompt } from "next/font/google";
import { UserTicketRow } from "./UserTicketRow"; // 👈 นำเข้า Component ใหม่

// Config Font
const prompt = Prompt({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // ดึงเฉพาะ Ticket ของ User คนนี้
  const tickets = await prisma.ticket.findMany({
    where: {
      requesterId: session.user.id,
    },
    orderBy: { createdAt: "desc" },
    include: { requester: true },
  });

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 ${prompt.className}`}>

      {/* NAVBAR */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-blue-700 p-2 rounded-lg text-white shadow-md">
              <FileText size={20} />
            </div>
            <span className="text-lg font-bold text-slate-800 tracking-tight">
              ระบบแจ้งซ่อมออนไลน์
            </span>
          </div>

          {/* User & Menu */}
          <div className="flex items-center gap-4">
            {(session.user.role === "ADMIN" || session.user.role === "AGENT") && (
              <Link
                href="/admin"
                className="flex items-center gap-2 bg-slate-800 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-slate-700 transition shadow-sm"
              >
                <ShieldCheck size={16} />
                Admin Console
              </Link>
            )}

            {/* User Info */}
            <div className="md:flex flex-col items-end mr-2">
              <span className="text-sm font-semibold text-slate-700">
                {session.user.name || "ผู้ใช้งาน"}
              </span>
              <span className="text-xs text-slate-500">
                {session.user.role === "ADMIN" ? "ผู้ดูแลระบบ" : "พนักงาน"}
              </span>
            </div>
            {/* Profile Image */}
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt="Profile"
                width={38}
                height={38}
                className="rounded-full border-2 border-slate-100 shadow-sm"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                <UserIcon size={18} />
              </div>
            )}

            <div className="h-6 w-px bg-slate-300 mx-1"></div>

            {/* Logout Button */}
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-md transition-colors"
                title="ออกจากระบบ"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">ออก</span>
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">รายการแจ้งปัญหาของคุณ</h1>
            <p className="text-slate-500 mt-1 text-sm">ประวัติการแจ้งซ่อมและสถานะงานทั้งหมด</p>
          </div>

          <Link
            href="/tickets/create"
            className="inline-flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium px-5 py-2.5 rounded-lg shadow-sm transition-all active:scale-95"
          >
            <Plus size={18} />
            แจ้งปัญหาใหม่
          </Link>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 w-32">สถานะ</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">หัวข้อปัญหา</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 w-32">ความด่วน</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 w-40">วันที่แจ้ง</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700 w-32">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center">
                        <div className="bg-slate-50 p-4 rounded-full mb-3">
                          <FileText className="w-10 h-10 text-slate-300" />
                        </div>
                        <p className="font-medium text-slate-600 text-lg">ไม่พบประวัติการแจ้งปัญหา</p>
                        <p className="text-sm mt-1 text-slate-400">กดปุ่ม "แจ้งปัญหาใหม่" เพื่อเริ่มต้น</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  tickets.map((ticket) => (
                    // 👇 เรียกใช้ UserTicketRow แทน tr เดิม
                    <UserTicketRow
                      key={ticket.id}
                      ticket={{
                        ...ticket,
                        // แปลงวันที่เป็น String ก่อนส่งเข้า Client Component
                        createdAt: ticket.createdAt.toISOString(),
                        updatedAt: ticket.updatedAt.toISOString(),
                      }}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}