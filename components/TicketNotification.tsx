"use client";

import { useEffect, useRef, useState } from "react";
import { getMyActiveTickets, getOpenTicketsForAdmin } from "@/app/admin/actions";
import { X, BellRing, Briefcase, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
//import { useSession } from "next-auth/react"; // ใช้เช็ค Role ฝั่ง Client

type TicketData = {
    id: string;
    title: string;
    priority: string;
};

type Props = {
    role: string;   // รับ Role (ADMIN / AGENT)
    userId: string; // รับ ID ของ User
};

export function TicketNotification({ role, userId }: Props) {
    const router = useRouter();

    const [showPopup, setShowPopup] = useState(false);
    const [newTicket, setNewTicket] = useState<TicketData | null>(null);

    const knownTicketIds = useRef<Set<string>>(new Set());
    const isFirstLoad = useRef(true);

    useEffect(() => {
        // ถ้าไม่มี userId ส่งมา (ยังไม่ล็อกอิน) ไม่ต้องทำอะไร
        if (!userId) return;

        const checkTickets = async () => {
            let tickets: TicketData[] = [];

            // 👇 ใช้ prop "role" แทน session.user.role
            if (role === "ADMIN") {
                tickets = await getOpenTicketsForAdmin();
            } else {
                tickets = await getMyActiveTickets();
            }

            // ตรวจสอบว่ามีงานใหม่ที่ไม่เคยเห็นไหม
            let hasNew = false;

            tickets.forEach((t) => {
                // ถ้า ID นี้ไม่อยู่ในความทรงจำ (knownTicketIds)
                if (!knownTicketIds.current.has(t.id)) {

                    // ถ้าไม่ใช่การโหลดหน้าเว็บครั้งแรก -> ให้แสดง Popup
                    if (!isFirstLoad.current) {
                        setNewTicket(t);
                        setShowPopup(true);
                        hasNew = true;
                        playNotificationSound(); // เล่นเสียง (ถ้ามี)
                    }

                    // จำ ID นี้ไว้ จะได้ไม่เด้งซ้ำ
                    knownTicketIds.current.add(t.id);
                }
            });

            // จบรอบแรกแล้ว ปิด flag isFirstLoad
            if (isFirstLoad.current) {
                tickets.forEach(t => knownTicketIds.current.add(t.id));
                isFirstLoad.current = false;
            }

            // ถ้ามีข้อมูลใหม่ สั่ง Refresh หน้าจอเพื่อให้ตารางอัปเดต
            if (hasNew) {
                router.refresh();
            }
        };

        // 1. เรียกทำงานทันที 1 ครั้ง
        checkTickets();

        // 2. ตั้งเวลาเรียกซ้ำทุกๆ 10 วินาที (Polling)
        const intervalId = setInterval(checkTickets, 10000);

        // เคลียร์ interval เมื่อปิดหน้าเว็บ
        return () => clearInterval(intervalId);
    }, [router, role, userId]); // ทำงานใหม่ถ้า session เปลี่ยน

    // ฟังก์ชันเล่นเสียง (Optional)
    const playNotificationSound = () => {
        try {
            // ต้องมีไฟล์ public/notification.mp3 หรือใช้เสียงมาตรฐาน
            // const audio = new Audio("/notification.mp3");
            // audio.play().catch(() => {});
        } catch (e) {
            console.error(e);
        }
    };

    // ถ้าไม่มีข้อมูลงานใหม่ หรือไม่ได้สั่งให้โชว์ -> ไม่ต้อง Render อะไร
    if (!showPopup || !newTicket) return null;

    // กำหนดสีและความด่วน
    const isUrgent = newTicket.priority === 'URGENT' || newTicket.priority === 'HIGH';
    const isAdmin = role === 'ADMIN';

    return (
        <div className="fixed bottom-5 right-5 z-[100] animate-bounce-in">
            <div className={`bg-white border-l-4 shadow-2xl rounded-lg p-4 w-80 relative flex gap-3 items-start ${isUrgent ? 'border-red-500' : 'border-blue-500'
                }`}>

                {/* ICON */}
                <div className={`p-2 rounded-full mt-1 ${isUrgent ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                    {isAdmin ? <AlertCircle size={24} /> : <Briefcase size={24} />}
                </div>

                {/* CONTENT */}
                <div className="flex-1">
                    <h4 className={`font-bold text-sm ${isUrgent ? 'text-red-700' : 'text-slate-800'}`}>
                        {isAdmin ? 'มีงานแจ้งซ่อมใหม่เข้ามา!' : 'คุณได้รับมอบหมายงาน!'}
                    </h4>

                    <p className="text-slate-600 text-xs mt-1 line-clamp-2 font-medium">
                        {newTicket.title}
                    </p>

                    <div className="mt-2 flex items-center justify-between">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${isUrgent ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-100 text-slate-500'
                            }`}>
                            {newTicket.priority}
                        </span>

                        <button
                            onClick={() => {
                                setShowPopup(false);
                                // ถ้าอยากให้กดแล้วเด้งไปหน้า Detail ให้เปิดบรรทัดนี้:
                                // router.push(`/tickets/${newTicket.id}`);
                            }}
                            className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
                        >
                            รับทราบ
                        </button>
                    </div>
                </div>

                {/* CLOSE BUTTON */}
                <button
                    onClick={() => setShowPopup(false)}
                    className="absolute top-2 right-2 text-slate-300 hover:text-slate-500 transition"
                >
                    <X size={16} />
                </button>

            </div>
        </div>
    );
}