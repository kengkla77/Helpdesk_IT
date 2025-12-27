"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ฟังก์ชันรับงาน (Assign to me)
export async function assignTicket(ticketId: string) {
  const session = await auth();
  
  // เช็คสิทธิ์: ต้องเป็น Admin หรือ Agent เท่านั้น
  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "AGENT") {
    return;
  }

  await prisma.ticket.update({
    where: { id: ticketId },
    data: {
      status: "IN_PROGRESS", // เปลี่ยนสถานะ
      assigneeId: session.user.id, // ระบุว่าใครเป็นคนรับงาน
    },
  });

  // รีเฟรชหน้าเว็บให้ข้อมูลอัปเดตทันที
  revalidatePath(`/tickets/${ticketId}`);
  revalidatePath("/admin");
  revalidatePath("/dashboard");
}

// ฟังก์ชันปิดงาน (Resolve/Close)
export async function closeTicket(ticketId: string) {
  const session = await auth();

  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "AGENT") {
    return;
  }

  await prisma.ticket.update({
    where: { id: ticketId },
    data: {
      status: "CLOSED", // หรือ RESOLVED ตาม enum ของคุณ
      resolvedAt: new Date(), // ลงเวลาที่ปิดงาน
    },
  });

  revalidatePath(`/tickets/${ticketId}`);
  revalidatePath("/admin");
  revalidatePath("/dashboard");
}