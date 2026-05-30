"use client";
// Minimal topbar — just spacing for visual consistency.
// Breadcrumb and search/bell buttons have been removed per design spec.

export default function Header() {
  return (
    <div
      className="h-[60px] flex-shrink-0"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    />
  );
}
