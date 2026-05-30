"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LEAD_SOURCE_LIST, LEAD_STATUS_LIST, LEAD_PRIORITY_LIST, LEAD_SOURCES, LEAD_STATUSES, LEAD_PRIORITIES } from "@/constants";
import type { CreateLeadFormData, Lead } from "@/types";

const schema = z.object({
  name:            z.string().min(1, "Name is required"),
  email:           z.string().email("Invalid email").optional().or(z.literal("")),
  phone:           z.string().optional(),
  source:          z.enum(["website", "whatsapp", "instagram", "facebook", "linkedin", "referral"]),
  inquiry_message: z.string().min(10, "Inquiry must be at least 10 characters"),
  status:          z.enum(["new", "contacted", "qualified", "closed"]).optional(),
  priority:        z.enum(["low", "medium", "high"]).optional(),
});

type FormData = z.infer<typeof schema>;

interface LeadFormProps {
  defaultValues?: Partial<Lead>;
  onSubmit:       (data: CreateLeadFormData) => void;
  isSubmitting:   boolean;
  submitLabel?:   string;
}

export default function LeadForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel = "Save Lead",
}: LeadFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver:      zodResolver(schema),
    defaultValues: {
      name:            defaultValues?.name || "",
      email:           defaultValues?.email || "",
      phone:           defaultValues?.phone || "",
      source:          defaultValues?.source || "website",
      inquiry_message: defaultValues?.inquiry_message || "",
      status:          defaultValues?.status || "new",
      priority:        defaultValues?.priority || "medium",
    },
  });

  const inputClass = "input-optic w-full px-4 py-3 text-sm";
  const labelClass = "block text-sm font-medium mb-2";
  const labelStyle = { color: "#4D5568" };
  const errorClass = "mt-1 text-xs";
  const errorStyle = { color: "#F87171" };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Name */}
        <div>
          <label className={labelClass} style={labelStyle}>Full Name *</label>
          <input id="lead-name" type="text" placeholder="Sarah Chen" className={inputClass} {...register("name")} />
          {errors.name && <p className={errorClass} style={errorStyle}>{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className={labelClass} style={labelStyle}>Email</label>
          <input id="lead-email" type="email" placeholder="sarah@company.io" className={inputClass} {...register("email")} />
          {errors.email && <p className={errorClass} style={errorStyle}>{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className={labelClass} style={labelStyle}>Phone</label>
          <input id="lead-phone" type="tel" placeholder="+66 81 234 5678" className={inputClass} {...register("phone")} />
        </div>

        {/* Source */}
        <div>
          <label className={labelClass} style={labelStyle}>Channel *</label>
          <select id="lead-source" className={inputClass + " cursor-pointer"} {...register("source")}>
            {LEAD_SOURCE_LIST.map((s) => (
              <option key={s} value={s}>{LEAD_SOURCES[s].label}</option>
            ))}
          </select>
          {errors.source && <p className={errorClass} style={errorStyle}>{errors.source.message}</p>}
        </div>

        {/* Status */}
        <div>
          <label className={labelClass} style={labelStyle}>Status</label>
          <select id="lead-status" className={inputClass + " cursor-pointer"} {...register("status")}>
            {LEAD_STATUS_LIST.map((s) => (
              <option key={s} value={s}>{LEAD_STATUSES[s].label}</option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className={labelClass} style={labelStyle}>Priority</label>
          <select id="lead-priority" className={inputClass + " cursor-pointer"} {...register("priority")}>
            {LEAD_PRIORITY_LIST.map((p) => (
              <option key={p} value={p}>{LEAD_PRIORITIES[p].label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Inquiry message */}
      <div>
        <label className={labelClass} style={labelStyle}>Inquiry Message *</label>
        <textarea
          id="lead-inquiry"
          rows={5}
          placeholder="Paste the lead's inquiry message here..."
          className={inputClass + " resize-y"}
          {...register("inquiry_message")}
        />
        {errors.inquiry_message && <p className={errorClass} style={errorStyle}>{errors.inquiry_message.message}</p>}
        <p className="mt-1 text-xs" style={{ color: "#475569" }}>
          AI will automatically analyze this message and generate insights.
        </p>
      </div>

      {/* Submit */}
      <button
        id="lead-submit"
        type="submit"
        disabled={isSubmitting}
        className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition-all"
        style={{
          background: isSubmitting ? "rgba(75,110,245,0.5)" : "#4B6EF5",
          color:      "#FFFFFF",
        }}
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Saving...
          </>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );
}
