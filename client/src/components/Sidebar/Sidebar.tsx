import React from "react";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Calendar,
  BrainCircuit,
  UserCircle,
  X,
  Shield,
  Crown,
} from "lucide-react";
import { ViewMode } from "../../types";

interface SidebarProps {
  currentView: ViewMode;
  setView: (view: ViewMode) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isAdmin?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setView,
  isOpen,
  setIsOpen,
  isAdmin = false,
}) => {
  const menuItems: {
    id: ViewMode;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: ViewMode.Dashboard, label: "Dashboard", icon: LayoutDashboard },
    { id: ViewMode.Notes, label: "My Notes", icon: BookOpen },
    { id: ViewMode.Papers, label: "Question Papers", icon: FileText },
    { id: ViewMode.Planner, label: "Study Planner", icon: Calendar },
    { id: ViewMode.Assessment, label: "Self Assessment", icon: BrainCircuit },
    { id: ViewMode.Pricing, label: "Pricing & Plans", icon: Crown },
    { id: ViewMode.Profile, label: "Profile", icon: UserCircle },
  ];

  if (isAdmin) {
    menuItems.push({
      id: ViewMode.AdminDashboard,
      label: "Admin Panel",
      icon: Shield,
    });
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-linear-to-b from-indigo-600 to-purple-700 text-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 pt-safe flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <img
                src="/studysync.png"
                alt="StudySync Logo"
                className="w-9 h-9 rounded-xl object-cover shadow-md"
              />
              StudySync
            </h1>
            {/* Close button for mobile */}
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-indigo-100 text-sm mt-1">Smart Study Companion</p>
        </div>

        <nav className="mt-4 px-4 space-y-1 flex-1 overflow-y-auto custom-scrollbar overscroll-contain">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setView(item.id);
                if (window.innerWidth < 1024) setIsOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                ${
                  currentView === item.id
                    ? "bg-white/20 text-white font-semibold backdrop-blur-sm"
                    : "text-indigo-100 hover:bg-white/10"
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 pb-safe shrink-0">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-white border border-white/20">
            <p className="text-xs font-medium opacity-80 mb-1">PRO PLAN</p>
            <p className="text-sm font-bold mb-3">Unlimited AI Notes</p>
            <button
              onClick={() => {
                setView(ViewMode.Pricing);
                if (window.innerWidth < 1024) setIsOpen(false);
              }}
              className="w-full bg-white text-indigo-600 text-xs font-bold py-2 rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center gap-1"
            >
              <Crown className="w-3 h-3" />
              Upgrade Now
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
