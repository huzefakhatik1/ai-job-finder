import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  MapPin,
  IndianRupee,
  Briefcase,
  Sparkles,
  GitCompare,
  RotateCcw,
  Building2,
  CheckCircle2,
  X
} from 'lucide-react';
import type { Job } from '../types/index.ts';
import { JobCard } from '../components/JobCard.tsx';
import { api } from '../services/api.ts';

interface JobsViewProps {
  onViewJobMatch: (job: Job) => void;
  onToggleSaveJob: (jobId: string) => void;
  onPrepareInterview: (job: Job) => void;
  selectedCompareIds: string[];
  onToggleCompareJob: (jobId: string) => void;
  onOpenCompareMatrix: () => void;
}

export const JobsView: React.FC<JobsViewProps> = ({
  onViewJobMatch,
  onToggleSaveJob,
  onPrepareInterview,
  selectedCompareIds,
  onToggleCompareJob,
  onOpenCompareMatrix
}) => {
  const [jobs, setJobs] = useState<(Job & { matchScore?: number; isSaved?: boolean })[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [query, setQuery] = useState<string>('');
  const [location, setLocation] = useState<string>('All');
  const [minSalary, setMinSalary] = useState<number>(0);
  const [isRemoteOnly, setIsRemoteOnly] = useState<boolean>(false);
  const [jobType, setJobType] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'match' | 'salary' | 'newest'>('match');
  const [syncingLive, setSyncingLive] = useState<boolean>(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string>('');

  useEffect(() => {
    loadJobs();
  }, [location, minSalary, isRemoteOnly, jobType]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = await api.getJobs({
        query: query.trim() || undefined,
        location: location !== 'All' ? location : undefined,
        minSalary: minSalary > 0 ? minSalary : undefined,
        isRemote: isRemoteOnly,
        jobType: jobType !== 'All' ? jobType : undefined
      });
      setJobs(data.jobs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLiveAiSearch = async () => {
    setSyncingLive(true);
    setSyncStatusMsg('Contacting Gemini AI & Live Developer Feeds to discover latest openings...');
    try {
      const res = await api.searchLiveAiJobs({
        query: query.trim() || undefined,
        location: location !== 'All' ? location : undefined,
        minSalary: minSalary > 0 ? minSalary : undefined,
        isRemote: isRemoteOnly,
        jobType: jobType !== 'All' ? jobType : undefined
      });
      setJobs(res.jobs || []);
      setSyncStatusMsg(`Success! AI discovered ${res.newlyAdded} new openings matching your criteria. Showing ${res.count} total jobs.`);
      setTimeout(() => setSyncStatusMsg(''), 7000);
    } catch (err: any) {
      setSyncStatusMsg(`Live AI Discovery note: ${err.message}`);
      setTimeout(() => setSyncStatusMsg(''), 7000);
    } finally {
      setSyncingLive(false);
    }
  };

  const handleFetchLiveJobs = async () => {
    await handleLiveAiSearch();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadJobs();
  };

  const handleResetFilters = () => {
    setQuery('');
    setLocation('All');
    setMinSalary(0);
    setIsRemoteOnly(false);
    setJobType('All');
    setSortBy('match');
  };

  // Sorting
  const sortedJobs = [...jobs].sort((a, b) => {
    if (sortBy === 'match') {
      return (b.matchScore || 0) - (a.matchScore || 0);
    }
    if (sortBy === 'salary') {
      return b.maxSalaryLpa - a.maxSalaryLpa;
    }
    if (sortBy === 'newest') {
      return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Search & Filter Header Bar */}
      <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-4 shadow-lg">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by role, skill (Angular, C#, .NET Web API), or company (Persistent, PubMatic, Cognizant)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 text-xs font-semibold transition-all shrink-0 cursor-pointer"
            title="Filter currently cached database jobs"
          >
            Filter Cache
          </button>

          <button
            type="button"
            onClick={handleLiveAiSearch}
            disabled={syncingLive}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 cursor-pointer"
            title="Discover fresh active job openings using Gemini AI & Live Developer feeds"
          >
            <Sparkles className={`w-4 h-4 ${syncingLive ? 'animate-spin text-amber-300' : 'text-amber-300'}`} />
            <span>{syncingLive ? 'AI Searching Live Market...' : '⚡ Fetch Latest Jobs from AI'}</span>
          </button>
        </form>

        {syncStatusMsg && (
          <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-600/40 text-purple-200 text-xs flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
              {syncStatusMsg}
            </span>
            <button
              onClick={() => setSyncStatusMsg('')}
              className="text-purple-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Filter controls row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 border-t border-slate-800/80 text-xs">
          {/* Location */}
          <div className="space-y-1">
            <label className="text-slate-400 font-medium text-[11px] flex items-center gap-1">
              <MapPin className="w-3 h-3 text-indigo-400" /> Location
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-white text-xs"
            >
              <option value="All">All Locations</option>
              <option value="Pune">Pune</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Remote">Remote (India)</option>
              <option value="Nashik">Nashik</option>
              <option value="Jalgaon">Jalgaon</option>
            </select>
          </div>

          {/* Min Salary */}
          <div className="space-y-1">
            <label className="text-slate-400 font-medium text-[11px] flex items-center gap-1">
              <IndianRupee className="w-3 h-3 text-emerald-400" /> Min CTC
            </label>
            <select
              value={minSalary}
              onChange={(e) => setMinSalary(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-white text-xs"
            >
              <option value={0}>Any CTC</option>
              <option value={3.5}>₹3.5+ LPA</option>
              <option value={4.5}>₹4.5+ LPA</option>
              <option value={5.0}>₹5.0+ LPA (Target)</option>
              <option value={6.5}>₹6.5+ LPA</option>
            </select>
          </div>

          {/* Job Type */}
          <div className="space-y-1">
            <label className="text-slate-400 font-medium text-[11px] flex items-center gap-1">
              <Briefcase className="w-3 h-3 text-blue-400" /> Job Type
            </label>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-white text-xs"
            >
              <option value="All">All Types</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="space-y-1">
            <label className="text-slate-400 font-medium text-[11px] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400" /> Sort Order
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-white text-xs"
            >
              <option value="match">Match Score (Highest)</option>
              <option value="salary">Salary (Highest)</option>
              <option value="newest">Recently Posted</option>
            </select>
          </div>

          {/* Remote Toggle */}
          <div className="flex items-center gap-2 pt-5">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 select-none">
              <input
                type="checkbox"
                checked={isRemoteOnly}
                onChange={(e) => setIsRemoteOnly(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-purple-600 h-3.5 w-3.5"
              />
              <span className="font-semibold text-[11px]">Remote Only</span>
            </label>
          </div>

          {/* Reset Filters */}
          <div className="flex items-center pt-5 justify-end">
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Comparison Drawer if jobs selected */}
      {selectedCompareIds.length > 0 && (
        <div className="sticky top-20 z-10 p-3 rounded-xl bg-purple-950/90 backdrop-blur-md border border-purple-500/50 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-purple-200">
            <GitCompare className="w-4 h-4 text-purple-400" />
            <span className="font-bold">{selectedCompareIds.length} Job(s) Selected</span>
            <span className="text-purple-300 hidden sm:inline">• Compare technical fit, salary, and requirements side-by-side</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCompareMatrix}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition-colors shadow-md shadow-purple-900/40 cursor-pointer"
            >
              Open Comparison Matrix
            </button>
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>
          Showing <strong>{sortedJobs.length}</strong> verified opportunities across India
        </span>
        <span className="text-[11px] font-mono text-purple-300">
          Scored with 6-Dimension Weighted Engine
        </span>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : sortedJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onViewMatch={onViewJobMatch}
              onToggleSave={onToggleSaveJob}
              onPrepareInterview={onPrepareInterview}
              isSelectedForCompare={selectedCompareIds.includes(job.id)}
              onToggleCompare={onToggleCompareJob}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-[#0f172a] border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No job openings found matching your criteria</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try adjusting your search terms, relaxing the minimum salary filter, or selecting "All Locations" to explore more positions.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-purple-300 bg-purple-950/60 hover:bg-purple-900/60 border border-purple-800/60 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
