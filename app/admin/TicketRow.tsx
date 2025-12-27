"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { AlertCircle, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { updateTicketStatus, claimTicket } from "./actions"; 
import { AssignDropdown } from "./AssignDropdown";

// รับ Props ทุกอย่างที่ต้องใช้ในการแสดงผล
export function TicketRow({ ticket, agents, userRole, currentUserId }: any) {
  const router = useRouter();

  // ฟังก์ชันดักจับการคลิก
  const handleRowClick = (e: React.MouseEvent) => {
    // ⚠️ สำคัญ: เช็คว่าสิ่งที่คลิก "ไม่ใช่" ปุ่ม, ลิงก์, ฟอร์ม, หรือ Dropdown
    if ((e.target as HTMLElement).closest("button, a, select, form, input")) {
      return; // ถ้าใช่ ให้จบการทำงาน (ไม่เปลี่ยนหน้า)
    }
    
    // ถ้าคลิกพื้นที่ว่างๆ ในแถว -> ไปหน้า Detail
    router.push(`/tickets/${ticket.id}`);
  };

  return (
    <tr 
      onClick={handleRowClick} 
      className="hover:bg-slate-50 transition cursor-pointer group" // เพิ่ม cursor-pointer
    >
        {/* 1. สถานะ */}
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
            ticket.status === "OPEN" ? "bg-yellow-100 text-yellow-800 border-yellow-200" :
            ticket.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-800 border-blue-200" :
            "bg-green-100 text-green-800 border-green-200"
          }`}>
            {ticket.status}
          </span>
        </td>

        {/* 2. ความด่วน */}
        <td className="px-6 py-4 whitespace-nowrap">
          {ticket.priority === "URGENT" || ticket.priority === "HIGH" ? (
            <span className="flex items-center gap-1 text-red-600 font-bold text-xs">
              <AlertCircle size={14} /> {ticket.priority}
            </span>
          ) : (
            <span className="text-slate-500 text-xs font-medium">{ticket.priority}</span>
          )}
        </td>

        {/* 3. รายละเอียดปัญหา (แสดงผล) */}
        <td className="px-6 py-4">
          <div className="text-sm font-medium text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {ticket.title}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center">
             {/* แปลงวันที่ string กลับมา format */}
            {format(new Date(ticket.createdAt), "d MMM yy HH:mm", { locale: th })}
            {ticket.imageUrl && <span className="ml-2 text-blue-600 bg-blue-50 px-1 rounded text-[10px] border border-blue-100">มีรูป</span>}
          </div>
        </td>

        {/* 4. ผู้รับผิดชอบ */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center gap-2">
            {ticket.assignee?.name && (
              <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold border border-indigo-200" title={ticket.assignee.name}>
                {ticket.assignee.name.charAt(0)}
              </div>
            )}

            {userRole === "ADMIN" ? (
              // ใส่ onClick={(e) => e.stopPropagation()} เพื่อกันเหนียว
              <div onClick={(e) => e.stopPropagation()}>
                <AssignDropdown
                  ticketId={ticket.id}
                  currentAgentId={ticket.assigneeId}
                  agents={agents}
                />
              </div>
            ) : (
              ticket.assigneeId ? (
                <span className="text-xs text-slate-500">
                  {ticket.assigneeId === currentUserId ? "(คุณรับงานนี้)" : ticket.assignee?.name}
                </span>
              ) : (
                <form action={claimTicket.bind(null, ticket.id)}>
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded text-[10px] shadow-sm transition">
                    รับงานเอง
                  </button>
                </form>
              )
            )}
          </div>
        </td>

        {/* 5. ผู้แจ้ง */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
              {(ticket.requester.name || "U").charAt(0)}
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-slate-900 truncate max-w-[100px]">
                {ticket.requester.name || "Unknown"}
              </div>
            </div>
          </div>
        </td>

        {/* 6. จัดการ */}
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div className="flex gap-2 justify-end md:justify-start">
            {ticket.status === "OPEN" && userRole === "ADMIN" && (
              <form action={updateTicketStatus.bind(null, ticket.id, "IN_PROGRESS")}>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition shadow-sm">
                  รับงาน
                </button>
              </form>
            )}

            {ticket.status === "IN_PROGRESS" && (
              <form action={updateTicketStatus.bind(null, ticket.id, "CLOSED")}>
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={userRole === 'AGENT' && ticket.assigneeId !== currentUserId}
                >
                  ปิดงาน
                </button>
              </form>
            )}
            
            <Link href={`/tickets/${ticket.id}`} className="text-slate-400 hover:text-slate-600 p-1">
              <MoreHorizontal size={20} />
            </Link>
          </div>
        </td>
    </tr>
  );
}