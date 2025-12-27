"use client";

import { assignTicket } from "./actions";

type User = { id: string; name: string | null };

export function AssignDropdown({ 
  ticketId, 
  currentAgentId, 
  agents 
}: { 
  ticketId: string; 
  currentAgentId: string | null; 
  agents: User[] 
}) {
  return (
    <select
      defaultValue={currentAgentId || ""}
      onChange={async (e) => {
        await assignTicket(ticketId, e.target.value);
      }}
      className="text-xs border border-slate-300 rounded p-1 max-w-[150px] cursor-pointer hover:border-blue-500 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
      onClick={(e) => e.stopPropagation()} // ป้องกันไม่ให้คลิกแล้วไปหน้า Detail
    >
      <option value="" disabled>-- เลือกผู้รับผิดชอบ --</option>
      {agents.map((agent) => (
        <option key={agent.id} value={agent.id}>
          👤 {agent.name || "Unknown"}
        </option>
      ))}
    </select>
  );
}