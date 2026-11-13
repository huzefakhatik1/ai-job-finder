export interface User {
  id: string;
  email: string;
  name: string;
  role: 'CANDIDATE' | 'ADMIN';
  createdAt: string;
}

export interface CandidateSkill {
  id: string;
  profileId: string;
  skillName: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Cloud & DevOps' | 'Tools & Other';
  proficiencyLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  yearsOfExperience: number;
  isPrimary: boolean;
}

export interface CandidateProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  currentTitle: string;
  experienceYears: number;
  currentCtcLpa: number;
  expectedCtcLpa: number;
  noticePeriodDays: number;
  preferredCountry: string;
  bio: string;
  summary: string;
  updatedAt: string;
}

export interface JobPreferences {
  id: string;
  profileId: string;
  targetRoles: string[];
  preferredLocations: string[];
  openToRemote: boolean;
  minSalaryLpa: number;
  maxSalaryLpa: number;
  jobTypes: string[];
  industryPreferences: string[];
}

export interface ResumeDocument {
  id: string;
  profileId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  rawText: string;
  isPrimary: boolean;
  parsedAt: string;
  createdAt: string;
  extractedData?: {
    candidateName?: string;
    email?: string;
    phone?: string;
    totalExperienceYears?: number;
    skillsFound: string[];
    primaryRoles: string[];
    experienceItems: {
      role: string;
      company: string;
      duration: string;
      highlights: string[];
    }[];
    education: {
      degree: string;
      institution: string;
      year: string;
    }[];
  };
}

export interface JobSource {
  id: string;
  name: string;
  type: 'api' | 'feed' | 'verified_board' | 'ai_engine';
  status: 'active' | 'rate_limited' | 'configured' | 'mock';
  apiKeyConfigured: boolean;
  description: string;
  lastSyncAt: string | null;
  jobsFoundCount: number;
}

export interface JobSkill {
  id: string;
  jobId: string;
  skillName: string;
  isRequired: boolean;
  importanceWeight: number;
}

export interface Job {
  id: string;
  sourceId: string;
  externalId: string;
  title: string;
  company: string;
  location: string;
  isRemote: boolean;
  minExpYears: number;
  maxExpYears: number;
  minSalaryLpa: number;
  maxSalaryLpa: number;
  salaryCurrency: string;
  jobType: 'Full-Time' | 'Contract' | 'Hybrid' | 'Part-Time' | 'Remote';
  description: string;
  requirementsSummary: string[];
  skillsRequired: string[];
  applyUrl: string;
  sourceName: string;
  postedAt: string;
  expiresAt: string;
  lastSeenAt: string;
  isLive: boolean;
  isActive: boolean;
}

export interface MatchScoreBreakdown {
  skillsScore: number;       // 0 - 100
  experienceScore: number;   // 0 - 100
  titleScore: number;        // 0 - 100
  locationScore: number;     // 0 - 100
  salaryScore: number;       // 0 - 100
  freshnessScore: number;    // 0 - 100
  weightsUsed: {
    skills: number;
    experience: number;
    title: number;
    location: number;
    salary: number;
    freshness: number;
  };
  matchedSkills: string[];
  missingSkills: string[];
  experienceFit: string;
  salaryFit: string;
  locationFit: string;
  aiExplanation?: string;
  verdict: 'EXCELLENT' | 'STRONG' | 'MODERATE' | 'LOW';
}

export interface MatchDetails {
  id: string;
  matchId: string;
  skillScore: number;
  experienceScore: number;
  titleScore: number;
  locationScore: number;
  salaryScore: number;
  freshnessScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  experienceDiffYears: number;
  salaryFitStatus: string;
  aiExplanation?: string;
  weightsUsed: Record<string, number>;
}

export interface JobMatch {
  id: string;
  jobId: string;
  profileId: string;
  overallScore: number;
  breakdown: MatchScoreBreakdown;
  calculatedAt: string;
  isAiAnalyzed: boolean;
  aiVerdict?: string;
}

