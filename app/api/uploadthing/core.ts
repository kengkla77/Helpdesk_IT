import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
// import { auth } from "@/auth"; // <--- 1. ปิดบรรทัดนี้

const f = createUploadthing();

export const ourFileRouter = {
  ticketAttachment: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      // --- 2. ปิดส่วนเช็ค Auth เดิมทิ้งไปก่อน ---
      // const session = await auth();
      // if (!session?.user) throw new UploadThingError("Unauthorized");
      // return { userId: session.user.id };

      // --- 3. ใส่ Code นี้แทน (Bypass) ---
      console.log("⚠️ Bypassing Auth for testing...");
      return { userId: "test-user-123" }; 
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("✅ Upload SUCCESS:", file.url);
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;