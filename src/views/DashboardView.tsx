import React from 'react';
import {
  Briefcase,
  Sparkles,
  TrendingUp,
  Bookmark,
  Send,
  Target,
  RefreshCw,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import type { DashboardMetrics, Job } from '../types/index.ts';
import { JobCard } from '../components/JobCard.tsx';

interface DashboardViewProps {
  metrics: DashboardMetrics | null;
  loading: boolean;
  onRunSearchNow: () => void;
  isRunningSync: boolean;
  onNavigateToJobs: () => void;
  onNavigateToProfile: () => void;
  onNavigateToApplications: () => void;
  onViewJobMatch: (job: Job) => void;
  onToggleSaveJob: (jobId: string) => void;
  onPrepareInterview: (job: Job) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  loading,
  onRunSearchNow,
  isRunningSync,
  onNavigateToJobs,
  onNavigateToProfile,
  onNavigateToApplications,
  onViewJobMatch,
  onToggleSaveJob,
  onPrepareInterview
}) => {
  if (loading || !metrics) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 rounded-2xl bg-slate-900 border border-slate-800" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-slate-900 border border-slate-800" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 rounded-2xl bg-slate-900 border border-slate-800" />
          <div className="h-96 rounded-2xl bg-slate-900 border border-slate-800" />
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Jobs Discovered',
      value: metrics.totalJobsDiscovered,
      change: '+4 new today',
      icon: Briefcase,
      color: 'from-blue-600/20 to-indigo-600/10 text-blue-400 border-blue-500/30'
    },
    {
      label: 'New Jobs Today',
      value: metrics.newJobsToday,
      change: 'Synced 8 AM IST',
      icon: TrendingUp,
      color: 'from-emerald-600/20 to-teal-600/10 text-emerald-400 border-emerald-500/30'
    },
    {
      label: 'Excellent Matches',
      value: metrics.excellentMatches,
      change: '80%+ compatibility',
      icon: Sparkles,
      color: 'from-purple-600/20 to-indigo-600/10 text-purple-400 border-purple-500/30'
    },
    {
      label: 'Saved Bookmarks',
      value: metrics.savedJobs,
      change: 'Priority review',
      icon: Bookmark,
      color: 'from-amber-600/20 to-orange-600/10 text-amber-400 border-amber-500/30'
    },
    {
      label: 'Applications Out',
      value: metrics.applicationsSubmitted,
      change: '1 in interview stage',
      icon: Send,
      color: 'from-cyan-600/20 to-blue-600/10 text-cyan-400 border-cyan-500/30'
    },
    {
      label: 'Average Match %',
      value: `${metrics.averageMatchPercentage}%`,
      change: 'Top tier alignment',
      icon: Target,
      color: 'from-pink-600/20 to-rose-600/10 text-pink-400 border-pink-500/30'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Quick Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#171b34] via-[#131a30] to-[#0f172a] border border-purple-500/30 p-6 shadow-xl overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-purple-600/10 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Personal AI Assistant Active
              </span>
              <span className="text-xs text-slate-400">
                Scheduled morning (8 AM) & evening (6 PM IST)
              </span>
            </div>

            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Welcome back, Huzefa. 2 New High-Match Roles Found!
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed">
              Matching your <strong>2 years of Angular, TypeScript, C#, .NET Web API & SQL Server</strong> experience across Pune, Mumbai, Jalgaon, Nashik & Remote roles with expected CTC ₹5 LPA.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRunSearchNow}
              disabled={isRunningSync}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-95 transition-all shadow-lg shadow-purple-900/30 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isRunningSync ? 'animate-spin' : ''}`} />
              <span>{isRunningSync ? 'Executing 9-Step Sync...' : 'Run Search Now'}</span>
            </button>

            <button
              onClick={onNavigateToJobs}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Explore All Jobs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 6 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border bg-gradient-to-b ${card.color} shadow-sm flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400">{card.label}</span>
                <Icon className="w-4 h-4 opacity-80" />
              </div>
              <div className="mt-2">
                <span className="font-mono text-2xl font-black text-white">{card.value}</span>
                <p className="text-[10px] text-slate-400 mt-0.5 truncate">{card.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Layout: Top Recommendations (2 cols) & Analytics/Activity (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top AI Recommendations */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Top AI Recommendations
              </h3>
              <span className="text-xs text-slate-400">
                (Compatibility &gt;= 80%)
              </span>
            </div>

            <button
              onClick={onNavigateToJobs}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
            >
              <span>View All Discovered</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.topRecommendations?.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onViewMatch={onViewJobMatch}
                onToggleSave={onToggleSaveJob}
                onPrepareInterview={onPrepareInterview}
              />
            ))}
          </div>
        </div>

        {/* Analytics & Search History Sidebar */}
        <div className="space-y-6">
          {/* Skill Gaps Analysis */}
          <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-400" />
                In-Demand Skill Gaps
              </h4>
              <span className="text-[10px] text-slate-500 font-mono">Market Demand</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Add these high-demand skills to your Angular & .NET portfolio to maximize salary packages up to ₹8 LPA:
            </p>

            <div className="space-y-2.5">
              {[
                { name: 'Microsoft Azure / Cloud', demand: 85, color: 'bg-indigo-500' },
                { name: 'Docker & Microservices', demand: 75, color: 'bg-blue-500' },
                { name: 'Angular Signals & Standalone', demand: 68, color: 'bg-purple-500' },
                { name: 'Entity Framework Core Opt.', demand: 60, color: 'bg-emerald-500' }
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{item.name}</span>
                    <span className="text-slate-400 font-mono text-[11px]">{item.demand}% of jobs</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${item.demand}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Locations Distribution */}
          <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              Target Location Distribution
            </h4>

            <div className="space-y-2 text-xs">
              {[
                { loc: 'Pune (Hinjawadi / Magarpatta)', count: 18, share: '45%' },
                { loc: 'Remote (India)', count: 14, share: '35%' },
                { loc: 'Mumbai (Airoli / Powai)', count: 6, share: '15%' },
                { loc: 'Nashik / Jalgaon Region', count: 2, share: '5%' }
              ].map((l, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <span className="text-slate-300 font-medium">{l.loc}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-purple-300 font-bold">{l.count} jobs</span>
                    <span className="text-[10px] text-slate-500">({l.share})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Automation Activity */}
          <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                Recent Search Activity
              </h4>
              <span className="text-[10px] text-slate-500">Auto + Manual</span>
            </div>

            <div className="space-y-2">
              {metrics.recentActivity?.slice(0, 3).map((act) => (
                <div key={act.id} className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200 truncate">{act.query}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(act.executedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{act.location}</span>
                    <span className="text-emerald-400 font-medium">{act.resultsCount} positions</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
