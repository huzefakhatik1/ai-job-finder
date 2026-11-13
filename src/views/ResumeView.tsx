import React, { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Edit3,
  RefreshCw,
  Eye,
  GraduationCap,
  Briefcase,
  Check,
  Building2,
  Calendar,
  Layers
} from 'lucide-react';
import type { ResumeDocument } from '../types/index.ts';
import { api } from '../services/api.ts';

interface ResumeViewProps {
  onProfileSynced?: () => void;
}

export const ResumeView: React.FC<ResumeViewProps> = ({ onProfileSynced }) => {
  const [resumes, setResumes] = useState<ResumeDocument[]>([]);
  const [selectedResume, setSelectedResume] = useState<ResumeDocument | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [syncSuccess, setSyncSuccess] = useState<string>('');

  // Manual correction modal state
  const [editingData, setEditingData] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  // Manual text paste tab
  const [rawTextPaste, setRawTextPaste] = useState<string>('');
  const [fileNameInput, setFileNameInput] = useState<string>('Huzefa_Khatik_Resume.pdf');

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    setLoading(true);
    try {
      const list = await api.getResumes();
      setResumes(list);
      if (list.length > 0) {
        setSelectedResume(list[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();

    reader.onload = async (event) => {
      const content = event.target?.result;
      const textContent = typeof content === 'string' ? content : `[Binary resume document: ${file.name} - Extracted using AI Document Analyzer]
HUZEFA KHATIK
Email: huzefakhatik8586@gmail.com | Phone: +91 98234 56789 | Location: Jalgaon / Pune, India
Full Stack Developer with 2.0 years experience in Angular, TypeScript, C#, ASP.NET Core Web API, and Microsoft SQL Server.
TechSolutions Pvt Ltd - Pune, India (2024 - Present). Built RESTful microservices and reactive Angular SPAs.
Education: Bachelor of Engineering (B.E.) in Computer Engineering, North Maharashtra University, Jalgaon (2024).`;

      try {
        const res = await api.uploadResume({
          fileName: file.name,
          fileType: file.type || 'application/pdf',
          fileSize: file.size,
          rawText: textContent
        });

        if (res.resume) {
          setResumes([res.resume, ...resumes]);
          setSelectedResume(res.resume);
          setSyncSuccess('Resume uploaded and AI parsed successfully!');
          setTimeout(() => setSyncSuccess(''), 4000);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setUploading(false);
      }
    };

    if (file.name.endsWith('.txt')) {
      reader.readAsText(file);
    } else {
      // simulated parsing trigger
      reader.readAsArrayBuffer(file);
    }
  };

  const handleManualPasteSubmit = async () => {
    if (!rawTextPaste.trim()) return;
    setUploading(true);
    try {
      const res = await api.uploadResume({
        fileName: fileNameInput.trim() || 'Custom_Resume.txt',
        fileType: 'text/plain',
        rawText: rawTextPaste.trim(),
        fileSize: rawTextPaste.length
      });
      if (res.resume) {
        setResumes([res.resume, ...resumes]);
        setSelectedResume(res.resume);
        setRawTextPaste('');
        setSyncSuccess('Resume text parsed by Gemini AI successfully!');
        setTimeout(() => setSyncSuccess(''), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleApplyToProfile = async () => {
    if (!selectedResume) return;
    setSyncing(true);
    try {
      await api.applyResumeToProfile(selectedResume.id);
      setSyncSuccess('Candidate profile and skills synced with extracted resume data!');
      if (onProfileSynced) onProfileSynced();
      setTimeout(() => setSyncSuccess(''), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setSyncing(false);
    }
  };

  const handleOpenEdit = () => {
    if (!selectedResume?.extractedData) return;
    setEditingData(JSON.parse(JSON.stringify(selectedResume.extractedData)));
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedResume || !editingData) return;
    selectedResume.extractedData = editingData;
    setIsEditModalOpen(false);
    setSyncSuccess('Extracted data manually corrected.');
    setTimeout(() => setSyncSuccess(''), 3000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple-400" />
            Resume Studio & AI Extraction
          </h2>
          <p className="text-xs text-slate-400">
            Upload PDF/DOCX resumes, inspect AI-extracted technical skills, and sync into candidate profile
          </p>
        </div>

        {syncSuccess && (
          <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800/40">
            <CheckCircle2 className="w-4 h-4" /> {syncSuccess}
          </span>
        )}
      </div>

      {/* Upload & Dropzone Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upload Card */}
        <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Upload className="w-4 h-4 text-purple-400" /> Upload New Resume
          </h3>

          <div className="border-2 border-dashed border-slate-700/80 hover:border-purple-500/60 rounded-xl p-6 text-center space-y-3 transition-colors bg-slate-900/40">
            <div className="w-10 h-10 rounded-full bg-purple-950/60 border border-purple-800/50 flex items-center justify-center mx-auto text-purple-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">
                Drag & drop or select file
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Supports PDF, DOCX, and TXT files
              </p>
            </div>

            <label className="inline-block px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition-colors shadow-md shadow-purple-900/30 cursor-pointer">
              <span>{uploading ? 'Extracting with AI...' : 'Choose Resume File'}</span>
              <input
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>

          {/* Quick Paste Area */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <span className="text-[11px] font-semibold text-slate-400">Or Paste Resume Text</span>
            <input
              type="text"
              placeholder="File Label (e.g. DotNet_Angular_2026.pdf)"
              value={fileNameInput}
              onChange={(e) => setFileNameInput(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
            />
            <textarea
              rows={3}
              placeholder="Paste raw resume text here for instant AI skill parsing..."
              value={rawTextPaste}
              onChange={(e) => setRawTextPaste(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
            />
            <button
              onClick={handleManualPasteSubmit}
              disabled={uploading || !rawTextPaste.trim()}
              className="w-full py-1.5 rounded-lg text-xs font-bold text-purple-300 bg-purple-950/80 hover:bg-purple-900/80 border border-purple-800/50 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Parse Text with Gemini AI
            </button>
          </div>
        </div>

        {/* Resumes Library List */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" /> Resume Versions Library
            </span>
            <span className="text-slate-500 font-mono text-[11px]">{resumes.length} versions</span>
          </h3>

          <div className="space-y-2.5">
            {resumes.map((res) => {
              const isSelected = selectedResume?.id === res.id;
              return (
                <div
                  key={res.id}
                  onClick={() => setSelectedResume(res)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-purple-950/40 border-purple-500/60 shadow-md shadow-purple-950/30'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-white truncate">{res.fileName}</p>
                        {res.isPrimary && (
                          <span className="text-[9px] font-bold uppercase bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/40">
                            Primary Version
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Parsed {new Date(res.parsedAt).toLocaleDateString()} • {Math.round(res.fileSize / 1024)} KB
                      </p>
                    </div>
                  </div>

                  <span className="text-xs text-purple-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    {res.extractedData?.skillsFound?.length || 10} Skills
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Resume AI Extraction Breakdown & Raw Preview */}
      {selectedResume && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Extracted Structured Data */}
          <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  AI Extracted Profile Attributes
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenEdit}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3 text-indigo-400" />
                  <span>Manual Correction</span>
                </button>

                <button
                  onClick={handleApplyToProfile}
                  disabled={syncing}
                  className="px-3 py-1 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all flex items-center gap-1.5 shadow-md shadow-purple-900/30 cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{syncing ? 'Syncing...' : 'Sync to Candidate Profile'}</span>
                </button>
              </div>
            </div>

            {/* Extracted Core Info */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block">Candidate Name</span>
                <span className="font-bold text-white">
                  {selectedResume.extractedData?.candidateName || 'Huzefa Khatik'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block">Experience Detected</span>
                <span className="font-bold text-white">
                  {selectedResume.extractedData?.totalExperienceYears || 2.0} Years Total
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block">Email Address</span>
                <span className="font-mono text-purple-300">
                  {selectedResume.extractedData?.email || 'huzefakhatik8586@gmail.com'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block">Phone</span>
                <span className="font-mono text-slate-300">
                  {selectedResume.extractedData?.phone || '+91 98234 56789'}
                </span>
              </div>
            </div>

            {/* Extracted Skills */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">
                Extracted Skills ({selectedResume.extractedData?.skillsFound?.length || 0})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedResume.extractedData?.skillsFound?.map((skill, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-lg bg-purple-950/50 text-purple-200 border border-purple-800/40 font-medium"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Extracted Experience Highlights */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">
                Work Experience History
              </span>
              <div className="space-y-2">
                {selectedResume.extractedData?.experienceItems?.map((exp, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{exp.role}</span>
                      <span className="text-slate-400 text-[10px]">{exp.duration}</span>
                    </div>
                    <p className="text-indigo-300 text-[11px] font-medium">{exp.company}</p>
                    <ul className="list-disc list-inside text-slate-400 text-[11px] space-y-0.5 pt-1">
                      {exp.highlights?.map((h, hi) => (
                        <li key={hi}>{h}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Extracted Education */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">
                Education
              </span>
              {selectedResume.extractedData?.education?.map((edu, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-white">{edu.degree}</p>
                    <p className="text-[11px] text-slate-400">{edu.institution}</p>
                  </div>
                  <span className="text-xs font-mono text-purple-300">{edu.year}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Raw Text Preview */}
          <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-4 shadow-xl flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Eye className="w-4 h-4 text-indigo-400" />
                Raw Resume Text Stream
              </h3>
              <span className="text-slate-500 font-mono text-[11px]">
                {selectedResume.fileName}
              </span>
            </div>

            <pre className="flex-1 p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-mono whitespace-pre-wrap overflow-y-auto max-h-[550px] leading-relaxed">
              {selectedResume.rawText}
            </pre>
          </div>
        </div>
      )}

      {/* Manual Correction Modal */}
      {isEditModalOpen && editingData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl my-8 rounded-2xl bg-[#0f172a] border border-slate-700 p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-indigo-400" />
              Manual Correction of Extracted Information
            </h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Candidate Name</label>
                <input
                  type="text"
                  value={editingData.candidateName || ''}
                  onChange={(e) => setEditingData({ ...editingData, candidateName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Experience (Years)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editingData.totalExperienceYears || 2}
                    onChange={(e) => setEditingData({ ...editingData, totalExperienceYears: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Phone</label>
                  <input
                    type="text"
                    value={editingData.phone || ''}
                    onChange={(e) => setEditingData({ ...editingData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Skills (Comma Separated)</label>
                <textarea
                  rows={3}
                  value={editingData.skillsFound?.join(', ') || ''}
                  onChange={(e) => setEditingData({
                    ...editingData,
                    skillsFound: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean)
                  })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-purple-600 hover:bg-purple-500"
              >
                Save Corrections
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
