import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  LayoutDashboard, FolderKanban, Users, Calendar, FileText, Presentation,
  MapPin, ClipboardList, Clock, Calculator, Palette, Hammer, Store, Package,
  CheckCircle, Handshake, PenTool, ThumbsUp, BarChart3, History, ListTodo,
  Building2, StickyNote, Search, Bell, Plus, ChevronLeft, ChevronRight,
  LogOut, Settings, Upload, FileUp, Files, Menu, X, MessageCircle
} from 'lucide-react';
import { toast } from 'sonner';

const navSections = [
  {
    title: 'MAIN',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: FolderKanban, label: 'Projects', path: '/projects' },
      { icon: Users, label: 'Clients', path: '/clients' },
      { icon: Calendar, label: 'Calendar', path: '/calendar' },
      { icon: MessageCircle, label: 'Chat', path: '/chat' },
    ]
  },
  {
    title: 'WORKFLOW',
    items: [
      { icon: FileText, label: 'Brief', path: '/brief' },
      { icon: Presentation, label: 'Pitch', path: '/pitch' },
      { icon: MapPin, label: 'Site Reki', path: '/site-reki' },
      { icon: ClipboardList, label: 'Scope of Work', path: '/scope' },
      { icon: Clock, label: 'Time & Cost', path: '/time-cost' },
      { icon: Calculator, label: 'BOQ', path: '/boq' },
      { icon: Palette, label: 'Design', path: '/design' },
      { icon: Hammer, label: 'Execution', path: '/execution' },
      { icon: Store, label: 'Vendors', path: '/vendors' },
      { icon: Package, label: 'Inventory', path: '/inventory' },
      { icon: CheckCircle, label: 'Quality & Progress', path: '/quality' },
      { icon: Handshake, label: 'Handover', path: '/handover' },
    ]
  },
  {
    title: 'DOCUMENTS',
    items: [
      { icon: Files, label: 'PDFs', path: '/pdfs' },
      { icon: PenTool, label: 'Drawings', path: '/drawings' },
      { icon: ThumbsUp, label: 'Approvals', path: '/approvals-list' },
      { icon: BarChart3, label: 'Reports', path: '/reports' },
      { icon: History, label: 'Revision Logs', path: '/revision-logs' },
    ]
  },
  {
    title: 'TEAM',
    items: [
      { icon: ListTodo, label: 'Team Tasks', path: '/team-tasks' },
      { icon: Building2, label: 'Site Coordination', path: '/site-coord' },
      { icon: StickyNote, label: 'Internal Notes', path: '/notes' },
    ]
  }
];

