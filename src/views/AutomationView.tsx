import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  Clock,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  Play,
  Check,
  Eye,
  Server,
  Database,
  ArrowRight
} from 'lucide-react';
import type { NotificationLog, SearchHistoryItem, SearchConfiguration, JobSource } from '../types/index.ts';
import { api } from '../services/api.ts';

interface AutomationViewProps {
  onOpenEmailPreview: (log: NotificationLog) => void;
}

export const AutomationView: React.FC<AutomationViewProps> = ({ onOpenEmailPreview }) => {
  const [sources, setSources] = useState<JobSource[]>([]);
  const [logs, setLogs] = useState<{
    notificationLogs: NotificationLog[];
    searchHistory: SearchHistoryItem[];
    searchConfig: SearchConfiguration;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [running, setRunning] = useState<boolean>(false);
  const [currentExecutionReport, setCurrentExecutionReport] = useState<any | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);

  useEffect(() => {
    loadAutomationData();
  }, []);

  const loadAutomationData = async () => {
    setLoading(true);
    try {
      const [sourcesData, logsData] = await Promise.all([
        api.getJobSources(),
        api.getAutomationLogs()
      ]);
      setSources(sourcesData);
      setLogs(logsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunSearchNow = async () => {
    setRunning(true);
    setActiveStep(1);
    setCurrentExecutionReport(null);

    // Simulate progressive visual step transitions for the 9-step workflow
    const timer = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < 9) return prev + 1;
        clearInterval(timer);
        return 9;
      });
    }, 400);

    try {
      const res = await api.runAutomationSync();
      clearInterval(timer);
      setActiveStep(9);
      setCurrentExecutionReport(res.report);
      loadAutomationData();
    } catch (err) {
      console.error(err);
      clearInterval(timer);
    } finally {
      setRunning(false);
    }
  };

  const workflowSteps = [
    { number: 1, title: 'Fetch Candidate Preferences', desc: 'Read target roles, locations & CTC expectations' },
    { number: 2, title: 'Search Connected Providers', desc: 'Query Gemini AI Live Market, Arbeitnow & Jobicy live feeds' },
    { number: 3, title: 'Normalize Results', desc: 'Standardize salary in LPA, titles, and remote statuses' },
    { number: 4, title: 'Remove Duplicates', desc: 'Filter out existing openings across multiple boards' },
    { number: 5, title: 'Store New Jobs', desc: 'Persist normalized vacancies into indexed database' },
    { number: 6, title: 'Calculate Compatibility', desc: 'Execute 6-dimension weighted compatibility algorithm' },
    { number: 7, title: 'Analyze with Gemini AI', desc: 'Perform semantic fit reasoning and interview advice' },
    { number: 8, title: 'Save Recommendations', desc: 'Index high-compatibility jobs for dashboard prioritization' },
    { number: 9, title: 'Dispatch Email Digest', desc: 'Send daily summary to candidate email for 75%+ matches' },
  ];

  if (loading || !logs) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-40 rounded-2xl bg-slate-900 border border-slate-800" />
        <div className="h-80 rounded-2xl bg-slate-900 border border-slate-800" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-xl flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <RefreshCw className="w-6 h-6 text-purple-400" />
            Scheduled Job Synchronization & Automation
          </h2>
          <p className="text-xs text-slate-400">
            Twice-daily scheduled runs at <strong>08:00 AM IST</strong> and <strong>06:00 PM IST</strong> with automatic email digests
          </p>
        </div>

        <button
          onClick={handleRunSearchNow}
          disabled={running}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-900/30 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          <Play className={`w-4 h-4 ${running ? 'animate-spin' : ''}`} />
          <span>{running ? 'Running 9-Step Pipeline...' : 'Run Search Now'}</span>
        </button>
      </div>

      {/* 9-Step Interactive Workflow Visualizer */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            9-Stage Automation Synchronization Workflow
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Status: {running ? 'Active Execution' : 'Ready'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {workflowSteps.map((step) => {
            const isCompleted = activeStep >= step.number;
            const isCurrent = activeStep === step.number && running;

            return (
              <div
                key={step.number}
                className={`p-3.5 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-purple-950/60 border-purple-500 shadow-md shadow-purple-950/40'
                    : isCompleted
                    ? 'bg-slate-900/80 border-emerald-900/40 text-slate-200'
                    : 'bg-slate-950/50 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-bold flex items-center gap-1.5">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {step.number}
                    </span>
                    <span className={isCompleted ? 'text-white' : ''}>{step.title}</span>
                  </span>

                  {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Execution Result Banner */}
        {currentExecutionReport && (
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 flex items-center justify-between flex-wrap gap-3 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Pipeline Finished Successfully!
              </span>
              <p className="text-slate-300 text-[11px]">
                Found <strong>{currentExecutionReport.newJobsFound} new jobs</strong> and{' '}
                <strong>{currentExecutionReport.highMatchJobsFound} high matches (&gt;=75%)</strong>.
              </p>
            </div>

            {currentExecutionReport.notificationSent && (
              <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold text-[11px]">
                Email Digest Dispatched to {logs.searchConfig.notificationEmail}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Connected Job Providers & Notification History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connected Job Sources */}
        <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Server className="w-4 h-4 text-indigo-400" />
            Connected Job Providers & Services
          </h3>

          <div className="space-y-3">
            {sources.map((src) => (
              <div
                key={src.id}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{src.name}</span>
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Live
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{src.description}</p>
                </div>

                <div className="text-right">
                  <span className="font-mono text-purple-300 font-bold block">{src.jobsFoundCount} Jobs</span>
                  <span className="text-[10px] text-slate-500">
                    {src.lastSyncAt ? new Date(src.lastSyncAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Ready'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notification Logs */}
        <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-400" />
                Dispatched Email Digests
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {logs.notificationLogs.length} Sent
              </span>
            </div>

            <div className="space-y-3">
              {logs.notificationLogs.slice(0, 3).map((notif) => (
                <div
                  key={notif.id}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white truncate max-w-[70%]">{notif.subject}</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                      {notif.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{notif.previewText}</p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px] text-slate-500">
                    <span>To: {notif.recipient}</span>
                    <button
                      onClick={() => onOpenEmailPreview(notif)}
                      className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Preview Email</span>
                    </button>
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
