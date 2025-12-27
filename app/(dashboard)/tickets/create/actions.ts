"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma"; 
import { Priority } from "@prisma/client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { addHours } from "date-fns";

export async function createTicketAction(formData: FormData) {
  console.log("🚀 Server Action Started");

  // 1. เช็ค Session (ถ้าคุณ Bypass Auth อยู่ ส่วนนี้อาจจะข้ามไป แต่ใส่ไว้เพื่อความถูกต้อง)
  const session = await auth();
  
  // ⚠️ หมายเหตุ: ถ้าช่วงนี้ Login ไม่ได้ ให้แก้บรรทัด requesterId ข้างล่างเป็นค่า String มั่วๆ ไปก่อน
  if (!session?.user?.id) {
     console.log("⚠️ No User found in session (Check Auth)");
     // return; // ปิด return ชั่วคราวถ้าจะ test แบบไม่มี user
  }
  const userId = session?.user?.id || "test-user-id-123"; // Fallback ID

  // 2. ดึงค่าจาก Form
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as Priority;
  const imageUrl = formData.get("imageUrl") as string; // รับค่าจาก Input ที่เราสร้างไว้

  console.log("📝 Data Received:", { title, priority, imageUrl });

  // คำนวณ Deadline
  const now = new Date();
  let deadline = addHours(now, 24);
  switch (priority) {
    case "URGENT": deadline = addHours(now, 4); break;
    case "HIGH":   deadline = addHours(now, 8); break;
    case "NORMAL": deadline = addHours(now, 24); break;
    case "LOW":    deadline = addHours(now, 48); break;
  }

  try {
    // 3. บันทึกลงฐานข้อมูล
    const newTicket = await prisma.ticket.create({
      data: {
        title,
        description,
        priority,
        deadline,
        imageUrl: imageUrl || null, // ถ้าเป็น string ว่างๆ ให้ส่ง null
        status: "OPEN",
        requesterId: userId, 
      },
    });
    
    console.log("✅ Database Save Success:", newTicket.id);
  } catch (error) {
    console.error("❌ Database Error Details:", error);
    // ไม่ redirect ถ้า error จะได้เห็น log
    throw error; 
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}