const quickActions = [
  { icon: Upload, label: 'Upload Design' },
  { icon: FileUp, label: 'Upload Execution Drawing' },
  { icon: Presentation, label: 'Create Pitch Document' },
  { icon: Calculator, label: 'Add BOQ Version' },
  { icon: ThumbsUp, label: 'Review Client Remarks' },
];

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = ({ isMobile = false }) => (
    <>
      {/* Logo */}
      <div className={`flex items-center h-16 border-b border-gray-100 shrink-0 ${collapsed && !isMobile ? 'justify-center px-2' : 'px-6'}`}>
        {collapsed && !isMobile ? (
          <span className="text-xl font-black text-[#ef7f1b]">B</span>
        ) : (
          <div className="flex items-baseline">
            <span className="text-xl font-black text-black">BUILD</span>
            <span className="text-xl font-black text-[#ef7f1b]">CON</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1 py-3">
        {navSections.map((section, si) => (
          <div key={si} className="mb-2">
            {(!collapsed || isMobile) && (
              <p className="px-6 mb-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mt-3">
                {section.title}
              </p>
            )}
            {collapsed && !isMobile && si > 0 && (
              <div className="mx-3 my-2 h-px bg-gray-100" />
            )}
            {section.items.map((item, ii) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname.includes('/dashboard'));
              const btn = (
                <button
                  key={`${si}-${ii}`}
                  onClick={() => {
                    if (item.path === '/dashboard') {
                      const roleRoute = {
                        'Architect': '/dashboard/architect',
                        'Client': '/dashboard/client',
                        'Builder': '/dashboard/builder',
                        'Site Supervisor': '/dashboard/supervisor',
                        'Team Member': '/dashboard/team',
                      };
                      navigate(roleRoute[user?.role] || '/dashboard/architect');
                    } else if (['/projects', '/clients', '/calendar', '/chat', '/brief', '/pitch', '/site-reki', '/scope', '/time-cost', '/boq', '/design', '/execution', '/handover', '/vendors', '/inventory', '/quality', '/pdfs', '/drawings', '/approvals-list', '/reports', '/revision-logs', '/team-tasks', '/site-coord', '/notes'].includes(item.path)) {
                      navigate(item.path);
                    } else {
                      toast.info(`${item.label} module coming soon`);
                    }
                    if (isMobile) setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full ${collapsed && !isMobile ? 'justify-center px-2 py-2.5' : 'px-6 py-2'} text-sm transition-colors ${isActive
                    ? 'bg-orange-50 text-[#ef7f1b] font-medium'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                  data-testid={`sidebar-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <Icon className="w-[18px] h-[18px] shrink-0" />
                  {(!collapsed || isMobile) && <span className="truncate">{item.label}</span>}
                </button>
              );

              if (collapsed && !isMobile) {
                return (
                  <Tooltip key={`${si}-${ii}`}>
                    <TooltipTrigger asChild>{btn}</TooltipTrigger>
                    <TooltipContent side="right" className="bg-gray-900 text-white text-xs px-2 py-1">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                );
              }
              return <div key={`${si}-${ii}`}>{btn}</div>;
            })}
          </div>
        ))}
      </ScrollArea>

      {/* Collapse toggle (desktop only) */}
      {!isMobile && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center h-12 border-t border-gray-100 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors shrink-0"
          data-testid="sidebar-collapse-toggle"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      )}
    </>
  );

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-screen bg-[#f8f9fa]" data-testid="dashboard-layout">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden md:flex flex-col border-r border-gray-200 bg-white transition-all duration-200 ${collapsed ? 'w-[60px]' : 'w-[250px]'}`}
          data-testid="sidebar-nav"
        >
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/30" onClick={() => setMobileMenuOpen(false)} />
            <aside className="absolute left-0 top-0 bottom-0 w-[280px] bg-white flex flex-col shadow-xl animate-slideInRight">
              <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
                <div className="flex items-baseline">
                  <span className="text-xl font-black text-black">BUILD</span>
                  <span className="text-xl font-black text-[#ef7f1b]">CON</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <SidebarContent isMobile />
            </aside>
          </div>
        )}

        {/* Main area */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Top Header */}
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shrink-0" data-testid="top-header">
            <div className="flex items-center gap-3">
              {/* Mobile menu toggle */}
              <button
                className="md:hidden text-gray-500 hover:text-gray-800"
                onClick={() => setMobileMenuOpen(true)}
                data-testid="mobile-menu-toggle"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-base font-bold text-black leading-tight">
                  {user?.role} Dashboard
                </h1>
                <p className="text-[11px] text-gray-400">Welcome back, {user?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="hidden lg:flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 w-56 border border-transparent focus-within:border-[#ef7f1b]/30 focus-within:bg-white transition-all">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search projects, docs..."
                  className="bg-transparent text-sm outline-none w-full placeholder:text-gray-400"
                  data-testid="search-bar"
                />
              </div>

              {/* Quick add */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="w-8 h-8 rounded-lg bg-[#ef7f1b] text-white flex items-center justify-center hover:bg-[#d66e15] transition-colors"
                    data-testid="quick-add-button"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {quickActions.map((action, i) => (
                    <DropdownMenuItem
                      key={i}
                      onClick={() => toast.info(`${action.label} - Coming soon`)}
                      data-testid={`quick-add-${action.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <action.icon className="w-4 h-4 mr-2 text-[#ef7f1b]" />
                      {action.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Notifications */}
              <button
                className="relative w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                data-testid="notifications-bell"
              >
                <Bell className="w-[18px] h-[18px]" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#e31d3b] rounded-full" />
              </button>

              {/* Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="w-8 h-8 rounded-full bg-[#ef7f1b] text-white flex items-center justify-center text-xs font-bold hover:bg-[#d66e15] transition-colors"
                    data-testid="profile-menu"
                  >
                    {user?.name?.charAt(0) || 'U'}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold">{user?.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
                    <p className="text-[10px] text-[#ef7f1b] font-bold uppercase tracking-wider mt-1">{user?.role}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem data-testid="profile-settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-[#e31d3b] focus:text-[#e31d3b]"
                    data-testid="logout-button"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
