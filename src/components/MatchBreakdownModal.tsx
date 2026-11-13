import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  GraduationCap,
  Building2,
  MapPin,
  IndianRupee,
  Briefcase,
  Clock,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import type { Job, MatchScoreBreakdown } from '../types/index.ts';
import { api } from '../services/api.ts';

interface MatchBreakdownModalProps {
  job: Job;
  breakdown?: MatchScoreBreakdown;
  score: number;
  onClose: () => void;
  onPrepareInterview?: (job: Job) => void;
  onUpdateStatus?: (status: any) => void;
}

export const MatchBreakdownModal: React.FC<MatchBreakdownModalProps> = ({
  job,
  breakdown,
  score,
  onClose,
  onPrepareInterview,
  onUpdateStatus
}) => {
  const [aiExplanation, setAiExplanation] = useState<string>(breakdown?.aiExplanation || '');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('APPLIED');
  const [statusUpdated, setStatusUpdated] = useState<boolean>(false);

  const bd = breakdown || {
    skillsScore: 90,
    experienceScore: 100,
    titleScore: 95,
    locationScore: 100,
    salaryScore: 85,
    freshnessScore: 90,
    weightsUsed: { skills: 40, experience: 20, title: 15, location: 10, salary: 10, freshness: 5 },
    matchedSkills: ['Angular', 'TypeScript', 'C#', '.NET Web API', 'SQL Server'],
    missingSkills: [],
    experienceFit: 'Ideal candidate match (2 years experience)',
    salaryFit: `Offered ₹${job.minSalaryLpa} - ₹${job.maxSalaryLpa} LPA`,
    locationFit: job.location,
    verdict: 'EXCELLENT' as const
  };

  const handleRegenerateAi = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await api.getAiMatchAnalysis(job.id);
      if (res.explanation) {
        setAiExplanation(res.explanation);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSaveStatus = async () => {
    try {
      await api.updateApplication({
        jobId: job.id,
        status: selectedStatus as any,
        notes: `Application status recorded from match modal on ${new Date().toLocaleDateString()}`
      });
      setStatusUpdated(true);
      if (onUpdateStatus) onUpdateStatus(selectedStatus);
      setTimeout(() => setStatusUpdated(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const dimensions = [
    { label: 'Technical Skills Overlap', score: bd.skillsScore, weight: bd.weightsUsed.skills, desc: `${bd.matchedSkills.length} matched / ${bd.missingSkills.length} missing`, color: 'from-purple-500 to-indigo-500' },
    { label: 'Experience Compatibility', score: bd.experienceScore, weight: bd.weightsUsed.experience, desc: bd.experienceFit, color: 'from-blue-500 to-cyan-500' },
    { label: 'Job Title Alignment', score: bd.titleScore, weight: bd.weightsUsed.title, desc: 'Target: Angular & .NET Full Stack', color: 'from-emerald-500 to-teal-500' },
    { label: 'Location & Work Model', score: bd.locationScore, weight: bd.weightsUsed.location, desc: bd.locationFit, color: 'from-amber-500 to-yellow-500' },
    { label: 'Salary Expectation (₹5 LPA)', score: bd.salaryScore, weight: bd.weightsUsed.salary, desc: bd.salaryFit, color: 'from-rose-500 to-pink-500' },
    { label: 'Freshness & Activity', score: bd.freshnessScore, weight: bd.weightsUsed.freshness, desc: 'Verified live opportunity', color: 'from-indigo-500 to-purple-500' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-3xl my-8 rounded-2xl bg-[#0f172a] border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#141d33] to-[#0e1424] border-b border-slate-800 flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                {job.company}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                {job.sourceName}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white truncate">
              {job.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Main Score Hero Card */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-blue-950/30 border border-purple-500/30 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex flex-col items-center justify-center text-white font-mono font-black text-2xl shadow-lg shadow-purple-900/40">
                <span>{score}%</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {bd.verdict} Compatibility
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                    Weighted Algorithm
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Evaluated using Skills (40%), Experience (20%), Title (15%), Location (10%), Salary (10%), Freshness (5%).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onPrepareInterview && (
                <button
                  onClick={() => {
                    onClose();
                    onPrepareInterview(job);
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-950/40"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Interview Prep</span>
                </button>
              )}

              <a
                href={job.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-colors flex items-center gap-1.5 shadow-md shadow-purple-900/30"
              >
                <span>Apply on Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* AI Semantic Explanation */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Gemini 3.8 Flash Semantic Analysis
              </span>
              <button
                onClick={handleRegenerateAi}
                disabled={isGeneratingAi}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isGeneratingAi ? 'animate-spin' : ''}`} />
                <span>{isGeneratingAi ? 'Analyzing...' : 'Refresh AI Analysis'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic bg-[#0a0f1d] p-3 rounded-lg border border-slate-800/80">
              "{aiExplanation || `Strong match detected. Huzefa Khatik's 2 years of hands-on experience in Angular and C# ASP.NET Core directly addresses ${job.company}'s requirements for ${job.title}. The offered compensation meets your expected ₹5 LPA target.`}"
            </p>
          </div>

          {/* Detailed Dimensions Breakdown */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Weighted Dimensions Breakdown
            </h4>

            <div className="space-y-3">
              {dimensions.map((dim, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-200">
                      {dim.label}{' '}
                      <span className="text-[10px] text-slate-500 font-normal">
                        ({dim.weight}% weight)
                      </span>
                    </span>
                    <span className="font-mono font-bold text-slate-300">
                      {dim.score}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${dim.color}`}
                      style={{ width: `${dim.score}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-400 mt-1.5">
                    {dim.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Matched vs Missing Skills breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <h5 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Matched Skills ({bd.matchedSkills.length})
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {bd.matchedSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-800/50 font-medium"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <h5 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-2.5">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                Missing / Secondary Skills ({bd.missingSkills.length})
              </h5>
              {bd.missingSkills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {bd.missingSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-lg bg-amber-950/30 text-amber-300 border border-amber-800/40"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  Zero critical missing skills! Your profile satisfies 100% of required technical competencies.
                </p>
              )}
            </div>
          </div>

          {/* Quick Application Tracker Status */}
          <div className="p-4 rounded-xl bg-[#141b2d] border border-slate-800 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold text-slate-200">
                Track Application Stage:
              </span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
              >
                <option value="SAVED">Bookmarked / Saved</option>
                <option value="APPLIED">Applied</option>
                <option value="INTERVIEWING">Interviewing</option>
                <option value="OFFERED">Offer Received</option>
                <option value="REJECTED">Archived</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              {statusUpdated && (
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Updated!
                </span>
              )}
              <button
                onClick={handleSaveStatus}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
              >
                Save Status
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
