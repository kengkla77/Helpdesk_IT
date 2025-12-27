import type { Metadata } from "next";
// 1. เปลี่ยนจาก Prompt เป็น IBM Plex Sans Thai
import { IBM_Plex_Sans_Thai } from "next/font/google"; 

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";

import "./globals.css";
import "@uploadthing/react/styles.css";

// 2. ตั้งค่าฟอนต์ (Apple Style: ไม่มีหัว, ทันสมัย)
const ibmPlex = IBM_Plex_Sans_Thai({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "thai"],
  display: "swap",
  variable: "--font-ibm",
});

export const metadata: Metadata = {
  title: "IT Helpdesk",
  description: "Helpdesk System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      {/* 3. เรียกใช้ className */}
      <body className={ibmPlex.className}>
        <NextSSRPlugin
          routerConfig={extractRouterConfig(ourFileRouter)}
        />
        {children}
      </body>
    </html>
  );
}