import { auth, signOut } from "@/auth";
import { PrismaClient, Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import {
  Users,
  LogOut,
  LayoutDashboard,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Prompt } from "next/font/google";
import { AdminToolbar } from "./toolbar";
import { TicketNotification } from "@/components/TicketNotification";
import { RealtimeListener } from "@/components/RealtimeListener";
import { TicketRow } from "./TicketRow";
import Link from "next/link";

const prompt = Prompt({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const prisma = new PrismaClient();

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams?: {
    q?: string;
    status?: string;
  };
}) {
  const session = await auth();

  // 1. เช็คสิทธิ์: ต้องเป็น ADMIN หรือ AGENT เท่านั้น
  const allowedRoles = ["ADMIN", "AGENT"];
  if (!session?.user || !allowedRoles.includes(session.user.role)) {
    redirect("/login");
  }

  const userRole = session.user.role; // เก็บ Role ไว้เช็คตอนแสดงปุ่ม

  const query = searchParams?.q || "";
  const statusFilter = searchParams?.status;

  const whereCondition: Prisma.TicketWhereInput = {};

  if (statusFilter && statusFilter !== "ALL") {
    whereCondition.status = statusFilter as any;
  }

  if (query) {
    whereCondition.OR = [
      { title: { contains: query } },
      { description: { contains: query } },
      { requester: { name: { contains: query } } }
    ];
  }

  const tickets = await prisma.ticket.findMany({
    where: whereCondition,
    orderBy: [
      { priority: "desc" },
      { createdAt: "desc" },
    ],
    include: { requester: true, assignee: true },
  });

  // ดึงรายชื่อ Agent ทั้งหมด (เฉพาะ Admin เอาไปใส่ Dropdown)
  const agents = await prisma.user.findMany({
    where: { role: { in: ["ADMIN", "AGENT"] } }, // ดึงมาเฉพาะทีมงาน
    orderBy: { name: "asc" }
  });

  const allTicketsForStats = await prisma.ticket.findMany();
  const stats = {
    total: allTicketsForStats.length,
    open: allTicketsForStats.filter(t => t.status === "OPEN").length,
    inProgress: allTicketsForStats.filter(t => t.status === "IN_PROGRESS").length,
    urgent: allTicketsForStats.filter(t => t.status === "OPEN" && (t.priority === "URGENT" || t.priority === "HIGH")).length,
  };

  return (
    <div className={`min-h-screen bg-slate-100 text-slate-900 ${prompt.className}`}>

      {/* HEADER */}
      <nav className="bg-slate-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded text-white">
              <LayoutDashboard size={20} />
            </div>
            <span className="text-lg font-bold tracking-tight">IT Support Console</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-300 hidden sm:inline">
              สวัสดี, {session.user.name} ({userRole})
            </span>
            <form action={async () => { "use server"; await signOut({ redirectTo: "/login" }); }}>
              <button className="text-slate-300 hover:text-white transition">
                <LogOut size={20} />
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="งานทั้งหมด" value={stats.total} icon={<LayoutDashboard />} color="bg-white border-slate-200" />
          <StatCard title="รอดำเนินการ" value={stats.open} icon={<Clock />} color="bg-white border-l-4 border-l-yellow-400" />
          <StatCard title="กำลังซ่อม" value={stats.inProgress} icon={<CheckCircle2 />} color="bg-white border-l-4 border-l-blue-500" />
          <StatCard title="งานด่วนค้างรับ!" value={stats.urgent} icon={<AlertCircle />} color="bg-red-50 border-l-4 border-l-red-600 text-red-700" />
        </div>

        {/* TABLE CARD */}
        <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-white flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col text-left">
              <h2 className="text-lg font-bold text-slate-800">รายการแจ้งซ่อมทั้งหมด</h2>
              <p className="text-slate-500 text-sm">จัดการและตรวจสอบสถานะงานซ่อม</p>
            </div>
            <div className="shrink-0 flex items-center gap-3">
              <Link
                href="/admin/users"
                className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 hover:text-blue-600 hover:border-blue-300 transition shadow-sm"
              >
                <Users size={18} />
                <span>จัดการผู้ใช้งาน</span>
              </Link>
              <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
              <AdminToolbar />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">สถานะ</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">ความด่วน</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-1/3">รายละเอียดปัญหา</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">ผู้รับผิดชอบ</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">ผู้แจ้ง</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">จัดการ</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <SearchIconX />
                        <span className="font-medium">ไม่พบข้อมูลที่ค้นหา</span>
                        <span className="text-xs">ลองเปลี่ยนคำค้นหาหรือตัวกรองสถานะ</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  tickets.map((ticket) => (
                    <TicketRow
                      key={ticket.id}
                      // ⚠️ ต้องแปลง Date เป็น String ก่อนส่งเข้า Client Component เพื่อป้องกัน Error
                      ticket={{
                        ...ticket,
                        createdAt: ticket.createdAt.toISOString(),
                        updatedAt: ticket.updatedAt.toISOString(),
                        deadline: ticket.deadline?.toISOString() || null,
                        resolvedAt: ticket.resolvedAt?.toISOString() || null,
                      }}
                      agents={agents}
                      userRole={userRole}
                      currentUserId={session.user.id}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Realtime Components */}
      <RealtimeListener />
      <TicketNotification
        role={session?.user?.role || "USER"}
        userId={session?.user?.id || ""}
      />
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  return (
    <div className={`p-5 rounded-lg shadow-sm border ${color} flex items-center justify-between`}>
      <div>
        <p className="text-slate-500 text-xs uppercase font-semibold">{title}</p>
        <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
      </div>
      <div className="text-slate-400 opacity-50">{icon}</div>
    </div>
  );
}

function SearchIconX() {
  return (
    <svg className="w-10 h-10 text-slate-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}