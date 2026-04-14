import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Upload,
  FileText,
  History,
  Settings,
  BarChart3,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Badge } from "../components/ui/badge";
import { currentUser, userRoles } from "../../data/mockData";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Upload", href: "/upload", icon: Upload },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Analytics", href: "/analytics", icon: BarChart3, disabled: true },
  { name: "Admin", href: "/admin", icon: Settings, adminOnly: true, disabled: true },
];

export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#111111] rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-sm">A</span>
              </div>
              <div>
                <h1 className="font-semibold text-slate-900">Arcwood AI Workbench</h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search, notification, and profile hidden for Phase 1 */}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transition-transform duration-200 ease-in-out pt-16 lg:pt-0`}
        >
          <nav className="p-4 space-y-1">
            {navigation.map((item) => {
              if (item.adminOnly && currentUser.role !== "admin") {
                return null;
              }

              const isActive = location.pathname === item.href;
              const Icon = item.icon;

              // If disabled, render as a disabled button instead of a link
              if (item.disabled) {
                return (
                  <div
                    key={item.name}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 cursor-not-allowed opacity-60"
                  >
                    <Icon size={20} />
                    {item.name}
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Icon size={20} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}