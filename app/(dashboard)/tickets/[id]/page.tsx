import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  User as UserIcon,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Image as ImageIcon,
  MoreVertical,
  ShieldAlert
} from "lucide-react";
import Image from "next/image";
import { Prompt } from "next/font/google";
import { assignTicket, closeTicket } from "./actions";

// Config Font
const prompt = Prompt({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

interface TicketDetailPageProps {
  params: {
    id: string; // ✅ แก้ชื่อตัวแปรให้ตรงกับโฟลเดอร์ [id]
  };
}

export default async function TicketDetailPage({ params }: TicketDetailPageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // 1. ดึงข้อมูล Ticket
  const ticket = await prisma.ticket.findUnique({
    where: { id: params.id }, // ✅ ใช้ params.id
    include: { requester: true },
  });

  if (!ticket) return notFound();

  // 🔒 2. Security Check: เช็คสิทธิ์
  const isOwner = ticket.requesterId === session.user.id;
  const isAdminOrAgent = session.user.role === "ADMIN" || session.user.role === "AGENT";

  // ถ้าไม่ใช่เจ้าของ และ ไม่ใช่ Admin -> ห้ามดู!
  if (!isOwner && !isAdminOrAgent) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-slate-50 ${prompt.className}`}>
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-slate-200 max-w-md mx-4">
          <div className="bg-red-100 p-4 rounded-full w-fit mx-auto mb-4">
            <ShieldAlert className="text-red-600" size={40} />
          </div>
          <h1 className="text-xl font-bold text-slate-800">ไม่มีสิทธิ์เข้าถึง</h1>
          <p className="text-slate-500 mt-2 text-sm">
            คุณไม่สามารถดูรายละเอียดของรายการนี้ได้
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex items-center justify-center px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition w-full"
          >
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 ${prompt.className}`}>

      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 h-16 flex items-center shadow-sm">
        <div className="max-w-5xl w-full mx-auto flex items-center justify-between">
          <Link
            href={isAdminOrAgent ? "/admin" : "/dashboard"}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-700 transition p-2 rounded-lg hover:bg-slate-50"
          >
            <ArrowLeft size={20} />
            <span className="font-medium text-sm">ย้อนกลับ</span>
          </Link>
          <span className="font-bold text-slate-700 text-sm hidden sm:block">
            ID: {ticket.id}
          </span>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto py-8 px-4">

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6 relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-2 h-full ${ticket.priority === "URGENT" || ticket.priority === "HIGH" ? "bg-red-500" : "bg-blue-500"
            }`}></div>

          <div className="pl-4">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${ticket.status === "OPEN" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                  ticket.status === "IN_PROGRESS" ? "bg-blue-50 text-blue-700 border-blue-200" :
                    "bg-slate-100 text-slate-600 border-slate-200"
                }`}>
                {ticket.status}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold border bg-slate-50 text-slate-600 border-slate-200">
                {ticket.priority}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-slate-800 mb-3">{ticket.title}</h1>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                {format(ticket.createdAt, "d MMM yyyy HH:mm", { locale: th })}
              </div>
              <div className="flex items-center gap-2">
                <UserIcon size={16} />
                ผู้แจ้ง: <span className="text-slate-700 font-medium">{ticket.requester.name}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: เนื้อหา */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2 pb-3 border-b border-slate-100">
                <FileText size={20} className="text-blue-600" />
                รายละเอียด
              </h3>
              <div className="text-slate-600 whitespace-pre-wrap leading-relaxed">
                {ticket.description}
              </div>
            </div>

            {ticket.imageUrl && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-base font-bold text-slate-800 mb-4 pb-3 border-b border-slate-100">
                  รูปภาพประกอบ
                </h3>
                <div className="relative w-full h-96 rounded-lg overflow-hidden border border-slate-100 bg-slate-50">
                  <Image src={ticket.imageUrl} alt="Attachment" fill className="object-contain" />
                </div>
              </div>
            )}
          </div>

          {/* Right: ปุ่มจัดการ (เฉพาะ Admin) */}
          <div className="space-y-6">
            {isAdminOrAgent && (
              <div className="bg-slate-800 text-white rounded-xl shadow-lg p-5">
                <h3 className="font-bold mb-4 text-sm uppercase flex items-center gap-2 text-slate-200 border-b border-slate-600 pb-2">
                  <MoreVertical size={16} /> Admin Management
                </h3>
                <div className="space-y-3">

                  {/* ปุ่มรับงาน: โชว์เฉพาะตอนสถานะ OPEN */}
                  {ticket.status === "OPEN" && (
                    <form action={assignTicket.bind(null, ticket.id)}>
                      <button
                        type="submit"
                        className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition shadow-sm flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={16} /> รับงานนี้ (Assign to me)
                      </button>
                    </form>
                  )}

                  {/* ปุ่มปิดงาน: โชว์เฉพาะตอนสถานะ IN_PROGRESS */}
                  {ticket.status === "IN_PROGRESS" && (
                    <form action={closeTicket.bind(null, ticket.id)}>
                      <button
                        type="submit"
                        className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium transition shadow-sm flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={16} /> ปิดงาน (Resolve)
                      </button>
                    </form>
                  )}

                  {/* สถานะอื่นๆ */}
                  {ticket.status === "CLOSED" && (
                    <div className="text-center py-2 text-slate-400 text-sm bg-slate-900/50 rounded-lg">
                      งานนี้ปิดแล้ว
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}