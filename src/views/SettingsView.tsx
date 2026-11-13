import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Sparkles,
  ShieldCheck,
  Save,
  CheckCircle2,
  RotateCcw,
  Clock,
  Mail,
  Server,
  Layers,
  Percent
} from 'lucide-react';
import type { AppSettings, SearchConfiguration } from '../types/index.ts';
import { api } from '../services/api.ts';

interface SettingsViewProps {
  onWeightsUpdated?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onWeightsUpdated }) => {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [searchConfig, setSearchConfig] = useState<SearchConfiguration | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [savedMsg, setSavedMsg] = useState<string>('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await api.getSettings();
      setSettings(data.settings);
      setSearchConfig(data.searchConfig);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings || !searchConfig) return;
    setSaving(true);
    try {
      await api.updateSettings({ settings, searchConfig });
      setSavedMsg('Settings and scoring weights updated! All job scores recalculated.');
      if (onWeightsUpdated) onWeightsUpdated();
      setTimeout(() => setSavedMsg(''), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleResetWeights = () => {
    if (!searchConfig) return;
    setSearchConfig({
      ...searchConfig,
      weightsConfig: {
        skills: 40,
        experience: 20,
        title: 15,
        location: 10,
        salary: 10,
        freshness: 5
      }
    });
  };

  if (loading || !settings || !searchConfig) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-40 rounded-2xl bg-slate-900 border border-slate-800" />
        <div className="h-80 rounded-2xl bg-slate-900 border border-slate-800" />
      </div>
    );
  }

  const weightsSum =
    searchConfig.weightsConfig.skills +
    searchConfig.weightsConfig.experience +
    searchConfig.weightsConfig.title +
    searchConfig.weightsConfig.location +
    searchConfig.weightsConfig.salary +
    searchConfig.weightsConfig.freshness;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Sliders className="w-6 h-6 text-purple-400" />
            System Configuration & Weighting Rules
          </h2>
          <p className="text-xs text-slate-400">
            Configure AI provider selection, weighted job matching formula, and automated schedules
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedMsg && (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800/40">
              <CheckCircle2 className="w-4 h-4" /> {savedMsg}
            </span>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-900/30 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      {/* AI Provider Section */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            AI Provider & Intelligence Model
          </h3>
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" /> Server-side API Keys Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Gemini */}
          <div
            onClick={() => setSettings({ ...settings, aiProvider: 'gemini' })}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              settings.aiProvider === 'gemini'
                ? 'bg-purple-950/40 border-purple-500 shadow-md shadow-purple-950/30'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-white text-sm flex items-center gap-2">
                Google Gemini
                <span className="px-1.5 py-0.5 text-[9px] font-mono bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">
                  Recommended
                </span>
              </span>
              <span className="text-emerald-400 text-xs font-semibold">
                ● Connected
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Model: <strong>gemini-3.8-flash</strong>. Executes resume parsing, multi-dimensional semantic matching, and interview question synthesis.
            </p>
          </div>

          {/* OpenAI */}
          <div
            onClick={() => setSettings({ ...settings, aiProvider: 'openai' })}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              settings.aiProvider === 'openai'
                ? 'bg-purple-950/40 border-purple-500 shadow-md shadow-purple-950/30'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-white text-sm">OpenAI API</span>
              <span className="text-slate-500 text-xs font-mono">Standby</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Model: <strong>gpt-4o-mini</strong>. Alternate fallback provider for text inference and skill comparison.
            </p>
          </div>
        </div>
      </div>

      {/* Weighted Scoring Algorithm Customizer */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <Percent className="w-4 h-4 text-emerald-400" />
              Configurable Weighted Scoring Formula
            </h3>
            <p className="text-[11px] text-slate-400">
              Deterministic scoring weights. Total sum: <strong>{weightsSum}%</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetWeights}
            className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset to Standard Weights</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
          {/* Skills */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300">Technical Skills Weight</span>
              <span className="font-mono text-purple-300 font-bold">{searchConfig.weightsConfig.skills}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="70"
              value={searchConfig.weightsConfig.skills}
              onChange={(e) => setSearchConfig({
                ...searchConfig,
                weightsConfig: { ...searchConfig.weightsConfig, skills: Number(e.target.value) }
              })}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">Core match on Angular, C#, .NET Web API & SQL Server</p>
          </div>

          {/* Experience */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300">Experience Fit Weight</span>
              <span className="font-mono text-blue-300 font-bold">{searchConfig.weightsConfig.experience}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              value={searchConfig.weightsConfig.experience}
              onChange={(e) => setSearchConfig({
                ...searchConfig,
                weightsConfig: { ...searchConfig.weightsConfig, experience: Number(e.target.value) }
              })}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">Evaluates candidate 2.0 years vs min/max requirements</p>
          </div>

          {/* Job Title */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300">Job Title Weight</span>
              <span className="font-mono text-emerald-300 font-bold">{searchConfig.weightsConfig.title}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              value={searchConfig.weightsConfig.title}
              onChange={(e) => setSearchConfig({
                ...searchConfig,
                weightsConfig: { ...searchConfig.weightsConfig, title: Number(e.target.value) }
              })}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">Semantic alignment to Full Stack, Angular & .NET</p>
          </div>

          {/* Location */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300">Location & Remote Weight</span>
              <span className="font-mono text-amber-300 font-bold">{searchConfig.weightsConfig.location}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="25"
              value={searchConfig.weightsConfig.location}
              onChange={(e) => setSearchConfig({
                ...searchConfig,
                weightsConfig: { ...searchConfig.weightsConfig, location: Number(e.target.value) }
              })}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">Pune, Mumbai, Jalgaon, Nashik & Remote</p>
          </div>

          {/* Salary */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300">Salary Target Weight</span>
              <span className="font-mono text-pink-300 font-bold">{searchConfig.weightsConfig.salary}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="25"
              value={searchConfig.weightsConfig.salary}
              onChange={(e) => setSearchConfig({
                ...searchConfig,
                weightsConfig: { ...searchConfig.weightsConfig, salary: Number(e.target.value) }
              })}
              className="w-full accent-pink-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">Expected ₹5 LPA vs offered range</p>
          </div>

          {/* Freshness */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300">Listing Freshness Weight</span>
              <span className="font-mono text-cyan-300 font-bold">{searchConfig.weightsConfig.freshness}%</span>
            </div>
            <input
              type="range"
              min="2"
              max="15"
              value={searchConfig.weightsConfig.freshness}
              onChange={(e) => setSearchConfig({
                ...searchConfig,
                weightsConfig: { ...searchConfig.weightsConfig, freshness: Number(e.target.value) }
              })}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">Priority for vacancies posted in last 24h</p>
          </div>
        </div>
      </div>

      {/* Automation & Notification Settings */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-5 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 border-b border-slate-800 pb-3">
          <Clock className="w-4 h-4 text-indigo-400" />
          Scheduled Search & Email Notification Alerts
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-slate-400 font-semibold flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-purple-400" /> Notification Email Recipient
            </label>
            <input
              type="email"
              value={searchConfig.notificationEmail}
              onChange={(e) => setSearchConfig({ ...searchConfig, notificationEmail: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-400 font-semibold">
              Minimum Match Score to Notify: <strong>{searchConfig.minMatchScoreToNotify}%</strong>
            </label>
            <input
              type="range"
              min="50"
              max="90"
              value={searchConfig.minMatchScoreToNotify}
              onChange={(e) => setSearchConfig({ ...searchConfig, minMatchScoreToNotify: Number(e.target.value) })}
              className="w-full accent-purple-500 cursor-pointer pt-2"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-slate-200 font-semibold select-none">
              <input
                type="checkbox"
                checked={searchConfig.isAutoSearchEnabled}
                onChange={(e) => setSearchConfig({ ...searchConfig, isAutoSearchEnabled: e.target.checked })}
                className="rounded border-slate-700 bg-slate-800 text-purple-600 h-4 w-4"
              />
              <span>Enable Scheduled Auto-Search (08:00 AM & 06:00 PM IST)</span>
            </label>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-slate-200 font-semibold select-none">
              <input
                type="checkbox"
                checked={searchConfig.emailNotificationsEnabled}
                onChange={(e) => setSearchConfig({ ...searchConfig, emailNotificationsEnabled: e.target.checked })}
                className="rounded border-slate-700 bg-slate-800 text-purple-600 h-4 w-4"
              />
              <span>Send Daily Email Digest for Strong Matches</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
