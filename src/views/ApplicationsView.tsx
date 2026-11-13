import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  ExternalLink,
  Plus,
  Clock,
  Calendar,
  Building2,
  CheckCircle2,
  ChevronRight,
  Edit2,
  MessageSquare,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import type { JobApplication, ApplicationStatus } from '../types/index.ts';
import { api } from '../services/api.ts';

interface ApplicationsViewProps {
  onNavigateToJobs: () => void;
}

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({ onNavigateToJobs }) => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingApp, setEditingApp] = useState<any | null>(null);
  const [editNotes, setEditNotes] = useState<string>('');
  const [editContact, setEditContact] = useState<string>('');
  const [editRounds, setEditRounds] = useState<number>(0);
  const [editOffer, setEditOffer] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const data = await api.getApplications();
      setApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (jobId: string, newStatus: ApplicationStatus) => {
    try {
      await api.updateApplication({
        jobId,
        status: newStatus,
        notes: `Application status transitioned to ${newStatus}`
      });
      loadApplications();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (appItem: any) => {
    setEditingApp(appItem);
    setEditNotes(appItem.notes || '');
    setEditContact(appItem.contactPerson || '');
    setEditRounds(appItem.interviewRoundsCount || 0);
    setEditOffer(appItem.salaryOfferedLpa || 0);
    setIsModalOpen(true);
  };

  const handleSaveDetails = async () => {
    if (!editingApp) return;
    try {
      await api.updateApplication({
        jobId: editingApp.jobId,
        notes: editNotes,
        contactPerson: editContact,
        interviewRoundsCount: editRounds,
        salaryOfferedLpa: editOffer > 0 ? editOffer : undefined
      });
      setIsModalOpen(false);
      loadApplications();
    } catch (err) {
      console.error(err);
    }
  };

  const stages: { key: ApplicationStatus; label: string; color: string; border: string }[] = [
    { key: 'SAVED', label: 'Bookmarked / To Apply', color: 'bg-slate-900/40 text-slate-300', border: 'border-slate-800' },
    { key: 'APPLIED', label: 'Applied', color: 'bg-blue-950/40 text-blue-300', border: 'border-blue-900/40' },
    { key: 'INTERVIEWING', label: 'Interviewing', color: 'bg-purple-950/40 text-purple-300', border: 'border-purple-900/40' },
    { key: 'OFFERED', label: 'Offers Received', color: 'bg-emerald-950/40 text-emerald-300', border: 'border-emerald-900/40' },
    { key: 'REJECTED', label: 'Archived', color: 'bg-gray-950/40 text-gray-400', border: 'border-gray-900/40' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-purple-400" />
            Job Applications Pipeline
          </h2>
          <p className="text-xs text-slate-400">
            Monitor and advance your interview stages, recruiter follow-ups, and compensation offers
          </p>
        </div>

        <button
          onClick={onNavigateToJobs}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span>Find More Jobs</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Kanban Stages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stages.map((stage) => {
          const items = applications.filter((a) => a.status === stage.key);
          return (
            <div
              key={stage.key}
              className={`rounded-2xl border ${stage.border} bg-[#0f172a] p-4 flex flex-col min-h-[500px] shadow-lg`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  {stage.label}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-300">
                  {items.length}
                </span>
              </div>

              {/* Column Cards */}
              <div className="flex-1 space-y-3 overflow-y-auto">
                {items.map((appItem) => (
                  <div
                    key={appItem.id}
                    className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 transition-all space-y-2.5 shadow-sm group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 truncate">
                          <Building2 className="w-3 h-3 text-indigo-400" />
                          {appItem.job?.company || 'Enterprise Corp'}
                        </span>
                        <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors leading-tight mt-0.5">
                          {appItem.job?.title || 'Full Stack Engineer'}
                        </h4>
                      </div>

                      <button
                        onClick={() => openEditModal(appItem)}
                        className="p-1 rounded text-slate-500 hover:text-white transition-colors"
                        title="Edit notes & rounds"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>₹{appItem.job?.minSalaryLpa} - ₹{appItem.job?.maxSalaryLpa} LPA</span>
                      <span className="text-purple-400 font-mono font-bold">{appItem.matchScore}%</span>
                    </div>

                    {appItem.contactPerson && (
                      <p className="text-[10px] text-indigo-300 truncate">
                        Recruiter: {appItem.contactPerson}
                      </p>
                    )}

                    {appItem.notes && (
                      <p className="text-[10px] text-slate-400 italic line-clamp-2 bg-slate-950 p-1.5 rounded border border-slate-800/60">
                        "{appItem.notes}"
                      </p>
                    )}

                    {/* Stage quick advance */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <select
                        value={appItem.status}
                        onChange={(e) => handleStatusChange(appItem.jobId, e.target.value as ApplicationStatus)}
                        className="text-[10px] bg-slate-950 text-slate-300 border border-slate-700/80 rounded px-1.5 py-0.5"
                      >
                        <option value="SAVED">Saved</option>
                        <option value="APPLIED">Applied</option>
                        <option value="INTERVIEWING">Interviewing</option>
                        <option value="OFFERED">Offered</option>
                        <option value="REJECTED">Archived</option>
                      </select>

                      {appItem.job?.applyUrl && (
                        <a
                          href={appItem.job.applyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-white"
                          title="Open original portal"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}

                {items.length === 0 && (
                  <div className="h-32 flex flex-col items-center justify-center text-slate-600 text-xs border border-dashed border-slate-800/80 rounded-xl">
                    <span>No applications</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Application Modal */}
      {isModalOpen && editingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#0f172a] border border-slate-700 p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-400" />
              Update Application: {editingApp.job?.title}
            </h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Recruiter / Contact Person</label>
                <input
                  type="text"
                  placeholder="e.g. Priya Sharma (Tech Recruiter)"
                  value={editContact}
                  onChange={(e) => setEditContact(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Interview Rounds Cleared</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={editRounds}
                    onChange={(e) => setEditRounds(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Salary Offered (₹ LPA)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    placeholder="e.g. 6.5"
                    value={editOffer || ''}
                    onChange={(e) => setEditOffer(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Notes & Follow-ups</label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDetails}
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-purple-600 hover:bg-purple-500"
              >
                Save Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
