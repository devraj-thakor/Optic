"use client";
import { Menu } from "lucide-react";
import { useUIStore } from "@/store/uiStore";

export default function Header() {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  return (
    <div
      className="h-[60px] flex-shrink-0 flex items-center px-4"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <button
        onClick={toggleSidebar}
        className="p-2 -ml-2 md:hidden text-[#94A3B8] hover:text-white transition-colors"
      >
        <Menu size={20} />
      </button>
    </div>
  );
}
