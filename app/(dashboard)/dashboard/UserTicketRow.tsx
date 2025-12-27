"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";

export function UserTicketRow({ ticket }: { ticket: any }) {
  const router = useRouter();

  const handleRowClick = (e: React.MouseEvent) => {
    // ป้องกัน: ถ้ากดโดนลิ้งค์หรือปุ่ม ไม่ต้องสั่งเปลี่ยนหน้า (ให้มันทำงานตามปกติ)
    if ((e.target as HTMLElement).closest("a, button")) {
      return;
    }
    // ถ้ากดพื้นที่ว่างๆ ให้ไปหน้า Detail
    router.push(`/tickets/${ticket.id}`);
  };

  return (
    <tr
      onClick={handleRowClick}
      className="hover:bg-slate-50 transition-colors duration-150 cursor-pointer group"
    >
      {/* 1. สถานะ */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
            ticket.status === "OPEN"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : ticket.status === "IN_PROGRESS"
              ? "bg-blue-50 text-blue-700 border-blue-200"
              : "bg-slate-100 text-slate-600 border-slate-200"
          }`}
        >
          {ticket.status === "OPEN" && <CheckCircle2 size={12} className="mr-1.5" />}
          {ticket.status === "IN_PROGRESS" && <Clock size={12} className="mr-1.5" />}
          {ticket.status}
        </span>
      </td>

      {/* 2. หัวข้อปัญหา */}
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-900 line-clamp-1 group-hover:text-blue-700 transition-colors">
            {ticket.title}
          </span>
          <span className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
            รหัส: #{ticket.id.slice(-4)}
            {ticket.imageUrl && (
              <span className="flex items-center text-blue-600 ml-2 bg-blue-50 px-1.5 py-0.5 rounded text-[10px]">
                ภาพแนบ
              </span>
            )}
          </span>
        </div>
      </td>

      {/* 3. ความด่วน */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          {ticket.priority === "URGENT" && <AlertCircle size={14} className="text-red-600" />}
          <span
            className={`text-sm font-semibold ${
              ticket.priority === "URGENT" || ticket.priority === "HIGH"
                ? "text-red-600"
                : ticket.priority === "LOW"
                ? "text-slate-500"
                : "text-blue-600"
            }`}
          >
            {ticket.priority}
          </span>
        </div>
      </td>

      {/* 4. วันที่แจ้ง (ต้องแปลง string กลับเป็น Date ก่อน format) */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
        {format(new Date(ticket.createdAt), "dd MMM yy", { locale: th })}
        <span className="text-slate-400 text-xs ml-2">
          {format(new Date(ticket.createdAt), "HH:mm น.", { locale: th })}
        </span>
      </td>

      {/* 5. จัดการ (Link) */}
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <Link
          href={`/tickets/${ticket.id}`}
          className="text-blue-700 hover:text-blue-900 text-sm font-medium hover:underline decoration-blue-700/30 underline-offset-4"
        >
          รายละเอียด
        </Link>
      </td>
    </tr>
  );
}