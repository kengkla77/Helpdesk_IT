import type { Config } from "tailwindcss";
import { withUt } from "uploadthing/tw";

const config: Config = {
  // 👇 จุดแก้สำคัญ: เพิ่ม path ให้ครอบคลุมทุกแบบ
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",     // สำหรับคนใช้โฟลเดอร์ src
    "./app/**/*.{js,ts,jsx,tsx,mdx}",     // สำหรับคนเอาไว้หน้าบ้าน (root)
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",   // สำหรับแบบเก่า
    "./components/**/*.{js,ts,jsx,tsx,mdx}" // สำหรับ component
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default withUt(config);