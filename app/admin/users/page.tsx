import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { UserRoleDropdown } from "./UserRoleDropdown";
import { Shield, Wrench, User as UserIcon, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Prompt } from "next/font/google";

const prompt = Prompt({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const prisma = new PrismaClient();

export default async function UserManagementPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/login");

  // ดึง User ทั้งหมด เรียงตาม Role (ADMIN ขึ้นก่อน) แล้วค่อยตามชื่อ
  const users = await prisma.user.findMany({
    orderBy: [
      { role: "asc" }, // เรียงตาม Role (ADMIN -> AGENT -> USER)
      { name: "asc" },
    ],
  });

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 ${prompt.className} p-8`}>
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="flex items-center text-slate-500 hover:text-blue-600 mb-2 text-sm transition">
              <ArrowLeft size={16} className="mr-1" /> กลับไป Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Shield size={28} className="text-blue-600" />
              จัดการผู้ใช้งานและสิทธิ์
            </h1>
            <p className="text-slate-500 mt-1">รายชื่อผู้ใช้งานทั้งหมด {users.length} คน</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">ชื่อ - นามสกุล</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">อีเมล</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">บทบาท (Role)</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition">
                  {/* Name & Avatar */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {user.image ? (
                          <Image src={user.image} alt="" width={40} height={40} className="rounded-full border border-slate-200" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                            <UserIcon size={20} />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">{user.name || "ไม่ระบุชื่อ"}</div>
                        <div className="text-xs text-slate-400">ID: {user.id.slice(-4)}</div>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {user.email}
                  </td>

                  {/* Role Dropdown */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <UserRoleDropdown userId={user.id} currentRole={user.role} />
                  </td>

                  {/* Role Badge (Status) */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.role === "ADMIN" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                        <Shield size={12} /> ผู้ดูแลระบบ
                      </span>
                    )}
                    {user.role === "AGENT" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        <Wrench size={12} /> ช่างเทคนิค
                      </span>
                    )}
                    {user.role === "USER" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                        <UserIcon size={12} /> พนักงาน
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}