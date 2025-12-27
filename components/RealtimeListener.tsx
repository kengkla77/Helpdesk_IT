"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getLatestTicketUpdate } from "@/app/admin/actions"; 

export function RealtimeListener() {
  const router = useRouter();
  const lastUpdateRef = useRef<string | null>(null);

  useEffect(() => {
    const checkUpdate = async () => {
      // 1. ถาม Server ว่าอัปเดตล่าสุดเมื่อไหร่
      const serverLastUpdate = await getLatestTicketUpdate();

      // 2. ถ้าเป็นรอบแรก (เพิ่งเปิดหน้าเว็บ) ให้จำค่าไว้ก่อน ยังไม่ต้อง Refresh
      if (lastUpdateRef.current === null) {
        lastUpdateRef.current = serverLastUpdate;
        return;
      }

      // 3. ถ้าเวลาที่ได้มา ไม่ตรงกับที่จำไว้ แสดงว่ามีข้อมูลใหม่!
      if (serverLastUpdate !== lastUpdateRef.current) {
        console.log("⚡ Found new data! Refreshing...");
        lastUpdateRef.current = serverLastUpdate; // อัปเดตเวลาล่าสุด
        router.refresh(); // สั่งรีเฟรชข้อมูลในหน้าจอ (Soft Refresh)
      }
    };

    // ตั้งเวลาให้ทำงานทุกๆ 5 วินาที
    const interval = setInterval(checkUpdate, 5000);

    return () => clearInterval(interval);
  }, [router]);

  return null; // Component นี้ไม่มีหน้าตา ทำงานเบื้องหลัง
}