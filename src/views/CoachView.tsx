import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Sparkles,
  TrendingUp,
  Target,
  Lightbulb,
  Building2,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Award
} from 'lucide-react';
import type { CareerImprovementPlan, Job } from '../types/index.ts';
import { api } from '../services/api.ts';

interface CoachViewProps {
  onPrepareInterviewForJob: (job: Job) => void;
}

export const CoachView: React.FC<CoachViewProps> = ({ onPrepareInterviewForJob }) => {
  const [careerPlan, setCareerPlan] = useState<CareerImprovementPlan | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [plan, jobData] = await Promise.all([
        api.getCareerRoadmap(),
        api.getJobs()
      ]);
      setCareerPlan(plan);
      setJobs(jobData.jobs || []);
      if (jobData.jobs?.length > 0) {
        setSelectedJobId(jobData.jobs[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshPlan = async () => {
    setRefreshing(true);
    try {
      const plan = await api.getCareerRoadmap();
      setCareerPlan(plan);
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLaunchJobPrep = () => {
    const job = jobs.find((j) => j.id === selectedJobId);
    if (job) {
      onPrepareInterviewForJob(job);
    }
  };

  if (loading || !careerPlan) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 rounded-2xl bg-slate-900 border border-slate-800" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-72 rounded-2xl bg-slate-900 border border-slate-800" />
          <div className="h-72 rounded-2xl bg-slate-900 border border-slate-800" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-[#0f172a] border border-purple-500/30 flex items-center justify-between flex-wrap gap-4 shadow-xl">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Powered by Gemini 3.8 Flash
            </span>
          </div>

          <h2 className="text-xl font-extrabold text-white tracking-tight">
            AI Career Improvement & Interview Coach
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed">
            Market-aligned upskilling recommendations and role-specific interview preparation designed to elevate your compensation from ₹2 LPA to ₹5–8 LPA.
          </p>
        </div>

        <button
          onClick={handleRefreshPlan}
          disabled={refreshing}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh AI Analysis'}</span>
        </button>
      </div>

      {/* Target Interview Prep Selector Card */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            Job-Specific Interview Question Generator
          </h3>
          <span className="text-xs text-slate-400">Select any active job</span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="flex-1 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-medium"
          >
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title} — {j.company} ({j.location} • ₹{j.minSalaryLpa}-{j.maxSalaryLpa} LPA)
              </option>
            ))}
          </select>

          <button
            onClick={handleLaunchJobPrep}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all shadow-md shadow-purple-900/30 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span>Generate Custom Interview Questions</span>
          </button>
        </div>
      </div>

      {/* Market Standing & Strengths */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Executive Standing */}
        <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-400" /> Market Standing & Trajectory
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
            {careerPlan.currentRoleSummary}
          </p>

          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300 block">Verified Core Strengths:</span>
            <div className="space-y-1.5">
              {careerPlan.strengths.map((str, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{str}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended Companies */}
        <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-400" /> Target Employers in Pune, Mumbai & Remote
          </h3>

          <div className="grid grid-cols-2 gap-2.5">
            {careerPlan.targetCompaniesInRegion.map((comp, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-950/80 border border-indigo-800/50 flex items-center justify-center text-indigo-300 font-bold text-[10px]">
                  {idx + 1}
                </div>
                <span className="font-semibold text-slate-200">{comp}</span>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/30 text-xs text-purple-200">
            <p className="font-semibold flex items-center gap-1.5">
              <Award className="w-4 h-4 text-purple-400" /> Salary Growth Projections:
            </p>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              With 2.0 years experience, lateral hiring packages for Angular + .NET Core Web API range between <strong>₹5.0 to ₹8.5 LPA</strong> across Hinjawadi, Magarpatta, and Remote Indian setups.
            </p>
          </div>
        </div>
      </div>

      {/* Critical Missing Skills with High ROI */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-5 shadow-xl">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" />
            High-Impact Upskilling Recommendations (ROI on CTC)
          </h3>
          <span className="text-xs text-slate-400 font-mono">Top Market Skill Gaps</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {careerPlan.criticalMissingSkills.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-white">{item.skill}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/50 font-bold shrink-0">
                    {item.expectedSalaryImpact}
                  </span>
                </div>

                <p className="text-[11px] text-purple-300 font-medium">
                  Demand: {item.marketDemand}
                </p>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {item.howToLearn}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Estimated 2-3 weeks self-study</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step-by-Step Strategic Roadmap */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-4 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          Recommended 30-Day Execution Steps
        </h3>

        <div className="space-y-2.5">
          {careerPlan.recommendedNextSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3 text-xs"
            >
              <span className="w-6 h-6 rounded-full bg-purple-950 text-purple-300 border border-purple-800/60 flex items-center justify-center font-bold text-xs shrink-0">
                {idx + 1}
              </span>
              <p className="text-slate-300 leading-relaxed pt-0.5">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
