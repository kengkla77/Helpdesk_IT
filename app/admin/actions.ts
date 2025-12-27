"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TicketStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

// เปลี่ยนสถานะงาน (รับงาน/ปิดงาน)
export async function updateTicketStatus(ticketId: string, newStatus: TicketStatus) {
  const session = await auth();
  if (!session?.user) return;

  try {
    await prisma.ticket.update({
      where: { id: ticketId },
      data: { status: newStatus },
    });
    
    revalidatePath("/admin");
  } catch (error) {
    console.error("Failed to update status:", error);
  }
}

// จ่ายงานให้คนอื่น (สำหรับ ADMIN)
export async function assignTicket(ticketId: string, userId: string) {
  const session = await auth();
  if (!session?.user) return; 

  try {
    await prisma.ticket.update({
      where: { id: ticketId },
      data: { 
        assigneeId: userId,
        status: "IN_PROGRESS", 
      },
    });
    
    revalidatePath("/admin"); 
  } catch (error) {
    console.error("Failed to assign ticket:", error);
  }
}

// กดรับงานเอง (สำหรับ AGENT)
export async function claimTicket(ticketId: string) {
  const session = await auth();
  if (!session?.user) return;

  try {
    await prisma.ticket.update({
      where: { id: ticketId },
      data: { 
        assigneeId: session.user.id, // ใส่ชื่อตัวเองลงไป
        status: "IN_PROGRESS",
      },
    });
    revalidatePath("/admin");
  } catch (error) {
    console.error("Failed to claim ticket:", error);
  }
}

export async function getMyActiveTickets() {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    const tickets = await prisma.ticket.findMany({
      where: {
        assigneeId: session.user.id, // งานที่เป็นของฉัน
        status: "IN_PROGRESS",       // สถานะกำลังซ่อม
      },
      orderBy: { updatedAt: "desc" }, // เอาที่อัปเดตล่าสุดขึ้นก่อน
      select: {
        id: true,
        title: true,
        priority: true,
        updatedAt: true,
      }
    });
    return tickets;
  } catch (error) {
    return [];
  }
}

export async function getLatestTicketUpdate() {
  const session = await auth();
  if (!session?.user) return null;

  try {
    // ดึงเวลาของตั๋วใบที่เพิ่งมีการอัปเดตล่าสุดมา 1 ใบห
    const latestTicket = await prisma.ticket.findFirst({
      orderBy: { updatedAt: "desc" },
      select: { updatedAt: true }, // เอาแค่เวลามาก็พอ ประหยัดเน็ต
    });

    return latestTicket?.updatedAt?.toISOString() || null;
  } catch (error) {
    return null;
  }
}

export async function getOpenTicketsForAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return [];

  try {
    const tickets = await prisma.ticket.findMany({
      where: {
        status: "OPEN", // เอาเฉพาะงานเปิดใหม่
      },
      orderBy: { createdAt: "desc" }, // เอาล่าสุดขึ้นก่อน
      take: 5, // ดึงมาแค่ 5 อันล่าสุดก็พอ
      select: {
        id: true,
        title: true,
        priority: true,
      }
    });
    return tickets;
  } catch (error) {
    return [];
  }
}