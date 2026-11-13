import React, { useState, useEffect } from 'react';
import {
  UserCircle,
  Briefcase,
  IndianRupee,
  MapPin,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  Save,
  Clock,
  Layers,
  Database as DbIcon,
  Globe,
  Tag
} from 'lucide-react';
import type { CandidateProfile, CandidateSkill, JobPreferences } from '../types/index.ts';
import { api } from '../services/api.ts';

interface ProfileViewProps {
  onProfileUpdated?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onProfileUpdated }) => {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [skills, setSkills] = useState<CandidateSkill[]>([]);
  const [preferences, setPreferences] = useState<JobPreferences | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Add skill modal state
  const [newSkillName, setNewSkillName] = useState<string>('');
  const [newSkillCategory, setNewSkillCategory] = useState<CandidateSkill['category']>('Frontend');
  const [newSkillProficiency, setNewSkillProficiency] = useState<CandidateSkill['proficiencyLevel']>('Advanced');
  const [newSkillYears, setNewSkillYears] = useState<number>(2);
  const [newSkillPrimary, setNewSkillPrimary] = useState<boolean>(false);

  // New role / location inputs
  const [newRoleInput, setNewRoleInput] = useState<string>('');
  const [newLocationInput, setNewLocationInput] = useState<string>('');

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      const data = await api.getProfile();
      setProfile(data.profile);
      setSkills(data.skills);
      setPreferences(data.preferences);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await api.updateProfile(profile);
      if (preferences) {
        await api.updatePreferences(preferences);
      }
      setSuccessMsg('Profile and preferences updated! Match scores recalculated.');
      if (onProfileUpdated) onProfileUpdated();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    try {
      const res = await api.addSkill({
        skillName: newSkillName.trim(),
        category: newSkillCategory,
        proficiencyLevel: newSkillProficiency,
        yearsOfExperience: newSkillYears,
        isPrimary: newSkillPrimary
      });
      if (res.skill) {
        setSkills([...skills, res.skill]);
        setNewSkillName('');
        setNewSkillPrimary(false);
        if (onProfileUpdated) onProfileUpdated();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      await api.deleteSkill(id);
      setSkills(skills.filter(s => s.id !== id));
      if (onProfileUpdated) onProfileUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTargetRole = () => {
    if (!newRoleInput.trim() || !preferences) return;
    const current = preferences.targetRoles || [];
    if (!current.includes(newRoleInput.trim())) {
      setPreferences({ ...preferences, targetRoles: [...current, newRoleInput.trim()] });
    }
    setNewRoleInput('');
  };

  const handleRemoveTargetRole = (role: string) => {
    if (!preferences) return;
    setPreferences({
      ...preferences,
      targetRoles: preferences.targetRoles.filter(r => r !== role)
    });
  };

  const handleAddLocation = () => {
    if (!newLocationInput.trim() || !preferences) return;
    const current = preferences.preferredLocations || [];
    if (!current.includes(newLocationInput.trim())) {
      setPreferences({ ...preferences, preferredLocations: [...current, newLocationInput.trim()] });
    }
    setNewLocationInput('');
  };

  const handleRemoveLocation = (loc: string) => {
    if (!preferences) return;
    setPreferences({
      ...preferences,
      preferredLocations: preferences.preferredLocations.filter(l => l !== loc)
    });
  };

  if (loading || !profile || !preferences) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-40 rounded-2xl bg-slate-900 border border-slate-800" />
        <div className="h-96 rounded-2xl bg-slate-900 border border-slate-800" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top action header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <UserCircle className="w-6 h-6 text-purple-400" />
            Candidate Profile & Match Configuration
          </h2>
          <p className="text-xs text-slate-400">
            Customize your professional background, target Indian tech roles, and salary expectations
          </p>
        </div>

        <div className="flex items-center gap-3">
          {successMsg && (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" /> {successMsg}
            </span>
          )}

          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-900/30 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </div>

      {/* Basic Candidate Information */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-6 shadow-xl">
        <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300 border-b border-slate-800 pb-3 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-purple-400" />
          Primary Profile Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-slate-400 font-semibold">Full Name</label>
            <input
              type="text"
              value={profile.fullName}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:border-purple-500"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-slate-400 font-semibold">Email Address</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:border-purple-500"
            />
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-slate-400 font-semibold">Phone Number</label>
            <input
              type="text"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:border-purple-500"
            />
          </div>

          {/* Current Title */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-slate-400 font-semibold">Current Professional Title</label>
            <input
              type="text"
              value={profile.currentTitle}
              onChange={(e) => setProfile({ ...profile, currentTitle: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:border-purple-500"
            />
          </div>

          {/* Total Experience Years */}
          <div className="space-y-1.5">
            <label className="text-slate-400 font-semibold">Experience (Years)</label>
            <input
              type="number"
              step="0.5"
              min="0"
              max="20"
              value={profile.experienceYears}
              onChange={(e) => setProfile({ ...profile, experienceYears: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:border-purple-500"
            />
          </div>

          {/* Current CTC */}
          <div className="space-y-1.5">
            <label className="text-slate-400 font-semibold flex items-center gap-1">
              <IndianRupee className="w-3.5 h-3.5 text-slate-500" /> Current CTC (₹ LPA)
            </label>
            <input
              type="number"
              step="0.1"
              value={profile.currentCtcLpa}
              onChange={(e) => setProfile({ ...profile, currentCtcLpa: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:border-purple-500"
            />
          </div>

          {/* Expected CTC */}
          <div className="space-y-1.5">
            <label className="text-slate-400 font-semibold flex items-center gap-1 text-emerald-400">
              <IndianRupee className="w-3.5 h-3.5" /> Expected CTC (₹ LPA)
            </label>
            <input
              type="number"
              step="0.1"
              value={profile.expectedCtcLpa}
              onChange={(e) => setProfile({ ...profile, expectedCtcLpa: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-emerald-700/80 text-emerald-300 font-bold focus:border-emerald-500"
            />
          </div>

          {/* Notice Period */}
          <div className="space-y-1.5">
            <label className="text-slate-400 font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" /> Notice Period (Days)
            </label>
            <input
              type="number"
              value={profile.noticePeriodDays}
              onChange={(e) => setProfile({ ...profile, noticePeriodDays: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:border-purple-500"
            />
          </div>
        </div>

        {/* Bio / Summary */}
        <div className="space-y-1.5 text-xs">
          <label className="text-slate-400 font-semibold">Professional Bio & Career Objective</label>
          <textarea
            rows={3}
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs leading-relaxed focus:border-purple-500"
          />
        </div>
      </div>

      {/* Candidate Technical Skills Management */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Technical Skills & Competencies ({skills.length})
            </h3>
            <p className="text-[11px] text-slate-400">
              Primary skills receive 40% weight in the job compatibility calculation
            </p>
          </div>
        </div>

        {/* Skill Badges List */}
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs transition-all ${
                skill.isPrimary
                  ? 'bg-purple-950/60 border-purple-500/60 text-purple-200 shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              <div>
                <span className="font-semibold">{skill.skillName}</span>
                <span className="text-[10px] text-slate-400 ml-1.5 font-mono">
                  {skill.proficiencyLevel} • {skill.yearsOfExperience}y
                </span>
              </div>

              {skill.isPrimary && (
                <span className="text-[9px] font-bold uppercase bg-purple-500/20 text-purple-300 px-1 rounded">
                  Primary
                </span>
              )}

              <button
                type="button"
                onClick={() => handleDeleteSkill(skill.id)}
                className="text-slate-500 hover:text-rose-400 transition-colors p-0.5 ml-1"
                title="Remove skill"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Skill Form */}
        <form onSubmit={handleAddSkill} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-3">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-purple-400" /> Add Technical Skill
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
            <input
              type="text"
              placeholder="Skill Name (e.g. RxJS, Azure, Docker)..."
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
            />

            <select
              value={newSkillCategory}
              onChange={(e) => setNewSkillCategory(e.target.value as any)}
              className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
            >
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Database">Database</option>
              <option value="Cloud & DevOps">Cloud & DevOps</option>
              <option value="Tools & Other">Tools & Other</option>
            </select>

            <select
              value={newSkillProficiency}
              onChange={(e) => setNewSkillProficiency(e.target.value as any)}
              className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>

            <input
              type="number"
              step="0.5"
              min="0.5"
              max="20"
              placeholder="Years Exp"
              value={newSkillYears}
              onChange={(e) => setNewSkillYears(Number(e.target.value))}
              className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
            />

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1 text-[11px] text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={newSkillPrimary}
                  onChange={(e) => setNewSkillPrimary(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-purple-600 h-3.5 w-3.5"
                />
                <span>Primary</span>
              </label>

              <button
                type="submit"
                className="flex-1 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors shrink-0 cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Job Search Preferences */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-6 shadow-xl">
        <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300 border-b border-slate-800 pb-3 flex items-center gap-2">
          <Globe className="w-4 h-4 text-purple-400" />
          Job Preferences & Regional Targets (India)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Target Roles */}
          <div className="space-y-3">
            <label className="text-slate-300 font-bold block">Target Job Titles / Roles</label>
            <div className="flex flex-wrap gap-2">
              {preferences.targetRoles?.map((role, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-800/40 text-indigo-200 flex items-center gap-1.5"
                >
                  {role}
                  <button
                    type="button"
                    onClick={() => handleRemoveTargetRole(role)}
                    className="hover:text-rose-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add role (e.g. Lead Angular Engineer)..."
                value={newRoleInput}
                onChange={(e) => setNewRoleInput(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
              />
              <button
                type="button"
                onClick={handleAddTargetRole}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          {/* Preferred Locations */}
          <div className="space-y-3">
            <label className="text-slate-300 font-bold block">Preferred Locations (India)</label>
            <div className="flex flex-wrap gap-2">
              {preferences.preferredLocations?.map((loc, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-200 flex items-center gap-1.5"
                >
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  {loc}
                  <button
                    type="button"
                    onClick={() => handleRemoveLocation(loc)}
                    className="hover:text-rose-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add location (e.g. Hyderabad, Bengaluru)..."
                value={newLocationInput}
                onChange={(e) => setNewLocationInput(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
              />
              <button
                type="button"
                onClick={handleAddLocation}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold cursor-pointer"
              >
                Add
              </button>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 text-slate-300 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.openToRemote}
                  onChange={(e) => setPreferences({ ...preferences, openToRemote: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-800 text-purple-600 h-4 w-4"
                />
                <span>Open to 100% Remote Opportunities Across India</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
