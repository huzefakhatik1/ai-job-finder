import type {
  CandidateProfile,
  CandidateSkill,
  JobPreferences,
  Job,
  JobMatch,
  MatchScoreBreakdown,
  SearchConfiguration
} from '../types/index.ts';

// Skill synonym groups for fuzzy matching
const SKILL_SYNONYMS: Record<string, string[]> = {
  'angular': ['angular', 'angular 14+', 'angular 15+', 'angular 16+', 'angular 17+', 'angularjs', 'angular framework', 'frontend angular'],
  'typescript': ['typescript', 'ts'],
  'javascript': ['javascript', 'js', 'es6', 'es6+'],
  'c#': ['c#', 'c-sharp', 'c sharp', '.net', 'c#.net'],
  '.net web api': ['.net web api', 'asp.net core web api', 'asp.net web api', '.net core api', 'web api', 'asp.net core', '.net core', 'dotnet core'],
  'sql server': ['sql server', 'ms sql', 'mssql', 'microsoft sql server', 't-sql', 'sql database', 'relational database'],
  'entity framework core': ['entity framework core', 'ef core', 'entity framework', 'ef', 'orm'],
  'html5/css3': ['html5/css3', 'html', 'css', 'html5', 'css3', 'bootstrap', 'tailwind css', 'responsive design'],
  'git & github': ['git & github', 'git', 'github', 'version control', 'gitlab'],
  'restful architecture': ['restful architecture', 'rest api', 'rest apis', 'restful services', 'web services', 'microservices']
};

