import React from 'react';
import {
  X,
  Mail,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Sparkles,
  Building2,
  Clock
} from 'lucide-react';
import type { NotificationLog } from '../types/index.ts';

interface NotificationPreviewModalProps {
  notifications: NotificationLog[];
  onClose: () => void;
}

export const NotificationPreviewModal: React.FC<NotificationPreviewModalProps> = ({
  notifications,
  onClose
}) => {
  const activeLog = notifications[0] || {
    id: 'demo_notif',
    channel: 'EMAIL',
    recipient: 'huzefakhatik8586@gmail.com',
    subject: '🎯 2 New Excellent Matches (85%+) for your Profile today',
    previewText: 'Persistent Systems and Cognizant are hiring Full Stack .NET & Angular Developers in Pune and Remote with CTC up to ₹8 LPA.',
    sentAt: new Date().toISOString(),
    status: 'DELIVERED',
    matchedJobsCount: 2,
    jobTitles: ['Angular & .NET Full Stack Engineer', 'Full Stack .NET & Angular Software Engineer']
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl my-8 rounded-2xl bg-[#0f172a] border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#141b2d] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Email Digest Alert Preview</h2>
              <p className="text-xs text-slate-400">
                Scheduled notifications dispatched to {activeLog.recipient}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Client Preview Box */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          {/* Email meta */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">To:</span>
              <span className="font-mono text-purple-300 font-semibold">{activeLog.recipient}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Subject:</span>
              <span className="font-semibold text-white">{activeLog.subject}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Timestamp:</span>
              <span className="text-slate-300">
                {new Date(activeLog.sentAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Delivery Status:</span>
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Delivered Successfully
              </span>
            </div>
          </div>

          {/* Rendered Email Content */}
          <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-4 text-xs text-slate-300">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="font-bold text-sm text-white">AI Job Finder Daily Digest</span>
              </div>
              <span className="text-[11px] text-slate-500">Automated Indian Tech Alerts</span>
            </div>

            <p className="text-slate-200 leading-relaxed">
              Hi <strong>Huzefa Khatik</strong>,
            </p>

            <p className="leading-relaxed">
              Your AI Job Finder assistant completed its scheduled scan across <strong>Adzuna India, Jooble, and Direct Corporate feeds</strong>. We found <strong>{activeLog.matchedJobsCount} high-compatibility positions</strong> matching your 2-year background in Angular, TypeScript, C#, .NET Web API, and SQL Server:
            </p>

            {/* Email simulated job cards */}
            <div className="space-y-2.5 my-3">
              {activeLog.jobTitles.map((title, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-400" />
                    <div>
                      <p className="font-semibold text-white">{title}</p>
                      <p className="text-[11px] text-slate-400">Pune / Mumbai / Remote • ₹4.5 - ₹8.0 LPA</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded bg-purple-950 text-purple-300 border border-purple-800/40 font-mono text-[11px]">
                    92% Match
                  </span>
                </div>
              ))}
            </div>

            <p className="text-slate-400 leading-relaxed text-[11px]">
              Next automatic check scheduled for <strong>08:00 AM IST</strong>. You can run manual searches or adjust matching criteria directly from your dashboard anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
