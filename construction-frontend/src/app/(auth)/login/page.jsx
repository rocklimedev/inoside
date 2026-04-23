import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Eye, EyeOff, Shield, FileText, ClipboardCheck, FolderOpen,
  Lock, ArrowRight, Loader2
} from 'lucide-react';
import { toast } from 'sonner';

const workflowStages = [
  'Client Brief', 'Pitch', 'Site Reki', 'Scope of Work',
  'BOQ', 'Design Approval', 'Execution', 'Vendor Selection',
  'Inventory', 'Quality Tracking', 'Handover'
];

const roleRoutes = {
  'Architect': '/dashboard/architect',
  'Client': '/dashboard/client',
  'Builder': '/dashboard/builder',
  'Site Supervisor': '/dashboard/supervisor',
  'Team Member': '/dashboard/team',
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  if (user) {
    const route = roleRoutes[user.role] || '/dashboard/architect';
    navigate(route, { replace: true });
    return null;
  }

  const validate = () => {
    const errs = {};
    if (!email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Minimum 6 characters';
    if (!role) errs.role = 'Please select your role';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const u = await login(email, password, role);
      toast.success('Login successful');
      setTimeout(() => navigate(roleRoutes[u.role] || '/dashboard/architect'), 600);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Login failed';
      toast.error(msg);
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  const emailActive = emailFocused || email.length > 0;
  const passwordActive = passwordFocused || password.length > 0;

  return (
    <div className="flex h-screen w-full overflow-hidden" data-testid="login-page">
      {/* Left Panel - Architectural Illustration */}
      <div className="relative hidden lg:flex flex-col justify-between flex-1 p-12 bg-[#0f172a] overflow-hidden">
        {/* Grid background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Architectural SVG */}
        <svg className="absolute inset-0 w-full h-full opacity-100" viewBox="0 0 600 900" fill="none">
          <rect x="80" y="180" width="200" height="420" stroke="#ef7f1b" strokeWidth="0.5" opacity="0.25" className="arch-line" />
          <rect x="340" y="280" width="180" height="320" stroke="#ef7f1b" strokeWidth="0.5" opacity="0.18" className="arch-line" style={{ animationDelay: '0.3s' }} />
          <line x1="80" y1="260" x2="280" y2="260" stroke="white" strokeWidth="0.3" opacity="0.08" />
          <line x1="80" y1="340" x2="280" y2="340" stroke="white" strokeWidth="0.3" opacity="0.08" />
          <line x1="80" y1="420" x2="280" y2="420" stroke="white" strokeWidth="0.3" opacity="0.08" />
          <line x1="80" y1="500" x2="280" y2="500" stroke="white" strokeWidth="0.3" opacity="0.08" />
          <rect x="95" y="195" width="65" height="45" stroke="white" strokeWidth="0.3" opacity="0.06" />
          <rect x="175" y="195" width="90" height="45" stroke="white" strokeWidth="0.3" opacity="0.06" />
          <rect x="95" y="270" width="40" height="55" stroke="white" strokeWidth="0.3" opacity="0.06" />
          <rect x="150" y="270" width="55" height="55" stroke="white" strokeWidth="0.3" opacity="0.06" />
          <rect x="220" y="270" width="45" height="55" stroke="white" strokeWidth="0.3" opacity="0.06" />
          <rect x="355" y="295" width="70" height="50" stroke="white" strokeWidth="0.3" opacity="0.05" />
          <rect x="440" y="295" width="60" height="50" stroke="white" strokeWidth="0.3" opacity="0.05" />
          <line x1="0" y1="720" x2="600" y2="520" stroke="#ef7f1b" strokeWidth="0.4" opacity="0.12" />
          <line x1="0" y1="760" x2="600" y2="560" stroke="#ef7f1b" strokeWidth="0.25" opacity="0.08" />
          <circle cx="170" cy="700" r="2" fill="#ef7f1b" opacity="0.3" />
          <circle cx="300" cy="650" r="1.5" fill="#ef7f1b" opacity="0.2" />
          <circle cx="430" cy="600" r="2" fill="#ef7f1b" opacity="0.25" />
        </svg>

        {/* Top content */}
        <div className="relative z-10">
          <h1 className="text-4xl font-black tracking-tight text-white">
            BUILD<span className="text-[#ef7f1b]">CON</span>
          </h1>
          <p className="text-gray-400 text-base mt-2 font-light">Construction ERP Platform</p>
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
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}
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
            <p className="text-white/35 text-[11px] leading-tight">Track drawings<br />& approvals</p>
          </div>
          <div className="text-center">
            <ClipboardCheck className="w-4 h-4 text-[#ef7f1b] mx-auto mb-2" />
            <p className="text-white/35 text-[11px] leading-tight">Manage site<br />progress</p>
          </div>
          <div className="text-center">
            <FolderOpen className="w-4 h-4 text-[#ef7f1b] mx-auto mb-2" />
            <p className="text-white/35 text-[11px] leading-tight">Centralize project<br />documents</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-white">
        <div className="w-full max-w-[420px] animate-fadeInUp">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-baseline gap-0.5">
              <h1 className="text-3xl font-black text-black tracking-tight">BUILD</h1>
              <h1 className="text-3xl font-black text-[#ef7f1b] tracking-tight">CON</h1>
            </div>
            <p className="text-sm font-bold text-[#ef7f1b] mt-1 uppercase tracking-wider">Construction ERP</p>
            <p className="text-sm text-gray-400 mt-4 leading-relaxed">
              Project planning, approvals, execution, and handover — in one simple system.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5" data-testid="login-form">
            {errors.general && (
              <div
                className="bg-red-50 text-[#e31d3b] text-sm px-4 py-3 rounded-lg border border-red-100"
                data-testid="login-error"
              >
                {errors.general}
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })); }}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                placeholder=" "
                className={`w-full h-14 pt-5 pb-2 px-4 text-sm border rounded-lg bg-white transition-all outline-none ${emailFocused ? 'border-[#ef7f1b] ring-2 ring-[#ef7f1b]/20' : errors.email ? 'border-[#e31d3b]' : 'border-gray-200 hover:border-gray-300'}`}
                data-testid="login-email-input"
                tabIndex={1}
              />
              <label
                className={`absolute left-4 transition-all duration-200 pointer-events-none ${emailActive ? 'top-1.5 text-[10px] font-bold uppercase tracking-wider' : 'top-4 text-sm'} ${emailFocused ? 'text-[#ef7f1b]' : 'text-gray-400'}`}
              >
                Email or Mobile
              </label>
              {errors.email && (
                <p className="text-[#e31d3b] text-xs mt-1.5" data-testid="login-email-error">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: '' })); }}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                placeholder=" "
                className={`w-full h-14 pt-5 pb-2 px-4 pr-12 text-sm border rounded-lg bg-white transition-all outline-none ${passwordFocused ? 'border-[#ef7f1b] ring-2 ring-[#ef7f1b]/20' : errors.password ? 'border-[#e31d3b]' : 'border-gray-200 hover:border-gray-300'}`}
                data-testid="login-password-input"
                tabIndex={2}
              />
              <label
                className={`absolute left-4 transition-all duration-200 pointer-events-none ${passwordActive ? 'top-1.5 text-[10px] font-bold uppercase tracking-wider' : 'top-4 text-sm'} ${passwordFocused ? 'text-[#ef7f1b]' : 'text-gray-400'}`}
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                data-testid="login-password-toggle"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              {errors.password && (
                <p className="text-[#e31d3b] text-xs mt-1.5" data-testid="login-password-error">{errors.password}</p>
              )}
            </div>

            {/* Role Selector */}
            <div>
              <Select value={role} onValueChange={v => { setRole(v); setErrors(prev => ({ ...prev, role: '' })); }}>
                <SelectTrigger
                  className={`h-14 px-4 text-sm rounded-lg border transition-all bg-white ${errors.role ? 'border-[#e31d3b]' : 'border-gray-200 hover:border-gray-300'} focus:border-[#ef7f1b] focus:ring-2 focus:ring-[#ef7f1b]/20`}
                  data-testid="login-role-select"
                  tabIndex={3}
                >
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Architect">Architect</SelectItem>
                  <SelectItem value="Client">Client</SelectItem>
                  <SelectItem value="Builder">Builder</SelectItem>
                  <SelectItem value="Site Supervisor">Site Supervisor</SelectItem>
                  <SelectItem value="Team Member">Team Member</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-[#e31d3b] text-xs mt-1.5" data-testid="login-role-error">{errors.role}</p>
              )}
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={rememberMe}
                  onCheckedChange={setRememberMe}
                  data-testid="login-remember-checkbox"
                  className="data-[state=checked]:bg-[#ef7f1b] data-[state=checked]:border-[#ef7f1b]"
                  tabIndex={4}
                />
                <label
                  className="text-sm text-gray-500 cursor-pointer select-none"
                  onClick={() => setRememberMe(!rememberMe)}
                >
                  Remember me
                </label>
              </div>
              <button
                type="button"
                className="text-sm text-[#ef7f1b] hover:text-[#d66e15] transition-colors font-medium"
                data-testid="login-forgot-password"
                onClick={() => toast.info('Password reset feature coming soon')}
                tabIndex={5}
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#ef7f1b] hover:bg-[#d66e15] active:bg-[#bd6010] text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              data-testid="login-submit-button"
              tabIndex={6}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Sign in <ArrowRight className="w-4 h-4" /></>
              )}
            </button>

            {/* OTP Button */}
            <button
              type="button"
              className="w-full h-12 border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 font-medium rounded-lg transition-all flex items-center justify-center gap-2"
              data-testid="login-otp-button"
              onClick={() => toast.info('OTP login coming soon')}
              tabIndex={7}
            >
              <Lock className="w-4 h-4" />
              Login with OTP
            </button>
          </form>

          {/* Security text */}
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400">
            <Shield className="w-3.5 h-3.5" />
            <span>Secure role-based access for construction and design teams</span>
          </div>

          {/* Demo credentials hint */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Demo Access</p>
            <p className="text-xs text-gray-500">demo@buildcon.com / password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
