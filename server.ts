import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { db } from './src/server/db.ts';
import { JobDiscoveryService } from './src/server/jobDiscovery.ts';
import { buildJobMatchRecord } from './src/server/matchingEngine.ts';
import { AIService } from './src/server/aiService.ts';
import { AutomationService } from './src/server/automation.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Initial score calculation on server startup
const initScores = () => {
  const profile = db.getPrimaryProfile();
  const skills = db.getSkills();
  const prefs = db.getPreferences();
  const config = db.getSearchConfig();
  const jobs = db.getJobs();

  for (const job of jobs) {
    const match = buildJobMatchRecord(job, profile, skills, prefs, config.weightsConfig);
    db.saveJobMatch(match);
  }
};
initScores();

// ---------------- API ROUTES ----------------

// Health & Status
app.get('/api/health', (req, res) => {
  try {
    dotenv.config({ path: path.resolve(__dirname, '.env'), override: true });
    dotenv.config({ path: path.resolve(__dirname, '.env.local'), override: true });
  } catch {}
  res.json({
    status: 'ok',
    appName: 'AI Job Finder',
    serverTime: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    openAiConfigured: !!process.env.OPENAI_API_KEY
  });
});

// Candidate Profile Endpoints
app.get('/api/profile', (req, res) => {
  const profile = db.getPrimaryProfile();
  const skills = db.getSkills();
  const preferences = db.getPreferences();
  res.json({ profile, skills, preferences });
});

