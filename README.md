# 🛠️ IT Support Helpdesk System (ระบบแจ้งซ่อมออนไลน์)

ระบบบริหารจัดการงานแจ้งซ่อมและปัญหาทางเทคนิคภายในองค์กร พัฒนาด้วย **Next.js 14** และ **TypeScript** โดยเน้นความรวดเร็ว ใช้งานง่าย และรองรับการทำงานแบบ Real-time

![Project Status](https://img.shields.io/badge/Status-Development-orange)
![Next.js](https://img.shields.io/badge/Next.js-14.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.22-teal)

## ✨ ฟีเจอร์หลัก (Key Features)

### 👤 สำหรับผู้ใช้งานทั่วไป (User)
* **Login with Google:** เข้าสู่ระบบด้วยอีเมลองค์กรผ่าน Google OAuth
* **Create Ticket:** แจ้งปัญหาใหม่ ระบุหัวข้อ รายละเอียด ความเร่งด่วน และแนบรูปภาพได้
* **Track Status:** ติดตามสถานะงานซ่อมของตนเองได้แบบ Real-time (Open, In Progress, Resolved)
* **History:** ดูประวัติการแจ้งซ่อมย้อนหลังทั้งหมด

### 🛠️ สำหรับเจ้าหน้าที่ (Agent)
* **Task Management:** ดูรายการงานที่ได้รับมอบหมาย (Assigned Tickets)
* **Update Status:** อัปเดตสถานะงานซ่อม (รับงาน / ปิดงาน)
* **Notifications:** ได้รับการแจ้งเตือนเมื่อมีงานใหม่เข้ามา หรือได้รับมอบหมายงาน

### 👑 สำหรับผู้ดูแลระบบ (Admin)
* **Dashboard:** ดูภาพรวมสถิติงานซ่อมทั้งหมด (Total, Open, Urgent)
* **Ticket Assignment:** จ่ายงานให้เจ้าหน้าที่ (Agent) ผ่านระบบ Dropdown
* **User Management:** จัดการผู้ใช้งานและกำหนดสิทธิ์ (Promote User/Agent/Admin)
* **Filter & Search:** ค้นหาและกรองงานซ่อมตามสถานะหรือความด่วน

---

## 🏗️ เทคโนโลยีที่ใช้ (Tech Stack)

* **Frontend & Framework:** [Next.js 14 (App Router)](https://nextjs.org/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Database & ORM:** [MySQL](https://www.mysql.com/) & [Prisma ORM](https://www.prisma.io/)
* **Authentication:** [Auth.js (NextAuth v5)](https://authjs.dev/)
* **File Upload:** [UploadThing](https://uploadthing.com/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Date Handling:** [date-fns](https://date-fns.org/) (Format วันที่ภาษาไทย)

---

## 🚀 การติดตั้งและเริ่มต้นใช้งาน (Installation)

### 1. สิ่งที่ต้องเตรียม (Prerequisites)
* Node.js (v20 LTS หรือใหม่กว่า)
* MySQL Database

### 2. ติดตั้ง Dependencies
```bash
git clone https://github.com/kengkla77/Helpdesk_IT.git
cd helpdesk-system
npm install
```

3. ตั้งค่า Environment Variables
สร้างไฟล์ .env ที่ root folder และกำหนดค่าดังนี้:
```
# Database Connection (MySQL)
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"

# NextAuth Configuration
# สร้างรหัสลับด้วยคำสั่ง: openssl rand -base64 32
AUTH_SECRET="your_generated_secret_key"
AUTH_URL="http://localhost:3000"

# Google OAuth (สำหรับ Login)
# ได้จาก Google Cloud Console > APIs & Services > Credentials
AUTH_GOOGLE_ID="your_google_client_id"
AUTH_GOOGLE_SECRET="your_google_client_secret"

# UploadThing (สำหรับอัปโหลดรูปภาพ)
UPLOADTHING_SECRET="your_uploadthing_secret"
UPLOADTHING_APP_ID="your_uploadthing_app_id"
```

4. ตั้งค่าฐานข้อมูล (Database Setup)
รันคำสั่งเพื่อให้ Prisma สร้างตารางใน Database ตามไฟล์ schema.prisma:
```
npx prisma db push
npx prisma generate
```

6. เริ่มต้นรันโปรเจกต์ (Run Development)
```
npm run dev
```
เปิดบราวเซอร์ไปที่ http://localhost:3000

📂 โครงสร้างโปรเจกต์ (Project Structure)
```
src/
├── app/
│   ├── (auth)/         # หน้า Login
│   ├── (dashboard)/    # Route Group (ใช้ Layout เดียวกัน)
│   │   ├── dashboard/  # หน้าแรกของ User (Overview)
│   │   └── tickets/    # หน้าสร้างและดูรายละเอียด Ticket
│   ├── admin/          # หน้า Admin Console & Dashboard
│   └── api/            # API Routes (Auth, UploadThing)
├── components/         # UI Components (Navbar, Cards, Dropdown)
├── lib/                # Utility Functions (Prisma Client, utils)
└── prisma/             # Database Schema
```


📜 สคริปต์คำสั่ง (Scripts)
คำสั่ง,รายละเอียด
```
npm run dev,รันเซิร์ฟเวอร์ในโหมดพัฒนา (Development)
npm run build,สร้าง Build สำหรับใช้งานจริง (Production)
npm start,รันเซิร์ฟเวอร์จากไฟล์ที่ Build แล้ว
npm run lint,ตรวจสอบคุณภาพโค้ดด้วย ESLint
npx prisma studio,เปิดหน้าเว็บจัดการฐานข้อมูล (GUI)
```

🔒 Security & Roles
ระบบใช้ Role-Based Access Control (RBAC) แบ่งสิทธิ์ดังนี้:
```
USER: แจ้งซ่อม, ดูงานตัวเอง

AGENT: รับงาน, อัปเดตงาน, ดูงานทั้งหมด

ADMIN: จัดการทุกอย่างในระบบ, ดูแล Users, มอบหมายงาน
```

🤝 Contributor
```
Developed by [Your Name/Team Name]
```