export function normalizeSkill(skill: string): string {
  return skill.toLowerCase().trim().replace(/[^a-z0-9+#.]/g, ' ');
}

export function checkSkillMatch(requiredSkill: string, candidateSkills: CandidateSkill[]): boolean {
  const normRequired = normalizeSkill(requiredSkill);

  for (const cSkill of candidateSkills) {
    const normCand = normalizeSkill(cSkill.skillName);
    if (normCand === normRequired || normCand.includes(normRequired) || normRequired.includes(normCand)) {
      return true;
    }

    // Check synonym groups
    for (const [key, synonyms] of Object.entries(SKILL_SYNONYMS)) {
      const candMatchesKey = synonyms.some(s => normalizeSkill(s) === normCand || normCand.includes(normalizeSkill(s)));
      const reqMatchesKey = synonyms.some(s => normalizeSkill(s) === normRequired || normRequired.includes(normalizeSkill(s)));
      if (candMatchesKey && reqMatchesKey) {
        return true;
      }
    }
  }

  return false;
}

export function calculateDeterministicMatch(
  job: Job,
  profile: CandidateProfile,
  candidateSkills: CandidateSkill[],
  preferences: JobPreferences,
  config?: SearchConfiguration['weightsConfig']
): MatchScoreBreakdown {
  const weights = config || {
    skills: 40,
    experience: 20,
    title: 15,
    location: 10,
    salary: 10,
    freshness: 5
  };

  // 1. Skills Scoring (40%)
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  const jobReqSkills = job.skillsRequired && job.skillsRequired.length > 0
    ? job.skillsRequired
    : ['Angular', 'C#', '.NET Web API', 'SQL Server'];

  for (const skill of jobReqSkills) {
    if (checkSkillMatch(skill, candidateSkills)) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  }

  const skillsScore = jobReqSkills.length > 0
    ? Math.round((matchedSkills.length / jobReqSkills.length) * 100)
    : 80;

  // 2. Experience Scoring (20%)
  const candidateExp = profile.experienceYears;
  let experienceScore = 50;
  let experienceFit = 'Compatible';

  if (candidateExp >= job.minExpYears && candidateExp <= job.maxExpYears) {
    experienceScore = 100;
    experienceFit = `Ideal fit: ${candidateExp} yrs matches requirement (${job.minExpYears}-${job.maxExpYears} yrs)`;
  } else if (candidateExp < job.minExpYears) {
    const diff = job.minExpYears - candidateExp;
    if (diff <= 1) {
      experienceScore = 80;
      experienceFit = `Slight stretch: Requires ${job.minExpYears} yrs, candidate has ${candidateExp} yrs`;
    } else if (diff <= 2) {
      experienceScore = 60;
      experienceFit = `Moderate stretch: Requires ${job.minExpYears} yrs`;
    } else {
      experienceScore = 30;
      experienceFit = `Senior role: Requires ${job.minExpYears}+ yrs`;
    }
  } else {
    // Overqualified
    const over = candidateExp - job.maxExpYears;
    if (over <= 1.5) {
      experienceScore = 90;
      experienceFit = `Comfortable match: Exceeds min experience (${candidateExp} vs ${job.minExpYears} yrs)`;
    } else {
      experienceScore = 70;
      experienceFit = `Senior candidate for role (${candidateExp} vs ${job.maxExpYears} max)`;
    }
  }

  // 3. Job Title Scoring (15%)
  const jobTitleNorm = job.title.toLowerCase();
  let titleScore = 40;
  for (const role of preferences.targetRoles) {
    const roleNorm = role.toLowerCase();
    if (jobTitleNorm.includes(roleNorm) || roleNorm.includes(jobTitleNorm)) {
      titleScore = 100;
      break;
    }
    // Partial keywords: 'angular', '.net', 'full stack'
    if (
      (jobTitleNorm.includes('angular') && roleNorm.includes('angular')) ||
      (jobTitleNorm.includes('.net') && roleNorm.includes('.net')) ||
      (jobTitleNorm.includes('full stack') && roleNorm.includes('full stack'))
    ) {
      titleScore = Math.max(titleScore, 85);
    }
  }

  // 4. Location Scoring (10%)
  let locationScore = 30;
  let locationFit = 'Other Location';
  const jobLoc = job.location.toLowerCase();

  if (job.isRemote || jobLoc.includes('remote')) {
    locationScore = 100;
    locationFit = 'Remote (Fully Supported)';
  } else {
    for (const prefLoc of preferences.preferredLocations) {
      const prefNorm = prefLoc.toLowerCase();
      if (jobLoc.includes(prefNorm) || prefNorm.includes(jobLoc)) {
        locationScore = 100;
        locationFit = `Direct Match: ${prefLoc}`;
        break;
      }
    }
    if (locationScore < 100 && (jobLoc.includes('maharashtra') || jobLoc.includes('india'))) {
      locationScore = 70;
      locationFit = 'Regional Maharashtra / India';
    }
  }

  // 5. Salary Scoring (10%)
  const expectedCtc = profile.expectedCtcLpa; // 5.0
  let salaryScore = 60;
  let salaryFit = `Offered ₹${job.minSalaryLpa} - ₹${job.maxSalaryLpa} LPA`;

  if (job.maxSalaryLpa >= expectedCtc) {
    salaryScore = 100;
    salaryFit = `Meets or exceeds expected ₹${expectedCtc} LPA (Up to ₹${job.maxSalaryLpa} LPA)`;
  } else if (job.maxSalaryLpa >= expectedCtc * 0.8) {
    salaryScore = 75;
    salaryFit = `Near target: ₹${job.maxSalaryLpa} LPA vs expected ₹${expectedCtc} LPA`;
  } else if (job.maxSalaryLpa >= profile.currentCtcLpa * 1.3) {
    salaryScore = 65;
    salaryFit = `Provides hike over current ₹${profile.currentCtcLpa} LPA`;
  } else {
    salaryScore = 40;
    salaryFit = `Below expected CTC (${job.maxSalaryLpa} LPA vs ${expectedCtc} LPA)`;
  }

  // 6. Freshness Scoring (5%)
  const postedDate = new Date(job.postedAt).getTime();
  const ageHours = (Date.now() - postedDate) / (1000 * 60 * 60);
  let freshnessScore = 50;
  if (ageHours <= 24) {
    freshnessScore = 100;
  } else if (ageHours <= 72) {
    freshnessScore = 85;
  } else if (ageHours <= 168) {
    freshnessScore = 70;
  }

  // Weighted total
  const totalWeight = weights.skills + weights.experience + weights.title + weights.location + weights.salary + weights.freshness;
  const weightedSum =
    (skillsScore * weights.skills) +
    (experienceScore * weights.experience) +
    (titleScore * weights.title) +
    (locationScore * weights.location) +
    (salaryScore * weights.salary) +
    (freshnessScore * weights.freshness);

  const rawOverall = Math.round(weightedSum / totalWeight);
  const overallScore = Math.min(99, Math.max(15, rawOverall));

  let verdict: 'EXCELLENT' | 'STRONG' | 'MODERATE' | 'LOW' = 'LOW';
  if (overallScore >= 80) verdict = 'EXCELLENT';
  else if (overallScore >= 65) verdict = 'STRONG';
  else if (overallScore >= 50) verdict = 'MODERATE';

  return {
    skillsScore,
    experienceScore,
    titleScore,
    locationScore,
    salaryScore,
    freshnessScore,
    weightsUsed: weights,
    matchedSkills,
    missingSkills,
    experienceFit,
    salaryFit,
    locationFit,
    verdict
  };
}

export function buildJobMatchRecord(
  job: Job,
  profile: CandidateProfile,
  skills: CandidateSkill[],
  preferences: JobPreferences,
  weightsConfig?: SearchConfiguration['weightsConfig'],
  aiExplanation?: string
): JobMatch {
  const breakdown = calculateDeterministicMatch(job, profile, skills, preferences, weightsConfig);
  if (aiExplanation) {
    breakdown.aiExplanation = aiExplanation;
  }

  return {
    id: `jm_${job.id}_${profile.id}`,
    jobId: job.id,
    profileId: profile.id,
    overallScore: Math.round(
      (breakdown.skillsScore * breakdown.weightsUsed.skills +
       breakdown.experienceScore * breakdown.weightsUsed.experience +
       breakdown.titleScore * breakdown.weightsUsed.title +
       breakdown.locationScore * breakdown.weightsUsed.location +
       breakdown.salaryScore * breakdown.weightsUsed.salary +
       breakdown.freshnessScore * breakdown.weightsUsed.freshness) /
      (breakdown.weightsUsed.skills + breakdown.weightsUsed.experience + breakdown.weightsUsed.title + breakdown.weightsUsed.location + breakdown.weightsUsed.salary + breakdown.weightsUsed.freshness)
    ),
    breakdown,
    calculatedAt: new Date().toISOString(),
    isAiAnalyzed: !!aiExplanation,
    aiVerdict: breakdown.verdict
  };
}
