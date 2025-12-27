"use client";

import { useState } from "react";
import { UploadDropzone } from "@/utils/uploadthing";
import { createTicketAction } from "./actions";
import { Save, Loader2, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export default function CreateTicketForm() {
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // ✅ สถานะเช็คว่ากำลังอัปโหลดหรือไม่

  return (
    <form
      action={async (formData) => {
        setIsSubmitting(true);
        await createTicketAction(formData);
        setIsSubmitting(false);
      }}
      className="space-y-6"
    >
      {/* Input ซ่อนสำหรับส่ง URL ไปกับ Form (กลับมาใช้แบบ hidden เพื่อความสวยงาม) */}
      <input type="hidden" name="imageUrl" value={imageUrl} />

      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          หัวข้อปัญหา <span className="text-red-500">*</span>
        </label>
        <input
          name="title"
          required
          type="text"
          placeholder="เช่น คอมพิวเตอร์เปิดไม่ติด"
          className="w-full p-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Priority */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          ระดับความด่วน <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            name="priority"
            defaultValue="NORMAL"
            className="w-full p-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="LOW">🔵 ต่ำ (รอได้ 48 ชม.)</option>
            <option value="NORMAL">🟢 ปกติ (24 ชม.)</option>
            <option value="HIGH">🟠 สูง (8 ชม.)</option>
            <option value="URGENT">🔴 ด่วนมาก (4 ชม.)</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          รายละเอียดเพิ่มเติม <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          required
          rows={5}
          placeholder="ระบุรายละเอียด..."
          className="w-full p-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Upload Section */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          รูปภาพประกอบ (ถ้ามี)
        </label>
        
        {imageUrl ? (
          // กรณีมีรูปแล้ว
          <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-300 bg-gray-100 group">
            <Image src={imageUrl} alt="Uploaded" fill className="object-contain" />
            <button
              type="button"
              onClick={() => setImageUrl("")}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-md transition opacity-0 group-hover:opacity-100"
              title="ลบรูปภาพ"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          // กรณีไม่มีรูป
          <div className="space-y-2">
            <UploadDropzone
              endpoint="ticketAttachment"
              // ✅ 1. เริ่มอัปโหลด -> ล็อกปุ่ม
              onUploadBegin={() => {
                setIsUploading(true);
              }}
              // ✅ 2. อัปโหลดเสร็จ -> ปลดล็อกปุ่ม + เก็บ URL (เอา Alert ออกแล้ว)
              onClientUploadComplete={(res) => {
                setIsUploading(false);
                if (res && res[0]) {
                   setImageUrl(res[0].url);
                }
              }}
              // ✅ 3. อัปโหลดพลาด -> ปลดล็อกปุ่ม (เอา Alert ออกแล้ว)
              onUploadError={(error: Error) => {
                setIsUploading(false);
                console.error("Upload Error:", error); // ดู Error ใน Console แทน
              }}
              appearance={{
                  container: {
                      border: "2px dashed #ccc",
                      borderRadius: "8px",
                      background: "#f9fafb",
                      padding: "20px"
                  },
                  button: {
                      background: "#2563eb",
                      color: "white"
                  }
              }}
            />
            {/* ✅ เพิ่มคำอธิบาย */}
            <p className="text-ls text-red-700 text-center">
              * หลังเลือกรูปภาพแล้วกรุณากดอัปโหลดรูป (Uploadfile) <br />
              * กรุณารอให้อัปโหลดเสร็จสิ้น (รูปภาพจะขึ้นแสดง) ก่อนกดบันทึก
            </p>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        // ✅ ป้องกันการกดถ้ากำลังบันทึก หรือ กำลังอัปโหลด
        disabled={isSubmitting || isUploading}
        className={`w-full font-bold py-3 px-4 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 
          ${(isSubmitting || isUploading) 
            ? "bg-gray-400 cursor-not-allowed text-gray-100" 
            : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
      >
        {/* หมุนติ้วๆ ถ้าทำงานอยู่ */}
        {(isSubmitting || isUploading) ? <Loader2 className="animate-spin" /> : <Save size={20} />}
        
        {/* เปลี่ยนข้อความตามสถานะ */}
        {isUploading 
          ? "กำลังอัปโหลดรูป..." 
          : (isSubmitting ? "กำลังบันทึกข้อมูล..." : "บันทึกข้อมูล")}
      </button>
    </form>
  );
}