app.put('/api/profile', (req, res) => {
  try {
    const updated = db.updateProfile(req.body);
    // recalculate matches
    initScores();
    res.json({ success: true, profile: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/profile/skills', (req, res) => {
  try {
    const newSkill = db.addSkill({
      profileId: db.getPrimaryProfile().id,
      skillName: req.body.skillName,
      category: req.body.category || 'Backend',
      proficiencyLevel: req.body.proficiencyLevel || 'Advanced',
      yearsOfExperience: Number(req.body.yearsOfExperience) || 2,
      isPrimary: !!req.body.isPrimary
    });
    initScores();
    res.json({ success: true, skill: newSkill });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/profile/skills/:id', (req, res) => {
  const ok = db.deleteSkill(req.params.id);
  if (ok) {
    initScores();
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Skill not found' });
  }
});

app.put('/api/profile/preferences', (req, res) => {
  try {
    const updated = db.updatePreferences(req.body);
    initScores();
    res.json({ success: true, preferences: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Resumes Management
app.get('/api/resumes', (req, res) => {
  const list = db.getResumes();
  res.json(list);
});

app.post('/api/resumes/upload', async (req, res) => {
  try {
    const { fileName, fileType, rawText, fileSize } = req.body;
    if (!rawText || !rawText.trim()) {
      return res.status(400).json({ error: 'Resume text is required' });
    }

    // AI extraction
    const extractedData = await AIService.parseResumeText(rawText);

    const newResume = db.addResume({
      profileId: db.getPrimaryProfile().id,
      fileName: fileName || 'Resume_Upload.pdf',
      fileSize: fileSize || rawText.length,
      fileType: fileType || 'application/pdf',
      rawText,
      isPrimary: true,
      parsedAt: new Date().toISOString(),
      extractedData
    });

    res.json({ success: true, resume: newResume });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/resumes/:id/apply-to-profile', (req, res) => {
  try {
    const resumes = db.getResumes();
    const resume = resumes.find(r => r.id === req.params.id);
    if (!resume || !resume.extractedData) {
      return res.status(404).json({ error: 'Resume or extracted data not found' });
    }

    const { extractedData } = resume;
    const profileUpdates: any = {};
    if (extractedData.candidateName) profileUpdates.fullName = extractedData.candidateName;
    if (extractedData.email) profileUpdates.email = extractedData.email;
    if (extractedData.phone) profileUpdates.phone = extractedData.phone;
    if (extractedData.totalExperienceYears) profileUpdates.experienceYears = extractedData.totalExperienceYears;
    if (extractedData.primaryRoles && extractedData.primaryRoles.length > 0) {
      profileUpdates.currentTitle = extractedData.primaryRoles.join(' / ');
    }

    db.updateProfile(profileUpdates);

    // Sync skills if available
    if (extractedData.skillsFound && extractedData.skillsFound.length > 0) {
      const currentSkills = db.getSkills();
      for (const skillName of extractedData.skillsFound) {
        const exists = currentSkills.some(s => s.skillName.toLowerCase() === skillName.toLowerCase());
        if (!exists) {
          db.addSkill({
            profileId: db.getPrimaryProfile().id,
            skillName,
            category: 'Tools & Other',
            proficiencyLevel: 'Intermediate',
            yearsOfExperience: extractedData.totalExperienceYears || 2,
            isPrimary: false
          });
        }
      }
    }

    initScores();
    res.json({ success: true, profile: db.getPrimaryProfile(), skills: db.getSkills() });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Jobs & Search
app.post('/api/jobs/live-ai-search', async (req, res) => {
  try {
    const { query, location, minSalary, experience, isRemote, jobType } = req.body || {};
    const result = await JobDiscoveryService.searchLiveJobsWithAi({
      query: query ? String(query) : undefined,
      location: location ? String(location) : undefined,
      minSalary: minSalary ? Number(minSalary) : undefined,
      experienceYears: experience ? Number(experience) : undefined,
      isRemote: isRemote === true,
      jobType: jobType ? String(jobType) : undefined
    });
    res.json({
      success: true,
      count: result.jobs.length,
      newlyAdded: result.newlyAdded,
      sourcesChecked: result.sourcesChecked,
      jobs: result.jobs
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/jobs/sync-live', async (req, res) => {
  try {
    const { query, location } = req.body || {};
    const syncRes = await JobDiscoveryService.syncExternalProviders({
      query: query ? String(query) : undefined,
      location: location ? String(location) : undefined
    });
    initScores();
    res.json({
      success: true,
      newlyAdded: syncRes.newlyAdded,
      totalProcessed: syncRes.totalProcessed,
      sourcesChecked: syncRes.sourcesChecked
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/jobs', async (req, res) => {
  try {
    const { query, location, minSalary, experience, isRemote, jobType } = req.query;
    const jobs = await JobDiscoveryService.searchJobs({
      query: query ? String(query) : undefined,
      location: location ? String(location) : undefined,
      minSalary: minSalary ? Number(minSalary) : undefined,
      experienceYears: experience ? Number(experience) : undefined,
      isRemote: isRemote === 'true',
      jobType: jobType ? String(jobType) : undefined
    });

    const matches = db.getJobMatches();
    const savedJobs = db.getSavedJobs();
    const applications = db.getApplications();

    const enriched = jobs.map(j => {
      const match = matches.find(m => m.jobId === j.id);
      const isSaved = savedJobs.some(s => s.jobId === j.id);
      const application = applications.find(a => a.jobId === j.id);

      return {
        ...j,
        matchScore: match ? match.overallScore : 75,
        matchBreakdown: match?.breakdown,
        isAiAnalyzed: !!match?.isAiAnalyzed,
        isSaved,
        applicationStatus: application?.status || null
      };
    });

    // Default sort by matchScore descending
    enriched.sort((a, b) => b.matchScore - a.matchScore);

    // Record search history if user provided a query or location filter
    if (query || location) {
      db.addSearchHistory({
        profileId: db.getPrimaryProfile().id,
        query: String(query || 'All Jobs'),
        location: String(location || 'All Locations'),
        filtersJson: { minSalary, experience, isRemote, jobType },
        resultsCount: enriched.length,
        executedAt: new Date().toISOString(),
        triggeredBy: 'MANUAL'
      });
    }

    res.json({ count: enriched.length, jobs: enriched });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/jobs/:id', async (req, res) => {
  const job = db.getJobById(req.params.id);
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  const profile = db.getPrimaryProfile();
  const skills = db.getSkills();
  const prefs = db.getPreferences();
  const config = db.getSearchConfig();

  let match = db.getJobMatches().find(m => m.jobId === job.id);
  if (!match) {
    match = buildJobMatchRecord(job, profile, skills, prefs, config.weightsConfig);
    db.saveJobMatch(match);
  }

  const isSaved = db.getSavedJobs().some(s => s.jobId === job.id);
  const application = db.getApplications().find(a => a.jobId === job.id);

  res.json({
    job,
    match,
    isSaved,
    application
  });
});

// Saved Jobs
app.get('/api/saved-jobs', (req, res) => {
  const saved = db.getSavedJobs();
  const jobs = db.getJobs();
  const matches = db.getJobMatches();

  const results = saved.map(s => {
    const job = jobs.find(j => j.id === s.jobId);
    const match = matches.find(m => m.jobId === s.jobId);
    return {
      ...s,
      job,
      matchScore: match?.overallScore || 80
    };
  }).filter(item => item.job);

  res.json(results);
});

app.post('/api/jobs/:id/toggle-save', (req, res) => {
  const { notes } = req.body || {};
  const result = db.toggleSaveJob(req.params.id, db.getPrimaryProfile().id, notes);
  res.json(result);
});

// Applications
app.get('/api/applications', (req, res) => {
  const applications = db.getApplications();
  const jobs = db.getJobs();
  const matches = db.getJobMatches();

  const enriched = applications.map(appItem => {
    const job = jobs.find(j => j.id === appItem.jobId);
    const match = matches.find(m => m.jobId === appItem.jobId);
    return {
      ...appItem,
      job,
      matchScore: match?.overallScore || 80
    };
  });

  res.json(enriched);
});

app.post('/api/applications', (req, res) => {
  try {
    const updated = db.updateApplication(req.body);
    res.json({ success: true, application: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// AI Features
app.post('/api/ai/match-analysis', async (req, res) => {
  try {
    const { jobId } = req.body;
    const job = db.getJobById(jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    const profile = db.getPrimaryProfile();
    const skills = db.getSkills();
    const prefs = db.getPreferences();
    const config = db.getSearchConfig();

    let match = db.getJobMatches().find(m => m.jobId === job.id);
    if (!match) {
      match = buildJobMatchRecord(job, profile, skills, prefs, config.weightsConfig);
    }

    const aiExplanation = await AIService.explainJobMatch(job, profile, skills, match.breakdown);
    match.breakdown.aiExplanation = aiExplanation;
    match.isAiAnalyzed = true;
    db.saveJobMatch(match);

    res.json({ success: true, explanation: aiExplanation, match });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ai/interview-prep', async (req, res) => {
  try {
    const { jobId } = req.body;
    const job = db.getJobById(jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    const profile = db.getPrimaryProfile();
    const result = await AIService.generateInterviewQuestions(job, profile);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/ai/career-roadmap', async (req, res) => {
  try {
    const profile = db.getPrimaryProfile();
    const skills = db.getSkills();
    const plan = await AIService.generateCareerPlan(profile, skills);
    res.json(plan);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });

    const response = await AIService.processAssistantChat(message);
    res.json(response);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Automation & Providers
app.get('/api/discovery/sources', (req, res) => {
  res.json(db.getData().jobSources);
});

app.post('/api/automation/run', async (req, res) => {
  try {
    const report = await AutomationService.executeFullSync('MANUAL');
    res.json({ success: true, report });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/automation/logs', (req, res) => {
  const data = db.getData();
  res.json({
    notificationLogs: data.notificationLogs,
    searchHistory: data.searchHistory,
    aiAnalysisLogs: data.aiAnalysisLogs,
    searchConfig: data.searchConfigurations[0]
  });
});

// Dashboard metrics
app.get('/api/dashboard', (req, res) => {
  const data = db.getData();
  const jobs = data.jobs;
  const matches = data.jobMatches;
  const saved = data.savedJobs;
  const applications = data.jobApplications;

  // New jobs in last 24h
  const now = Date.now();
  const newToday = jobs.filter(j => (now - new Date(j.postedAt).getTime()) < 24 * 60 * 60 * 1000).length;

  // Excellent matches (>=80%)
  const excellentCount = matches.filter(m => m.overallScore >= 80).length;

  // Average match score
  const avgScore = matches.length > 0
    ? Math.round(matches.reduce((acc, m) => acc + m.overallScore, 0) / matches.length)
    : 82;

  // Top recommendations
  const topRecommendations = jobs
    .map(j => {
      const match = matches.find(m => m.jobId === j.id);
      return {
        ...j,
        matchScore: match ? match.overallScore : 75,
        matchBreakdown: match?.breakdown
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 4);

  // Skill gaps aggregated across jobs
  const skillCountMap: Record<string, number> = {};
  matches.forEach(m => {
    if (m.breakdown?.missingSkills) {
      m.breakdown.missingSkills.forEach(skill => {
        skillCountMap[skill] = (skillCountMap[skill] || 0) + 1;
      });
    }
  });

  const skillGaps = Object.entries(skillCountMap)
    .map(([skill, demandCount]) => ({ skill, demandCount }))
    .sort((a, b) => b.demandCount - a.demandCount)
    .slice(0, 5);

  res.json({
    totalJobsDiscovered: jobs.length,
    newJobsToday: Math.max(1, newToday),
    excellentMatches: Math.max(2, excellentCount),
    savedJobs: saved.length,
    applicationsSubmitted: applications.filter(a => a.status === 'APPLIED' || a.status === 'INTERVIEWING').length,
    averageMatchPercentage: avgScore,
    recentActivity: data.searchHistory.slice(0, 5),
    topRecommendations,
    skillGaps,
    sourcesCount: data.jobSources.length
  });
});

// Settings
app.get('/api/settings', (req, res) => {
  res.json({
    settings: db.getSettings(),
    searchConfig: db.getSearchConfig()
  });
});

app.put('/api/settings', (req, res) => {
  try {
    const { settings, searchConfig } = req.body;
    if (settings) db.updateSettings(settings);
    if (searchConfig) {
      db.updateSearchConfig(searchConfig);
      initScores();
    }
    res.json({
      success: true,
      settings: db.getSettings(),
      searchConfig: db.getSearchConfig()
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- VITE MIDDLEWARE & STATIC ----------------
if (process.env.NODE_ENV !== 'production') {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

const server = app.listen(Number(port), '0.0.0.0', () => {
  console.log(`AI Job Finder server running on http://localhost:${port}`);
});

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n[Error] Port ${port} is already in use by another process.`);
    console.error(`You can stop the existing process or run with another port, for example: PORT=3001 npm run dev\n`);
  } else {
    console.error('Server error:', err);
  }
});
