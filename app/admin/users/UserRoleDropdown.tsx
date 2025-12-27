"use client";

import { updateUserRole } from "./actions";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function UserRoleDropdown({ 
  userId, 
  currentRole 
}: { 
  userId: string; 
  currentRole: string 
}) {
  const [isPending, setIsPending] = useState(false);

  return (
    <div className="flex items-center gap-2">
      {isPending && <Loader2 className="animate-spin text-blue-600" size={16} />}
      <select
        defaultValue={currentRole}
        disabled={isPending}
        onChange={async (e) => {
          setIsPending(true);
          await updateUserRole(userId, e.target.value as any);
          setIsPending(false);
        }}
        className={`text-xs font-medium border rounded px-2 py-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          currentRole === "ADMIN" ? "bg-red-50 text-red-700 border-red-200" :
          currentRole === "AGENT" ? "bg-blue-50 text-blue-700 border-blue-200" :
          "bg-slate-50 text-slate-700 border-slate-200"
        }`}
      >
        <option value="USER">USER (พนักงาน)</option>
        <option value="AGENT">AGENT (ช่างเทคนิค)</option>
        <option value="ADMIN">ADMIN (ผู้ดูแลระบบ)</option>
      </select>
    </div>
  );
}