import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import CreateTicketForm from "./CreateTicketForm"; // เรียกใช้ Form ที่แยกไว้

export default async function CreateTicketPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-blue-600 p-6 flex items-center gap-4 text-white">
          <Link href="/dashboard" className="hover:bg-blue-700 p-2 rounded-full transition">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold">แจ้งปัญหาใหม่</h1>
        </div>

        {/* เรียกใช้ Form Component ตรงนี้ */}
        <div className="p-8">
          <CreateTicketForm />
        </div>

      </div>
    </div>
  );
}