"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Lock,
  FolderOpen,
  ClipboardCheck,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

const roleRoutes = {
  architect: "/dashboard/architect",
  client: "/dashboard/client",
  builder: "/dashboard/builder",
  site_supervisor: "/dashboard/site-supervisor",
  team_member: "/dashboard/team",
  admin: "/dashboard/admin",
  super_admin: "/dashboard/admin",
  developer: "/dashboard/developer", // if needed
};
const workflowStages = [
  "Client Brief",
  "Pitch",
  "Site Reki",
  "Scope of Work",
  "BOQ",
  "Design Approval",
  "Execution",
  "Vendor Selection",
  "Inventory",
  "Quality Tracking",
  "Handover",
];

export default function LoginPage() {
  const router = useRouter();
  const { login, refreshUser, userMeta, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const validate = () => {
    const errs = {};
    if (!email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Enter a valid email";

    if (!password) errs.password = "Password is required";
    else if (password.length < 6) errs.password = "Minimum 6 characters";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const res = await login({ email, password });

      let userData = res?.user || userMeta;

      // Safety refresh if needed
      if (!userData?.role || !userData?.is_active) {
        await refreshUser();
        await new Promise((resolve) => setTimeout(resolve, 250));
        userData = userMeta;
      }

      if (!userData) {
        toast.error("Login failed. Please try again.");
        return;
      }

      // ================= POST LOGIN VALIDATIONS =================
      if (!userData.is_email_verified && !userData.isEmailVerified) {
        toast.error("Please verify your email address first.");
        router.replace("/no-access");
        return;
      }

      if (!userData.is_active && !userData.isActive) {
        toast.info("Account is not active yet");
        router.replace("/no-access");
        return;
      }

      if (!userData.role) {
        toast.error("No role assigned to your account. Contact administrator.");
        return;
      }

      // ================= SUCCESS =================
      toast.success("Login successful!");

      const roleKey = userData.role.toLowerCase();
      const route = roleRoutes[roleKey] || "/dashboard";

      router.replace(route);
    } catch (err) {
      const message =
        err?.data?.message || err?.message || "Invalid credentials";
      toast.error(message);
      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#ef7f1b]" />
          <p className="text-sm text-gray-500">Checking authentication...</p>
        </div>
      </div>
    );
  }

  const emailActive = emailFocused || email.length > 0;
  const passwordActive = passwordFocused || password.length > 0;

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* LEFT PANEL */}
      <div className="relative hidden lg:flex flex-col justify-between flex-1 p-12 bg-[#0f172a] overflow-hidden">
        {/* Grid Background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
        {/* Architectural SVG */}
        <svg
          className="absolute inset-0 w-full h-full opacity-100"
          viewBox="0 0 600 900"
          fill="none"
        >
          <rect
            x="80"
            y="180"
            width="200"
            height="420"
            stroke="#ef7f1b"
            strokeWidth="0.5"
            opacity="0.25"
            className="arch-line"
          />
          <rect
            x="340"
            y="280"
            width="180"
            height="320"
            stroke="#ef7f1b"
            strokeWidth="0.5"
            opacity="0.18"
            className="arch-line"
            style={{ animationDelay: "0.3s" }}
          />
          <line
            x1="80"
            y1="260"
            x2="280"
            y2="260"
            stroke="white"
            strokeWidth="0.3"
            opacity="0.08"
          />
          <line
            x1="80"
            y1="340"
            x2="280"
            y2="340"
            stroke="white"
            strokeWidth="0.3"
            opacity="0.08"
          />
          <line
            x1="80"
            y1="420"
            x2="280"
            y2="420"
            stroke="white"
            strokeWidth="0.3"
            opacity="0.08"
          />
          <line
            x1="80"
            y1="500"
            x2="280"
            y2="500"
            stroke="white"
            strokeWidth="0.3"
            opacity="0.08"
          />
          <rect
            x="95"
            y="195"
            width="65"
            height="45"
            stroke="white"
            strokeWidth="0.3"
            opacity="0.06"
          />
          <rect
            x="175"
            y="195"
            width="90"
            height="45"
            stroke="white"
            strokeWidth="0.3"
            opacity="0.06"
          />
          <rect
            x="95"
            y="270"
            width="40"
            height="55"
            stroke="white"
            strokeWidth="0.3"
            opacity="0.06"
          />
          <rect
            x="150"
            y="270"
            width="55"
            height="55"
            stroke="white"
            strokeWidth="0.3"
            opacity="0.06"
          />
          <rect
            x="220"
            y="270"
            width="45"
            height="55"
            stroke="white"
            strokeWidth="0.3"
            opacity="0.06"
          />
          <rect
            x="355"
            y="295"
            width="70"
            height="50"
            stroke="white"
            strokeWidth="0.3"
            opacity="0.05"
          />
          <rect
            x="440"
            y="295"
            width="60"
            height="50"
            stroke="white"
            strokeWidth="0.3"
            opacity="0.05"
          />
          <line
            x1="0"
            y1="720"
            x2="600"
            y2="520"
            stroke="#ef7f1b"
            strokeWidth="0.4"
            opacity="0.12"
          />
          <line
            x1="0"
            y1="760"
            x2="600"
            y2="560"
            stroke="#ef7f1b"
            strokeWidth="0.25"
            opacity="0.08"
          />
          <circle cx="170" cy="700" r="2" fill="#ef7f1b" opacity="0.3" />
          <circle cx="300" cy="650" r="1.5" fill="#ef7f1b" opacity="0.2" />
          <circle cx="430" cy="600" r="2" fill="#ef7f1b" opacity="0.25" />
        </svg>
        {/* Top Branding */}
        <div className="relative z-10">
          <h1 className="text-4xl font-black tracking-tight text-white">
            BUILD<span className="text-[#ef7f1b]">CON</span>
          </h1>
          <p className="text-gray-400 text-base mt-2 font-light">
            Construction ERP Platform
          </p>
        </div>

        {/* Workflow stages */}
        <div className="relative z-10 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-4">
            Project Workflow
          </p>
          {workflowStages.map((stage, i) => (
            <div
              key={i}
              className="flex items-center gap-3 animate-fadeIn"
              style={{
                animationDelay: `${i * 100}ms`,
                animationFillMode: "both",
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#ef7f1b] shrink-0" />
              <span className="text-white/40 text-sm font-light">{stage}</span>
            </div>
          ))}
        </div>

        {/* Feature highlights */}
        <div className="relative z-10 flex gap-10">
          <div className="text-center">
            <FileText className="w-4 h-4 text-[#ef7f1b] mx-auto mb-2" />
            <p className="text-white/35 text-[11px] leading-tight">
              Track drawings
              <br />& approvals
            </p>
          </div>
          <div className="text-center">
            <ClipboardCheck className="w-4 h-4 text-[#ef7f1b] mx-auto mb-2" />
            <p className="text-white/35 text-[11px] leading-tight">
              Manage site
              <br />
              progress
            </p>
          </div>
          <div className="text-center">
            <FolderOpen className="w-4 h-4 text-[#ef7f1b] mx-auto mb-2" />
            <p className="text-white/35 text-[11px] leading-tight">
              Centralize project
              <br />
              documents
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-[420px]">
          <div className="mb-10">
            <h1 className="text-3xl font-black">
              BUILD<span className="text-[#ef7f1b]">CON</span>
            </h1>
            <p className="text-sm text-gray-400 mt-3">
              Project planning, approvals, execution & handover
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {errors.general && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-100">
                {errors.general}
              </div>
            )}

            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((p) => ({ ...p, email: "" }));
                }}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                className="w-full h-14 px-4 pt-5 pb-2 border rounded-lg outline-none"
              />
              <label
                className={`absolute left-4 transition-all ${emailActive ? "top-1 text-xs" : "top-4 text-sm"}`}
              >
                Email
              </label>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((p) => ({ ...p, password: "" }));
                }}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                className="w-full h-14 px-4 pr-10 pt-5 pb-2 border rounded-lg outline-none"
              />
              <label
                className={`absolute left-4 transition-all ${passwordActive ? "top-1 text-xs" : "top-4 text-sm"}`}
              >
                Password
              </label>

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-4 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>

              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#ef7f1b] hover:bg-[#d66e15] text-white rounded-lg flex items-center justify-center gap-2 font-medium transition-all disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <>
                  Sign in <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => router.push("/register")}
              className="w-full h-12 border border-gray-300 hover:bg-gray-50 rounded-lg flex items-center justify-center gap-2 font-medium transition-all"
            >
              <Lock className="w-4 h-4" />
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
