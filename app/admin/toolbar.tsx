"use client";

import { Search, Filter, X } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";

export function AdminToolbar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const initialSearch = searchParams.get("q") || "";
  const initialStatus = searchParams.get("status") || "ALL";

  const [searchTerm, setSearchTerm] = useState(initialSearch);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const params = new URLSearchParams(searchParams);
    if (term) params.set("q", term);
    else params.delete("q");
    
    const timeoutId = setTimeout(() => {
      replace(`${pathname}?${params.toString()}`);
    }, 500);
    return () => clearTimeout(timeoutId);
  };

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams);
    if (status && status !== "ALL") params.set("status", status);
    else params.delete("status");
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-row items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
      
      {/* 1. ช่องค้นหา - Compact modern style */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
          <Search size={15} />
        </div>
        <input
          type="text"
          placeholder="ค้นหางาน..."
          className="pl-8 pr-7 py-1.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-48 bg-white transition-all"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {searchTerm && (
           <button 
             onClick={() => handleSearch("")}
             className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400 hover:text-slate-700 transition"
           >
             <X size={13} />
           </button>
        )}
      </div>

      {/* 2. Divider */}
      <div className="h-6 w-px bg-slate-300"></div>

      {/* 3. ตัวกรอง - Badge style */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-500">
          <Filter size={14} />
        </div>
        <select
          className="pl-8 pr-7 py-1.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white w-40 appearance-none cursor-pointer transition-all font-medium text-slate-700"
          defaultValue={initialStatus}
          onChange={(e) => handleStatusChange(e.target.value)}
        >
          <option value="ALL">ทั้งหมด</option>
          <option value="OPEN">รอรับเรื่อง</option>
          <option value="IN_PROGRESS">กำลังซ่อม</option>
          <option value="CLOSED">เสร็จสิ้น</option>
          <option value="CANCELLED">ยกเลิก</option>
        </select>
        <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-slate-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
            </svg>
        </div>
      </div>
    </div>
  );
}