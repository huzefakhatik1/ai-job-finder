import React, { useState, useEffect } from 'react';
import {
  X,
  GraduationCap,
  Sparkles,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Lightbulb,
  Building2,
  RefreshCw
} from 'lucide-react';
import type { Job, InterviewPrepResult } from '../types/index.ts';
import { api } from '../services/api.ts';

interface InterviewPrepModalProps {
  job: Job;
  onClose: () => void;
}

export const InterviewPrepModal: React.FC<InterviewPrepModalProps> = ({ job, onClose }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [prepData, setPrepData] = useState<InterviewPrepResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  useEffect(() => {
    loadPrep();
  }, [job.id]);

  const loadPrep = async () => {
    setLoading(true);
    try {
      const data = await api.getInterviewPrep(job.id);
      setPrepData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!prepData) return;
    const text = `INTERVIEW PREPARATION: ${job.title} at ${job.company}\n\nTECHNICAL QUESTIONS:\n${prepData.technicalQuestions.map((q, i) => `${i + 1}. [${q.category}] ${q.question}\nSample Answer: ${q.sampleAnswerGuideline}\n`).join('\n')}\nEXPERIENCE QUESTIONS:\n${prepData.experienceBasedQuestions.map((q, i) => `${i + 1}. ${q.question} (Tip: ${q.tip})\n`).join('\n')}\nQUESTIONS TO ASK:\n${prepData.questionsToAskInterviewer.map((q, i) => `${i + 1}. ${q}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-3xl my-8 rounded-2xl bg-[#0f172a] border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-950/80 to-[#0e1424] border-b border-slate-800 flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                {job.company}
              </span>
              <span className="px-2 py-0.5 text-[10px] rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Gemini 3.8 Flash
              </span>
            </div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-400" />
              AI Technical Interview Prep: {job.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyToClipboard}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-1 text-xs"
              title="Copy all questions"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy Prep'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
              <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
              <p className="text-sm">Synthesizing Angular & .NET interview questions with Gemini AI...</p>
            </div>
          ) : prepData ? (
            <>
              {/* Technical Questions Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    Targeted Technical Questions (Angular • .NET • SQL)
                  </h3>
                  <span className="text-xs text-slate-500">
                    {prepData.technicalQuestions.length} Questions
                  </span>
                </div>

                <div className="space-y-3">
                  {prepData.technicalQuestions.map((q, idx) => {
                    const isExpanded = expandedIndex === idx;
                    return (
                      <div
                        key={idx}
                        className="rounded-xl bg-slate-900/60 border border-slate-800/80 overflow-hidden"
                      >
                        <button
                          onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                          className="w-full px-4 py-3 text-left flex items-start justify-between gap-3 hover:bg-slate-800/40 transition-colors"
                        >
                          <div className="flex items-start gap-2.5 min-w-0">
                            <span className="text-xs font-mono font-bold text-indigo-400 px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-800/40 shrink-0">
                              {q.category}
                            </span>
                            <span className="text-xs font-semibold text-slate-200">
                              {q.question}
                            </span>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="px-4 pb-4 pt-1 border-t border-slate-800/60 space-y-2.5 text-xs">
                            <div className="p-3 rounded-lg bg-[#0e1424] border border-slate-800 text-slate-300">
                              <span className="font-bold text-emerald-400 block mb-1 flex items-center gap-1">
                                <Lightbulb className="w-3.5 h-3.5" /> Recommended Answer Structure:
                              </span>
                              <p className="leading-relaxed">{q.sampleAnswerGuideline}</p>
                            </div>

                            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                              <span>Evaluates: {q.whyAsked}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Behavioral & Experience Questions */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Behavioral & Delivery Questions
                </h3>
                <div className="space-y-3">
                  {prepData.experienceBasedQuestions.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200">{q.question}</span>
                        <span className="text-[10px] text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
                          {q.focusArea}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        <strong className="text-slate-300">Interview Tip:</strong> {q.tip}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Questions to Ask Interviewer */}
              <div className="p-4 rounded-xl bg-[#141b2d] border border-indigo-900/30">
                <h3 className="text-xs font-bold text-indigo-300 mb-2.5 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-indigo-400" />
                  Strategic Questions You Should Ask the Interviewer at {job.company}
                </h3>
                <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
                  {prepData.questionsToAskInterviewer.map((q, idx) => (
                    <li key={idx} className="leading-relaxed">{q}</li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="py-8 text-center text-slate-400 text-sm">
              Unable to generate interview questions. Please try again.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
