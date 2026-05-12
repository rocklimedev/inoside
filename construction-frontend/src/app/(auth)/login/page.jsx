"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, Shield, Lock, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

const roleRoutes = {
  Architect: "/dashboard/architect",
  Client: "/dashboard/client",
  Builder: "/dashboard/builder",
  "Site Supervisor": "/dashboard/supervisor",
  "Team Member": "/dashboard/team",
};

export default function LoginPage() {
  const router = useRouter();
  const { login, user, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user?.role) {
      const userRole = user.role?.name || user.role;
      const route = roleRoutes[userRole] || "/";

      router.replace(route);
    }
  }, [isAuthenticated, user, router]);

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

      toast.success("Login successful!");

      const userRole = res?.user?.role?.name || user?.role?.name || user?.role;

      const route = roleRoutes[userRole] || "";

      setTimeout(() => {
        router.replace(route);
      }, 600);
    } catch (err) {
      const message =
        err?.data?.message || err?.message || "Invalid credentials";

      toast.error(message);

      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  };

  const emailActive = emailFocused || email.length > 0;
  const passwordActive = passwordFocused || password.length > 0;

  return (
    <div
      className="flex h-screen w-full overflow-hidden"
      data-testid="login-page"
    >
      {/* Left Panel */}
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

        <div className="relative z-10">
          <h1 className="text-4xl font-black tracking-tight text-white">
            BUILD
            <span className="text-[#ef7f1b]">CON</span>
          </h1>

          <p className="text-gray-400 text-base mt-2 font-light">
            Construction ERP Platform
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-white">
        <div className="w-full max-w-[420px]">
          {/* Header */}
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
              Construction ERP
            </p>

            <p className="text-sm text-gray-400 mt-4 leading-relaxed">
              Project planning, approvals, execution, and handover — in one
              simple system.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {errors.general && (
              <div className="bg-red-50 text-[#e31d3b] text-sm px-4 py-3 rounded-lg border border-red-100">
                {errors.general}
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);

                  setErrors((prev) => ({
                    ...prev,
                    email: "",
                  }));
                }}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                placeholder=" "
                className={`w-full h-14 pt-5 pb-2 px-4 text-sm border rounded-lg bg-white transition-all outline-none ${
                  emailFocused
                    ? "border-[#ef7f1b] ring-2 ring-[#ef7f1b]/20"
                    : errors.email
                      ? "border-[#e31d3b]"
                      : "border-gray-200 hover:border-gray-300"
                }`}
              />

              <label
                className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                  emailActive
                    ? "top-1.5 text-[10px] font-bold uppercase tracking-wider"
                    : "top-4 text-sm"
                } ${emailFocused ? "text-[#ef7f1b]" : "text-gray-400"}`}
              >
                Email
              </label>

              {errors.email && (
                <p className="text-[#e31d3b] text-xs mt-1.5">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);

                  setErrors((prev) => ({
                    ...prev,
                    password: "",
                  }));
                }}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                placeholder=" "
                className={`w-full h-14 pt-5 pb-2 px-4 pr-12 text-sm border rounded-lg bg-white transition-all outline-none ${
                  passwordFocused
                    ? "border-[#ef7f1b] ring-2 ring-[#ef7f1b]/20"
                    : errors.password
                      ? "border-[#e31d3b]"
                      : "border-gray-200 hover:border-gray-300"
                }`}
              />

              <label
                className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                  passwordActive
                    ? "top-1.5 text-[10px] font-bold uppercase tracking-wider"
                    : "top-4 text-sm"
                } ${passwordFocused ? "text-[#ef7f1b]" : "text-gray-400"}`}
              >
                Password
              </label>

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>

              {errors.password && (
                <p className="text-[#e31d3b] text-xs mt-1.5">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-[#ef7f1b]"
                />

                <label className="text-sm text-gray-500 cursor-pointer select-none">
                  Remember me
                </label>
              </div>

              <button
                type="button"
                className="text-sm text-[#ef7f1b] hover:text-[#d66e15] transition-colors font-medium"
                onClick={() => toast.info("Password reset feature coming soon")}
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#ef7f1b] hover:bg-[#d66e15] active:bg-[#bd6010] text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* OTP Login */}
            <button
              type="button"
              className="w-full h-12 border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 font-medium rounded-lg transition-all flex items-center justify-center gap-2"
              onClick={() => toast.info("OTP login coming soon")}
            >
              <Lock className="w-4 h-4" />
              Login with OTP
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400">
            <Shield className="w-3.5 h-3.5" />
            <span>Secure role-based access for construction teams</span>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
              Demo Access
            </p>

            <p className="text-xs text-gray-500">
              demo@buildcon.com / password123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
