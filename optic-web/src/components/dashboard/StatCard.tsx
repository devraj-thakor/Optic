"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title:     string;
  value:     number | string;
  icon:      LucideIcon;
  color:     string;
  delta?:    string;
  subtitle?: string;
  index?:    number;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  color,
  delta,
  subtitle,
  index = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="rounded-xl p-5 flex flex-col gap-4"
      style={{
        background: "#0A0B10",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium" style={{ color: "#94A3B8" }}>
          {title}
        </p>
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: `${color}15` }}
        >
          <Icon size={17} style={{ color }} />
        </div>
      </div>

      <div>
        <p
          className="text-3xl font-bold tracking-tight tabular-nums"
          style={{ fontFamily: "Inter, sans-serif", color: "#FFFFFF" }}
        >
          {value}
        </p>
        {subtitle && (
          <p className="text-xs mt-1" style={{ color: "#94A3B8" }}>
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );
}
