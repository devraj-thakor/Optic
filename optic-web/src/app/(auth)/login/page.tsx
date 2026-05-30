"use client";

import { useEffect, useState, Suspense, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";

// --- CONFIGURATION HUB ---
const LAYOUT_CONFIG = {
  verticalPadding: 35,
  horizontalPadding: 16,
  verticalShift: "",
  logoBottomSpacing: "mb-4",
  footerTopSpacing: "mt-3",
};

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function OpticLogoIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="9" stroke="white" strokeWidth="1.5" fill="none" />
      <path d="M11 4L17 11L11 18L5 11L11 4Z" stroke="white" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <circle cx="11" cy="11" r="2.5" fill="white" />
    </svg>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoggingIn } = useAuth();
  const { isAuthenticated } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [dynamicScale, setDynamicScale] = useState(1);

  const from = searchParams.get("from") || "/dashboard";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const updateScale = useCallback(() => {
    if (!contentRef.current || !containerRef.current) return;

    contentRef.current.style.transform = 'none';
    const originalHeight = contentRef.current.offsetHeight;
    const originalWidth = contentRef.current.offsetWidth;

    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Uses the config object here
    const availableHeight = viewportHeight - LAYOUT_CONFIG.verticalPadding;
    const availableWidth = viewportWidth - LAYOUT_CONFIG.horizontalPadding;

    let scaleY = 1;
    let scaleX = 1;

    if (originalHeight > availableHeight) {
      scaleY = availableHeight / originalHeight;
    }

    if (originalWidth > availableWidth) {
      scaleX = availableWidth / originalWidth;
    }

    let finalScale = Math.min(scaleX, scaleY);
    finalScale = Math.min(1, finalScale);

    setDynamicScale(finalScale);

    contentRef.current.style.transform = `scale(${finalScale})`;
    contentRef.current.style.transformOrigin = 'center center';
  }, []);

  useEffect(() => {
    updateScale();
    window.addEventListener('resize', updateScale);
    window.addEventListener('orientationchange', updateScale);

    return () => {
      window.removeEventListener('resize', updateScale);
      window.removeEventListener('orientationchange', updateScale);
    };
  }, [updateScale]);

  useEffect(() => {
    updateScale();
  }, [updateScale, errors]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push(from);
    }
  }, [isAuthenticated, router, from]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await new Promise<void>((resolve, reject) => {
        login(data, {
          onSuccess: () => { router.push(from); resolve(); },
          onError: () => reject(),
        });
      });
    } catch {
      // Error handled in hook
    }
  };

  const fillDemo = () => {
    setValue("email", "founder@rethinklab.co");
    setValue("password", "optic2024");
  };

  return (
    <div
      ref={containerRef}
      className="h-dvh fixed inset-0 grid place-items-center overflow-hidden px-4"
      style={{ background: "#06070B" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 75% 20%, rgba(88,40,180,0.35) 0%, rgba(75,110,245,0.12) 40%, transparent 70%), radial-gradient(ellipse at 25% 80%, rgba(75,110,245,0.1) 0%, transparent 60%)",
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div ref={contentRef} className="relative z-10 w-full flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          layout
          className="w-full max-w-sm relative z-10 py-1"
        >
          {/* Logo Section */}
          <div className={`text-center mt-1 ${LAYOUT_CONFIG.logoBottomSpacing}`}>
            <div className="inline-flex items-center justify-center gap-2.5 mb-2"> {/* Tighter mb-3 to mb-2 */}
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center"
                style={{ background: "#4B6EF5" }}
              >
                <OpticLogoIcon />
              </div>
            </div>
            <h1
              className="text-xl font-bold tracking-tight mb-0.5"
              style={{ color: "#FFFFFF", fontFamily: "Inter, sans-serif" }}
            >
              Optic
            </h1>
            <p style={{ color: "#94A3B8", fontSize: "0.85rem" }}>
              AI Lead Intelligence Platform
            </p>
          </div>

          {/* Card Section */}
          <div
            className="rounded-2xl p-5 md:p-6"
            style={{
              background: "rgba(255,255,255,0.02)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.06)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            <h2
              className="text-lg font-semibold mb-0.5"
              style={{ color: "#FFFFFF", fontFamily: "Inter, sans-serif" }}
            >
              Sign in
            </h2>
            <p className="text-sm mb-5" style={{ color: "#94A3B8" }}>
              Your AI-powered lead dashboard
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium mb-1 uppercase tracking-wide"
                  style={{ color: "#94A3B8", letterSpacing: "0.07em" }}
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="founder@rethinklab.co"
                  className="input-optic w-full px-4 py-2.5 text-sm rounded-lg"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-1 text-xs" style={{ color: "#F87171" }}>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-medium mb-1 uppercase tracking-wide"
                  style={{ color: "#94A3B8", letterSpacing: "0.07em" }}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="input-optic w-full px-4 py-2.5 pr-11 text-sm rounded-lg"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-colors"
                    style={{ color: "#94A3B8" }}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs" style={{ color: "#F87171" }}>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                id="login-submit"
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 mt-4"
                style={{
                  background: isLoggingIn ? "rgba(75,110,245,0.5)" : "linear-gradient(180deg, #5C7CFA 0%, #4B6EF5 100%)",
                  color: "#FFFFFF",
                  border: "1px solid rgba(255,255,255,0.12)",
                  boxShadow: "0 0 20px rgba(75,110,245,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
                }}
                onMouseEnter={(e) => !isLoggingIn && (e.currentTarget.style.boxShadow = "0 0 30px rgba(75,110,245,0.5), inset 0 1px 0 rgba(255,255,255,0.2)")}
                onMouseLeave={(e) => !isLoggingIn && (e.currentTarget.style.boxShadow = "0 0 20px rgba(75,110,245,0.3), inset 0 1px 0 rgba(255,255,255,0.2)")}
              >
                {isLoggingIn ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <span className="flex items-center gap-1.5">Sign in <ArrowRight size={15} /></span>
                )}
              </button>
            </form>

            {/* Demo credentials Section */}
            <div
              className="mt-4 p-3 rounded-xl"
              style={{ background: "rgba(75,110,245,0.05)", border: "1px solid rgba(75,110,245,0.1)" }}
            >
              <p className="text-xs font-medium mb-1.5" style={{ color: "#7B97FF" }}>
                Demo credentials
              </p>
              <div className="space-y-0.5">
                <p className="text-xs" style={{ color: "#94A3B8", fontFamily: "JetBrains Mono, monospace" }}>
                  founder@rethinklab.co
                </p>
                <p className="text-xs" style={{ color: "#94A3B8", fontFamily: "JetBrains Mono, monospace" }}>
                  optic2024
                </p>
              </div>
              <button
                id="fill-demo"
                type="button"
                onClick={fillDemo}
                className="mt-1.5 text-xs font-medium transition-colors"
                style={{ color: "#7B97FF" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#4B6EF5")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#7B97FF")}
              >
                Fill automatically →
              </button>
            </div>
          </div>

          <p className={`text-center text-xs ${LAYOUT_CONFIG.footerTopSpacing}`} style={{ color: "#64748B" }}>
            Built for founders who move fast · Optic v1.0
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh grid place-items-center" style={{ background: "#06070B" }}>
          <div className="w-8 h-8 border-2 border-[#4B6EF5] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}