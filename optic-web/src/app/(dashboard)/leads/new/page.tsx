"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCreateLead } from "@/hooks/useLeads";
import LeadForm from "@/components/leads/LeadForm";
import type { CreateLeadFormData } from "@/types";

export default function NewLeadPage() {
  const router     = useRouter();
  const createLead = useCreateLead();

  const handleSubmit = async (data: CreateLeadFormData) => {
    try {
      const lead = await createLead.mutateAsync(data);
      router.push(`/leads/${lead.id}`);
    } catch {
      // Error handled in hook
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back */}
      <Link
        href="/leads"
        prefetch={true}
        className="inline-flex items-center gap-1.5 text-sm mb-6 transition-colors"
        style={{ color: "#4D5568" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#9198A8")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#4D5568")}
      >
        <ArrowLeft size={14} />
        Back to leads
      </Link>

      <div
        className="rounded-2xl p-8"
        style={{ background: "#0D0F18", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="mb-6">
          <h1
            className="text-2xl font-semibold mb-1"
            style={{ color: "#FFFFFF", fontFamily: "Inter, sans-serif", letterSpacing: "-0.02em" }}
          >
            New Lead
          </h1>
          <p className="text-sm" style={{ color: "#4D5568" }}>
            AI will automatically analyze the inquiry message after you save.
          </p>
        </div>

        <LeadForm
          onSubmit={handleSubmit}
          isSubmitting={createLead.isPending}
          submitLabel="Create Lead & Analyze"
        />
      </div>
    </div>
  );
}
