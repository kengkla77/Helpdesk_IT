"use client";

import { differenceInHours, differenceInMinutes, format } from "date-fns";
import { useState, useEffect } from "react";
import { RefreshCcw, CheckCircle, PlayCircle } from "lucide-react"; // ไอคอน

interface TicketProps {
  ticket: any;
  onStatusChange: (id: string, newStatus: string) => void;
}

export default function TicketCard({ ticket, onStatusChange }: TicketProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [slaColor, setSlaColor] = useState("bg-gray-100");

  // Logic คำนวณเวลาถอยหลัง
  useEffect(() => {
    const calculateTime = () => {
      if (!ticket.deadline || ticket.status === 'CLOSED' || ticket.status === 'RESOLVED') {
        setTimeLeft("Closed");
        setSlaColor("bg-gray-100 border-gray-300");
        return;
      }

      const now = new Date();
      const deadline = new Date(ticket.deadline);
      const diffInMinutes = differenceInMinutes(deadline, now);

      if (diffInMinutes < 0) {
        setTimeLeft(`เกินกำหนด ${Math.abs(diffInMinutes)} นาที`);
        setSlaColor("bg-red-100 border-red-500 text-red-700 animate-pulse"); // สีแดงกระพริบถ้าเกินเวลา
      } else {
        const hours = Math.floor(diffInMinutes / 60);
        const mins = diffInMinutes % 60;
        setTimeLeft(`เหลือเวลา ${hours} ชม. ${mins} นาที`);

        if (diffInMinutes < 60) { // เหลือน้อยกว่า 1 ชม.
          setSlaColor("bg-yellow-100 border-yellow-500 text-yellow-800");
        } else {
          setSlaColor("bg-green-100 border-green-500 text-green-800");
        }
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 60000); // อัปเดตทุก 1 นาที
    return () => clearInterval(timer);
  }, [ticket]);

  return (
    <div className={`p-4 rounded-lg border-l-4 shadow-sm bg-white mb-4 ${slaColor}`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
             {/* ป้ายแสดงความด่วน */}
            <span className={`text-xs font-bold px-2 py-0.5 rounded text-white
              ${ticket.priority === 'URGENT' ? 'bg-red-600' : 
                ticket.priority === 'HIGH' ? 'bg-orange-500' : 'bg-blue-500'}`}>
              {ticket.priority}
            </span>
            <span className="text-xs text-gray-500">#{ticket.id.slice(-4)}</span>
          </div>
          <h3 className="font-bold text-gray-800 text-lg">{ticket.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{ticket.description}</p>
          <p className="text-xs text-gray-400 mt-2">
            แจ้งโดย: {ticket.contactEmail} • {format(new Date(ticket.createdAt), "dd/MM HH:mm")}
          </p>
        </div>
        
        <div className="text-right min-w-[120px]">
          <div className="text-sm font-bold mb-2">{timeLeft}</div>
          
          {/* ปุ่ม Action */}
          <div className="flex gap-2 justify-end">
            {ticket.status === 'OPEN' && (
              <button 
                onClick={() => onStatusChange(ticket.id, 'IN_PROGRESS')}
                className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
              >
                <PlayCircle size={14} /> รับงาน
              </button>
            )}
            
            {ticket.status === 'IN_PROGRESS' && (
              <button 
                onClick={() => onStatusChange(ticket.id, 'RESOLVED')}
                className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700"
              >
                <CheckCircle size={14} /> ปิดงาน
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}