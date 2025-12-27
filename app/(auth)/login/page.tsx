import { signIn } from "@/auth"; // เรียกฟังก์ชัน Login จากที่เราตั้งค่าไว้
import { FaGoogle, FaMicrosoft, FaLine } from "react-icons/fa"; // ไอคอนสวยๆ

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      {/* ส่วน Card กลางจอ */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="bg-blue-600 p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">IT Helpdesk</h1>
          <p className="text-blue-100">ระบบแจ้งปัญหาและติดตามงาน</p>
        </div>

        {/* Body & Buttons */}
        <div className="p-8 space-y-6">
          <div className="text-center text-gray-500 text-sm mb-6">
            กรุณาเลือกช่องทางเข้าสู่ระบบ
          </div>

          <div className="space-y-3">
            {/* 1. ปุ่ม Google */}
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/dashboard" });
              }}
            >
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition-all shadow-sm"
              >
                <FaGoogle className="text-red-500 text-xl" />
                เข้าสู่ระบบด้วย Google
              </button>
            </form>

            {/* 2. ปุ่ม Microsoft (Azure AD) */}
            <form
              action={async () => {
                "use server";
                await signIn("microsoft-entra-id", { redirectTo: "/dashboard" });
              }}
            >
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 bg-[#2F2F2F] hover:bg-black text-white font-medium py-3 px-4 rounded-lg transition-all shadow-sm"
              >
                <FaMicrosoft className="text-xl" />
                เข้าสู่ระบบด้วย Microsoft
              </button>
            </form>

            {/* 3. ปุ่ม LINE */}
            <form
              action={async () => {
                "use server";
                await signIn("line", { redirectTo: "/dashboard" });
              }}
            >
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 bg-[#06C755] hover:bg-[#05b34c] text-white font-medium py-3 px-4 rounded-lg transition-all shadow-sm"
              >
                <FaLine className="text-2xl" />
                เข้าสู่ระบบด้วย LINE
              </button>
            </form>
          </div>
          
          {/* Footer เล็กๆ */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              ติดปัญหาการใช้งาน? ติดต่อ IT Support เบอร์ภายใน 1234
            </p>
          </div>
        </div>
      </div>
      
      {/* Copyright ด้านล่าง */}
      <p className="mt-8 text-center text-xs text-gray-400">
        © 2024 Polyfoam. All rights reserved.
      </p>
    </div>
  );
}