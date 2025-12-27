// src/app/api/tickets/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(
  request: Request,
  // แก้ไข Type ตรงนี้ให้เป็น Promise
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    // เพิ่ม await ตรงนี้เพื่อดึงค่า id ออกมาจาก Promise
    const { id } = await params; 
    
    const body = await request.json();
    const { status } = body;

    let updateData: any = { status };

    if (status === 'RESOLVED' || status === 'CLOSED') {
      updateData.resolvedAt = new Date();
    }

    const ticket = await prisma.ticket.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(ticket);
  } catch (error) {
    console.error(error); // เพิ่ม log เพื่อให้เห็น error ชัดเจนขึ้นถ้ามีปัญหาอื่น
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}