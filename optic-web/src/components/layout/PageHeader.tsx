"use client";

interface PageHeaderProps {
  /** Main page title */
  title: string;
  /** Optional subtitle shown below title */
  subtitle?: string;
  /** Optional right-side content (buttons, badges, etc.) */
  actions?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="mb-7">
      <div className="flex items-end justify-between">
        <div>
          <h1
            className="text-4xl font-light tracking-tight"
            style={{ color: "#FFFFFF", fontFamily: "Inter, sans-serif", lineHeight: 1.1 }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm" style={{ color: "#94A3B8" }}>
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
