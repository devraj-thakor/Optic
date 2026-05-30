"use client";

import { ChannelIcon } from "@/components/ui/ChannelIcon";

interface ChannelCardProps {
    name: string;
    channelKey: any;
    desc: string;
    color: string;
}

export function ChannelCard({ name, channelKey, desc, color }: ChannelCardProps) {
    return (
        <div
            className="rounded-xl p-5 flex flex-col items-center gap-3 transition-all group relative overflow-hidden"
            style={{
                background: "rgba(255,255,255,0.02)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.border = `1px solid ${color}40`;
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${color}15, inset 0 1px 0 rgba(255,255,255,0.1)`;
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.06)";
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
                (e.currentTarget as HTMLElement).style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.05)";
            }}
        >
            <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: `${color}14`, color }}
            >
                <ChannelIcon channel={channelKey} size={22} />
            </div>
            <div className="text-center">
                <p className="font-semibold text-sm mb-0.5" style={{ color: "#FFFFFF" }}>
                    {name}
                </p>
                <p className="text-xs" style={{ color: "#94A3B8" }}>
                    {desc}
                </p>
            </div>
        </div>
    );
}