export interface SavedJob {
  id: string;
  jobId: string;
  profileId: string;
  savedAt: string;
  notes: string;
  priorityTag: 'HIGH' | 'MEDIUM' | 'LOW';
}

export type ApplicationStatus = 'SAVED' | 'APPLIED' | 'INTERVIEWING' | 'OFFERED' | 'REJECTED';

export interface JobApplication {
  id: string;
  jobId: string;
  profileId: string;
  status: ApplicationStatus;
  appliedDate: string | null;
  resumeVersionId: string | null;
  followUpDate: string | null;
  notes: string;
  interviewRoundsCount: number;
  contactPerson: string;
  salaryOfferedLpa?: number;
  history: {
    status: ApplicationStatus;
    timestamp: string;
    note: string;
  }[];
}

export interface SearchHistoryItem {
  id: string;
  profileId: string;
  query: string;
  location: string;
  filtersJson: Record<string, any>;
  resultsCount: number;
  executedAt: string;
  triggeredBy: 'MANUAL' | 'SCHEDULED_MORNING' | 'SCHEDULED_EVENING' | 'AI_ASSISTANT';
}

export interface AIAnalysisLog {
  id: string;
  profileId: string;
  jobId?: string;
  provider: 'gemini' | 'openai';
  promptType: 'MATCH_ANALYSIS' | 'RESUME_PARSE' | 'INTERVIEW_PREP' | 'CAREER_ADVICE' | 'CHAT' | 'LIVE_JOB_DISCOVERY';
  tokensUsed: number;
  status: 'SUCCESS' | 'ERROR';
  createdAt: string;
  responseSnippet: string;
}

export interface NotificationLog {
  id: string;
  profileId: string;
  channel: 'EMAIL' | 'IN_APP';
  recipient: string;
  subject: string;
  previewText: string;
  sentAt: string;
  status: 'DELIVERED' | 'SIMULATED';
  matchedJobsCount: number;
  jobTitles: string[];
}

export interface SearchConfiguration {
  id: string;
  profileId: string;
  morningCronTime: string; // "08:00"
  eveningCronTime: string; // "18:00"
  isAutoSearchEnabled: boolean;
  minMatchScoreToNotify: number;
  emailNotificationsEnabled: boolean;
  notificationEmail: string;
  weightsConfig: {
    skills: number;
    experience: number;
    title: number;
    location: number;
    salary: number;
    freshness: number;
  };
}

export interface AppSettings {
  aiProvider: 'gemini' | 'openai';
  geminiModel: string;
  openAiModel: string;
  adzunaAppId: string;
  adzunaAppKey: string;
  joobleApiKey: string;
  hasGeminiKey: boolean;
  hasOpenAiKey: boolean;
}

export interface DashboardMetrics {
  totalJobsDiscovered: number;
  newJobsToday: number;
  excellentMatches: number;
  savedJobs: number;
  applicationsSubmitted: number;
  averageMatchPercentage: number;
  recentActivity: SearchHistoryItem[];
  topRecommendations: (Job & { matchScore: number; matchBreakdown: MatchScoreBreakdown })[];
  skillGaps: { skill: string; demandCount: number }[];
  locationsDistribution: { location: string; count: number }[];
}

export interface InterviewPrepResult {
  jobTitle: string;
  company: string;
  technicalQuestions: {
    question: string;
    category: 'Angular' | '.NET' | 'SQL' | 'Architecture' | 'General';
    sampleAnswerGuideline: string;
    whyAsked: string;
  }[];
  experienceBasedQuestions: {
    question: string;
    focusArea: string;
    tip: string;
  }[];
  questionsToAskInterviewer: string[];
}

export interface CareerImprovementPlan {
  currentRoleSummary: string;
  strengths: string[];
  criticalMissingSkills: {
    skill: string;
    marketDemand: string;
    howToLearn: string;
    expectedSalaryImpact: string;
  }[];
  recommendedNextSteps: string[];
  targetCompaniesInRegion: string[];
}
