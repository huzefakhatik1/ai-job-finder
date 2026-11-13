import React from 'react';
import {
  MapPin,
  Briefcase,
  IndianRupee,
  Calendar,
  ExternalLink,
  Bookmark,
  Sparkles,
  CheckCircle2,
  Clock,
  Building2,
  GraduationCap
} from 'lucide-react';
import type { Job, MatchScoreBreakdown } from '../types/index.ts';

interface JobCardProps {
  job: Job & {
    matchScore?: number;
    matchBreakdown?: MatchScoreBreakdown;
    isSaved?: boolean;
    applicationStatus?: string | null;
  };
  onViewMatch: (job: Job) => void;
  onToggleSave: (jobId: string) => void;
  onPrepareInterview?: (job: Job) => void;
  isSelectedForCompare?: boolean;
  onToggleCompare?: (jobId: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onViewMatch,
  onToggleSave,
  onPrepareInterview,
  isSelectedForCompare,
  onToggleCompare
}) => {
  const score = job.matchScore ?? 80;

  // Grade color scheme
  const getScoreBadge = (val: number) => {
    if (val >= 80) {
      return {
        bg: 'from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/40',
        ring: 'text-emerald-400',
        label: 'Excellent Match'
      };
    }
    if (val >= 65) {
      return {
        bg: 'from-blue-500/20 to-cyan-500/20 text-cyan-300 border-cyan-500/40',
        ring: 'text-cyan-400',
        label: 'Strong Match'
      };
    }
    if (val >= 50) {
      return {
        bg: 'from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-500/40',
        ring: 'text-amber-400',
        label: 'Moderate Fit'
      };
    }
    return {
      bg: 'from-slate-500/20 to-gray-500/20 text-slate-300 border-slate-500/40',
      ring: 'text-slate-400',
      label: 'Low Match'
    };
  };

  const badge = getScoreBadge(score);

  // Posted time relative
  const getPostedRelative = (dateStr: string) => {
    const diffHours = Math.round((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60));
    if (diffHours < 24) return `${diffHours}h ago`;
    const days = Math.round(diffHours / 24);
    return `${days}d ago`;
  };

  return (
    <div
      className={`rounded-2xl bg-gradient-to-br from-[#111827] to-[#0f172a] border transition-all duration-200 hover:shadow-xl hover:border-purple-500/40 p-5 flex flex-col justify-between group relative ${
        job.isSaved
          ? 'border-purple-500/50 shadow-md shadow-purple-950/20'
          : 'border-slate-800'
      }`}
    >
      <div>
        {/* Top bar with company & match score */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                {job.company}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60 font-mono">
                {job.sourceName}
              </span>
              {job.sourceId === 'src_gemini_live' && (
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-900/80 to-indigo-900/80 text-purple-200 border border-purple-500/60 font-bold flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3 h-3 text-amber-300" /> ✨ AI Discovered
                </span>
              )}
              {(job.sourceId === 'src_arbeitnow' || job.sourceId === 'src_jobicy') && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-950/90 text-sky-300 border border-sky-700/80 font-semibold flex items-center gap-1 shadow-sm">
                  ⚡ Live API
                </span>
              )}
              {job.isRemote && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-semibold">
                  Remote
                </span>
              )}
            </div>

            <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors leading-tight">
              {job.title}
            </h3>
          </div>

          {/* Match Score Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <div
              className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-xl border bg-gradient-to-b ${badge.bg}`}
            >
              <div className="flex items-center gap-1 font-mono font-bold text-lg leading-none">
                <Sparkles className="w-3.5 h-3.5" />
                {score}%
              </div>
              <span className="text-[9px] font-semibold uppercase tracking-wider mt-0.5">
                {badge.label}
              </span>
            </div>

            {/* Save Button */}
            <button
              onClick={() => onToggleSave(job.id)}
              className={`p-2 rounded-xl border transition-colors ${
                job.isSaved
                  ? 'bg-purple-600/20 border-purple-500 text-purple-400'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title={job.isSaved ? 'Remove from Saved' : 'Save Job'}
            >
              <Bookmark className={`w-4 h-4 ${job.isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Key Job Attributes */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
            <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/20 p-2 rounded-lg border border-emerald-900/30 font-medium">
            <IndianRupee className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">₹{job.minSalaryLpa} - ₹{job.maxSalaryLpa} LPA</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80 col-span-2 sm:col-span-1">
            <Briefcase className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="truncate">{job.minExpYears} - {job.maxExpYears} yrs exp</span>
          </div>
        </div>

        {/* Short description */}
        <p className="mt-3 text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Skills Required & Matches */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {job.skillsRequired?.map((skill, idx) => {
            const isMatched = job.matchBreakdown?.matchedSkills?.includes(skill) ?? true;
            return (
              <span
                key={idx}
                className={`text-[11px] px-2 py-0.5 rounded-md flex items-center gap-1 border font-medium ${
                  isMatched
                    ? 'bg-purple-950/40 text-purple-200 border-purple-800/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                {isMatched && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                {skill}
              </span>
            );
          })}
        </div>

        {/* Application status tag if exists */}
        {job.applicationStatus && (
          <div className="mt-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-800/50">
              Status: {job.applicationStatus}
            </span>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <Clock className="w-3 h-3" />
          <span>{getPostedRelative(job.postedAt)}</span>

          {onToggleCompare && (
            <label className="ml-2 flex items-center gap-1 cursor-pointer text-slate-400 hover:text-white select-none">
              <input
                type="checkbox"
                checked={isSelectedForCompare}
                onChange={() => onToggleCompare(job.id)}
                className="rounded border-slate-700 bg-slate-800 text-purple-600 focus:ring-purple-500 h-3.5 w-3.5"
              />
              <span>Compare</span>
            </label>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onPrepareInterview && (
            <button
              onClick={() => onPrepareInterview(job)}
              className="p-1.5 text-xs text-indigo-300 hover:text-white bg-indigo-950/50 hover:bg-indigo-900/60 rounded-lg border border-indigo-800/40 transition-colors flex items-center gap-1 cursor-pointer"
              title="Generate tailored interview questions with Gemini AI"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Interview Prep</span>
            </button>
          )}

          <button
            onClick={() => onViewMatch(job)}
            className="px-2.5 py-1.5 text-xs font-semibold text-purple-300 hover:text-white bg-purple-950/50 hover:bg-purple-900/60 rounded-lg border border-purple-800/50 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Match Breakdown</span>
          </button>

          <a
            href={job.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex items-center gap-1"
          >
            <span>Apply</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
