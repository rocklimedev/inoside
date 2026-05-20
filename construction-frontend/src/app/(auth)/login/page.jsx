"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, ArrowRight, Loader2, Lock } from "lucide-react";
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

        <div className="relative z-10">
          <h1 className="text-4xl font-black text-white">
            BUILD<span className="text-[#ef7f1b]">CON</span>
          </h1>
          <p className="text-gray-400 mt-2">Construction ERP Platform</p>
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
