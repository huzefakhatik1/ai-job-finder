import React from 'react';
import {
  LayoutDashboard,
  Search,
  UserCircle,
  FileText,
  Briefcase,
  GitCompare,
  GraduationCap,
  BotMessageSquare,
  RefreshCw,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'jobs'
  | 'profile'
  | 'resume'
  | 'applications'
  | 'compare'
  | 'coach'
  | 'assistant'
  | 'automation'
  | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  savedCount: number;
  applicationsCount: number;
  matchesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  savedCount,
  applicationsCount,
  matchesCount
}) => {
  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'jobs' as ActiveTab, label: 'Job Discovery', icon: Search, badge: matchesCount > 0 ? `${matchesCount} fits` : undefined },
    { id: 'profile' as ActiveTab, label: 'Candidate Profile', icon: UserCircle },
    { id: 'resume' as ActiveTab, label: 'Resume Studio', icon: FileText },
    { id: 'applications' as ActiveTab, label: 'Applications Tracker', icon: Briefcase, badge: applicationsCount > 0 ? String(applicationsCount) : undefined },
    { id: 'compare' as ActiveTab, label: 'Job Comparison', icon: GitCompare },
    { id: 'coach' as ActiveTab, label: 'AI Interview & Coach', icon: GraduationCap, isAi: true },
    { id: 'assistant' as ActiveTab, label: 'AI Search Assistant', icon: BotMessageSquare, isAi: true },
    { id: 'automation' as ActiveTab, label: 'Scheduled Automation', icon: RefreshCw },
    { id: 'settings' as ActiveTab, label: 'Settings & Weights', icon: Sliders },
  ];

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-30 flex flex-col bg-[#0b0f19] border-r border-slate-800 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80 bg-[#0e1424]">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-900/30 shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-base tracking-tight text-white truncate flex items-center gap-1.5">
                AI Job Finder
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded">
                  IN
                </span>
              </span>
              <span className="text-[11px] text-slate-400 truncate">
                .NET & Angular Agent
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Candidate Quick Glance */}
      {!collapsed && (
        <div className="m-3 p-3 rounded-xl bg-gradient-to-br from-slate-900 to-[#141b2d] border border-slate-800/80 shadow-inner">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-900/60 border border-indigo-700/50 flex items-center justify-center font-bold text-sm text-indigo-300">
              HK
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-200 truncate">Huzefa Khatik</p>
              <p className="text-[10px] text-slate-400 truncate">2 Yrs • ₹2L ➔ ₹5L Expected</p>
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] pt-2 border-t border-slate-800/60 text-slate-400">
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Pune / Remote
            </span>
            <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-800/40">
              Active Search
            </span>
          </div>
        </div>
      )}

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all duration-150 group relative ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600/25 to-blue-600/20 text-white border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                  isActive
                    ? 'text-purple-400'
                    : item.isAi
                    ? 'text-indigo-400/80'
                    : 'text-slate-400'
                }`}
              />

              {!collapsed && (
                <span className="truncate flex-1 text-left flex items-center justify-between">
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-purple-500/20 text-purple-300 rounded-md border border-purple-500/30">
                      {item.badge}
                    </span>
                  )}
                  {item.isAi && !item.badge && (
                    <span className="text-[9px] uppercase tracking-wider font-bold text-indigo-400 bg-indigo-500/10 px-1 py-0.5 rounded border border-indigo-500/20">
                      AI
                    </span>
                  )}
                </span>
              )}

              {/* Active Indicator bar */}
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-gradient-to-b from-purple-500 to-blue-500 rounded-r" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / System Status */}
      <div className="p-3 border-t border-slate-800/80 bg-[#0e1424]">
        {!collapsed ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                Gemini 3.8 Flash
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                Connected
              </span>
            </div>
            <div className="text-[10px] text-slate-500 flex justify-between items-center">
              <span>Next Sync: 08:00 AM IST</span>
              <span className="font-mono text-slate-400">v1.2.0</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center" title="Gemini 3.8 Flash Connected">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-500/20"></div>
          </div>
        )}
      </div>
    </aside>
  );
};
