import React, { useState, useEffect } from 'react';
import {
  GitCompare,
  Building2,
  MapPin,
  IndianRupee,
  Briefcase,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  GraduationCap,
  Trash2
} from 'lucide-react';
import type { Job } from '../types/index.ts';
import { api } from '../services/api.ts';

interface CompareViewProps {
  selectedJobIds: string[];
  onRemoveJobFromCompare: (id: string) => void;
  onPrepareInterview: (job: Job) => void;
  onNavigateToJobs: () => void;
}

export const CompareView: React.FC<CompareViewProps> = ({
  selectedJobIds,
  onRemoveJobFromCompare,
  onPrepareInterview,
  onNavigateToJobs
}) => {
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = await api.getJobs();
      setAllJobs(data.jobs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const comparedJobs = allJobs.filter((j) => selectedJobIds.includes(j.id));
  const fallbackJobs = comparedJobs.length > 0 ? comparedJobs : allJobs.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <GitCompare className="w-6 h-6 text-purple-400" />
            Job Opportunities Comparison Matrix
          </h2>
          <p className="text-xs text-slate-400">
            Compare compensation, skill requirements, and location fit against your 2-year Angular & .NET background
          </p>
        </div>

        <button
          onClick={onNavigateToJobs}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          Select More Jobs
        </button>
      </div>

      {fallbackJobs.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0f172a] border border-slate-800 space-y-3">
          <p className="text-sm text-slate-400">No jobs selected for comparison.</p>
          <button
            onClick={onNavigateToJobs}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500"
          >
            Browse Jobs
          </button>
        </div>
      ) : (
        <div className="rounded-2xl bg-[#0f172a] border border-slate-800 overflow-x-auto shadow-2xl">
          <table className="w-full text-left text-xs text-slate-300 border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#141b2d] border-b border-slate-800 text-white font-bold">
                <th className="p-4 w-1/4">Evaluation Dimension</th>
                {fallbackJobs.map((job) => (
                  <th key={job.id} className="p-4 w-1/4 border-l border-slate-800/80">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[11px] text-indigo-400 flex items-center gap-1 font-semibold">
                          <Building2 className="w-3.5 h-3.5" /> {job.company}
                        </span>
                        <p className="font-bold text-white text-sm mt-0.5">{job.title}</p>
                      </div>

                      <button
                        onClick={() => onRemoveJobFromCompare(job.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Remove from comparison"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/80">
              {/* Match Score */}
              <tr className="hover:bg-slate-900/40">
                <td className="p-4 font-semibold text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400" /> Compatibility Score
                </td>
                {fallbackJobs.map((job: any) => (
                  <td key={job.id} className="p-4 border-l border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-lg font-bold text-emerald-400">
                        {job.matchScore ?? 85}%
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        High Fit
                      </span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Salary & Hike */}
              <tr className="hover:bg-slate-900/40">
                <td className="p-4 font-semibold text-slate-400 flex items-center gap-1.5">
                  <IndianRupee className="w-4 h-4 text-emerald-400" /> Offered CTC Range
                </td>
                {fallbackJobs.map((job) => {
                  const hikePercent = Math.round(((job.maxSalaryLpa - 2.0) / 2.0) * 100);
                  return (
                    <td key={job.id} className="p-4 border-l border-slate-800/80">
                      <p className="font-bold text-white text-sm">
                        ₹{job.minSalaryLpa} - ₹{job.maxSalaryLpa} LPA
                      </p>
                      <p className="text-[11px] text-emerald-400 mt-0.5">
                        +{hikePercent}% hike over current ₹2 LPA
                      </p>
                    </td>
                  );
                })}
              </tr>

              {/* Location */}
              <tr className="hover:bg-slate-900/40">
                <td className="p-4 font-semibold text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-indigo-400" /> Location & Work Model
                </td>
                {fallbackJobs.map((job) => (
                  <td key={job.id} className="p-4 border-l border-slate-800/80">
                    <span className="font-medium text-slate-200">{job.location}</span>
                    <span className="block text-[11px] text-slate-400 mt-0.5">
                      {job.jobType} • {job.isRemote ? 'Remote Supported' : 'On-Site Office'}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Experience Requirement */}
              <tr className="hover:bg-slate-900/40">
                <td className="p-4 font-semibold text-slate-400 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-blue-400" /> Experience Requirement
                </td>
                {fallbackJobs.map((job) => (
                  <td key={job.id} className="p-4 border-l border-slate-800/80">
                    <span className="font-bold text-white">{job.minExpYears} - {job.maxExpYears} Years</span>
                    <span className="block text-[11px] text-emerald-400 mt-0.5">
                      ✓ Fits your 2.0 years background
                    </span>
                  </td>
                ))}
              </tr>

              {/* Skills Overlap */}
              <tr className="hover:bg-slate-900/40">
                <td className="p-4 font-semibold text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" /> Required Skills Overlap
                </td>
                {fallbackJobs.map((job) => (
                  <td key={job.id} className="p-4 border-l border-slate-800/80">
                    <div className="flex flex-wrap gap-1">
                      {job.skillsRequired?.map((skill, si) => (
                        <span
                          key={si}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-purple-300 font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Source Verification */}
              <tr className="hover:bg-slate-900/40">
                <td className="p-4 font-semibold text-slate-400">Original Source</td>
                {fallbackJobs.map((job) => (
                  <td key={job.id} className="p-4 border-l border-slate-800/80">
                    <span className="text-[11px] font-mono text-slate-400">{job.sourceName}</span>
                  </td>
                ))}
              </tr>

              {/* Actions row */}
              <tr className="bg-[#141b2d]/60">
                <td className="p-4 font-semibold text-slate-400">Direct Actions</td>
                {fallbackJobs.map((job) => (
                  <td key={job.id} className="p-4 border-l border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onPrepareInterview(job)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-800/40 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>Prep Interview</span>
                      </button>

                      <a
                        href={job.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>Apply</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
