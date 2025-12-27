"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateUserRole(userId: string, newRole: Role) {
  const session = await auth();
  
  // เช็คความปลอดภัย: ต้องเป็น ADMIN เท่านั้นถึงจะเปลี่ยนยศคนอื่นได้
  if (session?.user?.role !== "ADMIN") return;

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });
    
    revalidatePath("/admin/users"); // รีเฟรชหน้า User
    revalidatePath("/admin");       // รีเฟรชหน้า Dashboard ด้วย (เผื่อ dropdown agent เปลี่ยน)
    console.log(`✅ Changed role of ${userId} to ${newRole}`);
  } catch (error) {
    console.error("Failed to update role:", error);
  }
}