"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, RefreshCw, LogOut, Mail } from "lucide-react";
import { toast } from "sonner";

export default function NoAccessPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  // Redirect if user becomes active or is not logged in
  useEffect(() => {
    if (!user) {
      router.replace("/login");
    } else if (user.is_active === true || user.isActive === true) {
      const route =
        {
          Architect: "/dashboard/architect",
          Client: "/dashboard/client",
          Builder: "/dashboard/builder",
          "Site Supervisor": "/dashboard/supervisor",
          "Team Member": "/dashboard/team",
        }[user.role] || "/dashboard/architect";

      router.replace(route);
    }
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
    toast.success("Logged out successfully");
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  if (!user) return null;

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left Panel - Same as Login/Register */}
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

        <div className="relative z-10">
          <h1 className="text-4xl font-black tracking-tight text-white">
            BUILD<span className="text-[#ef7f1b]">CON</span>
          </h1>
          <p className="text-gray-400 text-base mt-2 font-light">
            Construction ERP Platform
          </p>
        </div>
      </div>

      {/* Right Panel - No Access Message */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-white">
        <div className="w-full max-w-[420px] text-center">
          <div className="mx-auto w-20 h-20 rounded-2xl bg-orange-100 flex items-center justify-center mb-8">
            <Shield className="w-10 h-10 text-[#ef7f1b]" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Account Not Active
          </h1>

          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Your account has been created successfully, but it is currently
            <span className="font-medium text-gray-800"> inactive</span>.
            <br />
            Please wait until an administrator activates your account.
          </p>

          <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 mb-8 text-left">
            <p className="text-sm text-gray-500 mb-3">What happens next?</p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex gap-2">
                <span className="text-[#ef7f1b]">•</span>
                Admin will review your registration
              </li>
              <li className="flex gap-2">
                <span className="text-[#ef7f1b]">•</span>
                You will receive an email once activated
              </li>
              <li className="flex gap-2">
                <span className="text-[#ef7f1b]">•</span>
                Usually takes 1–24 hours
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleRefresh}
              className="w-full h-12 bg-[#ef7f1b] hover:bg-[#d66e15] text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all"
            >
              <RefreshCw className="w-5 h-5" />
              Check Activation Status
            </button>

            <button
              onClick={handleLogout}
              className="w-full h-12 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg flex items-center justify-center gap-2 transition-all"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>

          <p className="mt-8 text-sm text-gray-500 flex items-center justify-center gap-2">
            <Mail className="w-4 h-4" />
            Need help? Contact your administrator
          </p>
        </div>
      </div>
    </div>
  );
}
