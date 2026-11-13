import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RefreshCw,
  Bell,
  Sun,
  Moon,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import type { ActiveTab } from './Sidebar.tsx';

interface HeaderProps {
  activeTab: ActiveTab;
  onRunSearchNow: () => void;
  isRunningSync: boolean;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  unreadNotifsCount: number;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onRunSearchNow,
  isRunningSync,
  isDarkMode,
  setIsDarkMode,
  unreadNotifsCount,
  onOpenNotifications
}) => {
  const [istTime, setIstTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format to IST
      const istString = now.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      setIstTime(istString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getTabTitle = (tab: ActiveTab) => {
    switch (tab) {
      case 'dashboard':
        return { title: 'AI Job Finder Dashboard', subtitle: 'Real-time overview of Indian tech jobs matched to your Angular & .NET profile' };
      case 'jobs':
        return { title: 'Job Discovery & Exploration', subtitle: 'Search live jobs across Pune, Mumbai, Jalgaon, Nashik & Remote with weighted scores' };
      case 'profile':
        return { title: 'Candidate Profile & Experience', subtitle: 'Manage your skills, notice period, target roles and CTC expectations' };
      case 'resume':
        return { title: 'Resume Studio & AI Extraction', subtitle: 'Upload resumes (PDF/DOCX), parse skills, and sync directly with candidate profile' };
      case 'applications':
        return { title: 'Application Pipeline Tracker', subtitle: 'Track your career pipeline from Bookmarked to Applied, Interviewing, and Offers' };
      case 'compare':
        return { title: 'Job Comparison Matrix', subtitle: 'Side-by-side technical and compensation evaluation against your background' };
      case 'coach':
        return { title: 'AI Interview Prep & Career Coach', subtitle: 'Generate custom Angular & .NET interview questions and career growth roadmap' };
      case 'assistant':
        return { title: 'Natural Language Job Assistant', subtitle: 'Ask for specific jobs, salary filters, or missing skills via natural commands' };
      case 'automation':
        return { title: 'Scheduled Synchronization Engine', subtitle: 'Morning (8 AM) & Evening (6 PM) automated discovery with email digest alerts' };
      case 'settings':
        return { title: 'System Settings & Score Weights', subtitle: 'Customize scoring weights (Skills 40%, Exp 20%, etc.) and AI model configurations' };
    }
  };

  const { title, subtitle } = getTabTitle(activeTab);

  return (
    <header className="h-16 px-6 bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between sticky top-0 z-20">
      {/* Title & context */}
      <div className="flex flex-col min-w-0">
        <h1 className="text-base font-bold text-white tracking-tight truncate flex items-center gap-2">
          {title}
        </h1>
        <p className="text-xs text-slate-400 truncate hidden sm:block">
          {subtitle}
        </p>
      </div>

      {/* Action utilities */}
      <div className="flex items-center gap-3">
        {/* Live IST clock */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>{istTime || 'IST Time'}</span>
          <span className="text-[10px] text-slate-500 font-sans">IST</span>
        </div>

        {/* AI Engine badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-950/40 border border-purple-800/50 text-purple-300 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin-slow" />
          <span className="font-medium">Gemini 3.8 Flash</span>
        </div>

        {/* Run Search Now Button */}
        <button
          onClick={onRunSearchNow}
          disabled={isRunningSync}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-95 transition-all shadow-md shadow-purple-900/20 disabled:opacity-50 cursor-pointer"
          title="Run 9-step automated job discovery sync right now"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRunningSync ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{isRunningSync ? 'Syncing...' : 'Run Search Now'}</span>
        </button>

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          title="Notification Digest and Activity Logs"
        >
          <Bell className="w-4 h-4" />
          {unreadNotifsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-500 ring-2 ring-[#0b0f19]"></span>
          )}
        </button>

        {/* Dark/Light toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-300" />}
        </button>

        {/* User Mini Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center font-bold text-xs text-white shadow-sm ring-1 ring-purple-400/40">
            HK
          </div>
        </div>
      </div>
    </header>
  );
};
