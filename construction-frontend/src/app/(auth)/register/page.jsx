"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRegisterMutation } from "@/api/authApi";
import { useGetRolesQuery } from "@/api/rbacApi";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  EyeOff,
  UserPlus,
  Loader2,
  FolderOpen,
  ClipboardCheck,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

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

const roleRoutes = {
  Architect: "/dashboard/architect",
  Client: "/dashboard/client",
  Builder: "/dashboard/builder",
  "Site Supervisor": "/dashboard/supervisor",
  "Team Member": "/dashboard/team",
};

export default function RegisterPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [register, { isLoading: isRegistering }] = useRegisterMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errs.email = "Enter a valid email";
    if (!formData.password) errs.password = "Password is required";
    else if (formData.password.length < 6)
      errs.password = "Minimum 6 characters";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await register(formData).unwrap();
      toast.success("Account created successfully! Please login.");
      router.push("/login");
    } catch (err) {
      const errorMsg =
        err?.data?.message || err?.data?.detail || "Registration failed";
      toast.error(errorMsg);
      setErrors({ general: errorMsg });
    }
  };

  const nameActive = nameFocused || formData.name.length > 0;
  const emailActive = emailFocused || formData.email.length > 0;
  const passwordActive = passwordFocused || formData.password.length > 0;
  const phoneActive = phoneFocused || formData.phone.length > 0;

  return (
    <div
      className="flex h-screen w-full overflow-hidden"
      data-testid="register-page"
    >
      {/* Left Panel - Same as before */}
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

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-white">
        <div className="w-full max-w-[420px]">
          <div className="mb-10">
            <div className="flex items-baseline gap-0.5">
              <h1 className="text-3xl font-black text-black tracking-tight">
                BUILD
              </h1>
              <h1 className="text-3xl font-black text-[#ef7f1b] tracking-tight">
                CON
              </h1>
            </div>
            <p className="text-sm font-bold text-[#ef7f1b] mt-1 uppercase tracking-wider">
              Create Account
            </p>
            <p className="text-sm text-gray-400 mt-4">
              Join the BuildCon platform
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {errors.general && (
              <div className="bg-red-50 text-[#e31d3b] text-sm px-4 py-3 rounded-lg border border-red-100">
                {errors.general}
              </div>
            )}

            {/* Name */}
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
                className={`w-full h-14 pt-5 pb-2 px-4 text-sm border rounded-lg bg-white transition-all outline-none ${
                  nameFocused
                    ? "border-[#ef7f1b] ring-2 ring-[#ef7f1b]/20"
                    : errors.name
                      ? "border-red-500"
                      : "border-gray-200 hover:border-gray-300"
                }`}
                placeholder=" "
              />
              <label
                className={`absolute left-4 transition-all duration-200 pointer-events-none ${nameActive ? "top-1.5 text-[10px] font-bold uppercase tracking-wider" : "top-4 text-sm"} ${nameFocused ? "text-[#ef7f1b]" : "text-gray-400"}`}
              >
                Full Name
              </label>
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>
            {/* Email */}
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                className={`w-full h-14 pt-5 pb-2 px-4 text-sm border rounded-lg bg-white transition-all outline-none ${
                  emailFocused
                    ? "border-[#ef7f1b] ring-2 ring-[#ef7f1b]/20"
                    : errors.email
                      ? "border-red-500"
                      : "border-gray-200 hover:border-gray-300"
                }`}
                placeholder=" "
              />
              <label
                className={`absolute left-4 transition-all duration-200 pointer-events-none ${emailActive ? "top-1.5 text-[10px] font-bold uppercase tracking-wider" : "top-4 text-sm"} ${emailFocused ? "text-[#ef7f1b]" : "text-gray-400"}`}
              >
                Email
              </label>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone (Optional) */}
            <div className="relative">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onFocus={() => setPhoneFocused(true)}
                onBlur={() => setPhoneFocused(false)}
                className={`w-full h-14 pt-5 pb-2 px-4 text-sm border rounded-lg bg-white transition-all outline-none border-gray-200 hover:border-gray-300`}
                placeholder=" "
              />
              <label
                className={`absolute left-4 transition-all duration-200 pointer-events-none ${phoneActive ? "top-1.5 text-[10px] font-bold uppercase tracking-wider" : "top-4 text-sm"} text-gray-400`}
              >
                Phone (Optional)
              </label>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                className={`w-full h-14 pt-5 pb-2 px-4 pr-12 text-sm border rounded-lg bg-white transition-all outline-none ${
                  passwordFocused
                    ? "border-[#ef7f1b] ring-2 ring-[#ef7f1b]/20"
                    : errors.password
                      ? "border-red-500"
                      : "border-gray-200 hover:border-gray-300"
                }`}
                placeholder=" "
              />
              <label
                className={`absolute left-4 transition-all duration-200 pointer-events-none ${passwordActive ? "top-1.5 text-[10px] font-bold uppercase tracking-wider" : "top-4 text-sm"} ${passwordFocused ? "text-[#ef7f1b]" : "text-gray-400"}`}
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isRegistering}
              className="w-full h-12 bg-[#ef7f1b] hover:bg-[#d66e15] text-white font-bold rounded-lg flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isRegistering ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Create Account <UserPlus className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/login")}
              className="text-[#ef7f1b] hover:underline font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
