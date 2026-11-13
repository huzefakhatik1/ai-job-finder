import type {
  CandidateProfile,
  CandidateSkill,
  JobPreferences,
  ResumeDocument,
  Job,
  JobMatch,
  JobApplication,
  JobSource,
  NotificationLog,
  SearchHistoryItem,
  SearchConfiguration,
  AppSettings,
  DashboardMetrics,
  InterviewPrepResult,
  CareerImprovementPlan
} from '../types/index.ts';

export async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {})
    }
  });

  if (!res.ok) {
    const errorText = await res.text();
    let msg = `HTTP ${res.status}: ${res.statusText}`;
    try {
      const parsed = JSON.parse(errorText);
      if (parsed.error) msg = parsed.error;
    } catch {
      if (errorText) msg = errorText;
    }
    throw new Error(msg);
  }

  return res.json() as Promise<T>;
}

export const api = {
  // Health
  getHealth: () => fetchJson<{ status: string; geminiConfigured: boolean }>('/api/health'),

  // Dashboard
  getDashboard: () => fetchJson<DashboardMetrics>('/api/dashboard'),

  // Profile
  getProfile: () => fetchJson<{ profile: CandidateProfile; skills: CandidateSkill[]; preferences: JobPreferences }>('/api/profile'),
  updateProfile: (profile: Partial<CandidateProfile>) => fetchJson<{ success: boolean; profile: CandidateProfile }>('/api/profile', {
    method: 'PUT',
    body: JSON.stringify(profile)
  }),
  addSkill: (skill: Partial<CandidateSkill>) => fetchJson<{ success: boolean; skill: CandidateSkill }>('/api/profile/skills', {
    method: 'POST',
    body: JSON.stringify(skill)
  }),
  deleteSkill: (id: string) => fetchJson<{ success: boolean }>(`/api/profile/skills/${id}`, {
    method: 'DELETE'
  }),
  updatePreferences: (preferences: Partial<JobPreferences>) => fetchJson<{ success: boolean; preferences: JobPreferences }>('/api/profile/preferences', {
    method: 'PUT',
    body: JSON.stringify(preferences)
  }),

  // Resumes
  getResumes: () => fetchJson<ResumeDocument[]>('/api/resumes'),
  uploadResume: (data: { fileName: string; fileType: string; rawText: string; fileSize?: number }) =>
    fetchJson<{ success: boolean; resume: ResumeDocument }>('/api/resumes/upload', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  applyResumeToProfile: (resumeId: string) =>
    fetchJson<{ success: boolean; profile: CandidateProfile; skills: CandidateSkill[] }>(`/api/resumes/${resumeId}/apply-to-profile`, {
      method: 'POST'
    }),

  // Jobs
  searchLiveAiJobs: (params?: { query?: string; location?: string; minSalary?: number; experience?: number; isRemote?: boolean; jobType?: string }) =>
    fetchJson<{ success: boolean; count: number; newlyAdded: number; sourcesChecked: string[]; jobs: (Job & { matchScore: number; matchBreakdown?: any; isSaved?: boolean; applicationStatus?: string })[] }>('/api/jobs/live-ai-search', {
      method: 'POST',
      body: JSON.stringify(params || {})
    }),
  syncLiveJobs: (params?: { query?: string; location?: string }) =>
    fetchJson<{ success: boolean; newlyAdded: number; totalProcessed: number; sourcesChecked: string[] }>('/api/jobs/sync-live', {
      method: 'POST',
      body: JSON.stringify(params || {})
    }),
  getJobs: (params?: { query?: string; location?: string; minSalary?: number; experience?: number; isRemote?: boolean; jobType?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.query) searchParams.set('query', params.query);
    if (params?.location) searchParams.set('location', params.location);
    if (params?.minSalary) searchParams.set('minSalary', String(params.minSalary));
    if (params?.experience !== undefined) searchParams.set('experience', String(params.experience));
    if (params?.isRemote) searchParams.set('isRemote', 'true');
    if (params?.jobType) searchParams.set('jobType', params.jobType);

    const qs = searchParams.toString();
    return fetchJson<{ count: number; jobs: (Job & { matchScore: number; matchBreakdown?: any; isSaved?: boolean; applicationStatus?: string })[] }>(`/api/jobs${qs ? `?${qs}` : ''}`);
  },
  getJobDetails: (jobId: string) =>
    fetchJson<{ job: Job; match: JobMatch; isSaved: boolean; application?: JobApplication }>(`/api/jobs/${jobId}`),
  toggleSaveJob: (jobId: string, notes?: string) =>
    fetchJson<{ saved: boolean }>(`/api/jobs/${jobId}/toggle-save`, {
      method: 'POST',
      body: JSON.stringify({ notes })
    }),
  getSavedJobs: () => fetchJson<{ id: string; jobId: string; savedAt: string; notes: string; job: Job; matchScore: number }[]>('/api/saved-jobs'),

  // Applications
  getApplications: () => fetchJson<(JobApplication & { job?: Job; matchScore?: number })[]>('/api/applications'),
  updateApplication: (appData: Partial<JobApplication> & { jobId: string }) =>
    fetchJson<{ success: boolean; application: JobApplication }>('/api/applications', {
      method: 'POST',
      body: JSON.stringify(appData)
    }),

  // AI
  getAiMatchAnalysis: (jobId: string) =>
    fetchJson<{ success: boolean; explanation: string; match: JobMatch }>('/api/ai/match-analysis', {
      method: 'POST',
      body: JSON.stringify({ jobId })
    }),
  getInterviewPrep: (jobId: string) =>
    fetchJson<InterviewPrepResult>('/api/ai/interview-prep', {
      method: 'POST',
      body: JSON.stringify({ jobId })
    }),
  getCareerRoadmap: () => fetchJson<CareerImprovementPlan>('/api/ai/career-roadmap'),
  sendAiChat: (message: string) =>
    fetchJson<{ reply: string; actionTaken?: { type: string; payload?: any } }>('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message })
    }),

  // Automation
  runAutomationSync: () =>
    fetchJson<{ success: boolean; report: any }>('/api/automation/run', {
      method: 'POST'
    }),
  getAutomationLogs: () =>
    fetchJson<{
      notificationLogs: NotificationLog[];
      searchHistory: SearchHistoryItem[];
      aiAnalysisLogs: any[];
      searchConfig: SearchConfiguration;
    }>('/api/automation/logs'),
  getJobSources: () => fetchJson<JobSource[]>('/api/discovery/sources'),

  // Settings
  getSettings: () => fetchJson<{ settings: AppSettings; searchConfig: SearchConfiguration }>('/api/settings'),
  updateSettings: (payload: { settings?: Partial<AppSettings>; searchConfig?: Partial<SearchConfiguration> }) =>
    fetchJson<{ success: boolean; settings: AppSettings; searchConfig: SearchConfiguration }>('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(payload)
    })
};
