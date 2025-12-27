import { NextResponse } from "next/server";
import { PrismaClient, Priority } from "@prisma/client";
import { addHours } from "date-fns";

const prisma = new PrismaClient();

// ฟังก์ชันคำนวณ SLA Deadline
function calculateDeadline(priority: Priority) {
  const now = new Date();
  switch (priority) {
    case "URGENT": return addHours(now, 4);  // ด่วนมาก: 4 ชม.
    case "HIGH":   return addHours(now, 8);  // ด่วน: 8 ชม.
    case "NORMAL": return addHours(now, 24); // ปกติ: 24 ชม.
    case "LOW":    return addHours(now, 48); // ต่ำ: 48 ชม.
    default:       return addHours(now, 24);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, contactEmail, priority } = body;

    // คำนวณ Deadline ทันทีที่รับเรื่อง
    const deadline = calculateDeadline(priority);

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        contactEmail,
        priority: priority as Priority,
        deadline,
      },
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error creating ticket" }, { status: 500 });
  }
}

export async function GET() {
  const tickets = await prisma.ticket.findMany({
    orderBy: { createdAt: 'desc' } // เรียงจากใหม่ไปเก่า
  });
  return NextResponse.json(tickets);
}