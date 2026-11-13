import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type {
  User,
  CandidateProfile,
  CandidateSkill,
  JobPreferences,
  ResumeDocument,
  JobSource,
  Job,
  JobSkill,
  JobMatch,
  MatchDetails,
  SavedJob,
  JobApplication,
  SearchHistoryItem,
  AIAnalysisLog,
  NotificationLog,
  SearchConfiguration,
  AppSettings
} from '../types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'ai_job_finder_db.json');

export interface DatabaseSchema {
  users: User[];
  candidateProfiles: CandidateProfile[];
  candidateSkills: CandidateSkill[];
  jobPreferences: JobPreferences[];
  resumes: ResumeDocument[];
  jobSources: JobSource[];
  jobs: Job[];
  jobSkills: JobSkill[];
  jobMatches: JobMatch[];
  matchDetails: MatchDetails[];
  savedJobs: SavedJob[];
  jobApplications: JobApplication[];
  searchHistory: SearchHistoryItem[];
  aiAnalysisLogs: AIAnalysisLog[];
  notificationLogs: NotificationLog[];
  searchConfigurations: SearchConfiguration[];
  settings: AppSettings;
}

const INITIAL_PROFILE_ID = 'prof_huzefa_01';
const INITIAL_USER_ID = 'usr_huzefa_01';

const INITIAL_DATA: DatabaseSchema = {
  users: [
    {
      id: INITIAL_USER_ID,
      email: 'huzefakhatik8586@gmail.com',
      name: 'Huzefa Khatik',
      role: 'CANDIDATE',
      createdAt: '2026-01-01T00:00:00.000Z'
    }
  ],
  candidateProfiles: [
    {
      id: INITIAL_PROFILE_ID,
      userId: INITIAL_USER_ID,
      fullName: 'Huzefa Khatik',
      email: 'huzefakhatik8586@gmail.com',
      phone: '+91 98234 56789',
      currentTitle: 'Full Stack .NET & Angular Developer',
      experienceYears: 2,
      currentCtcLpa: 2.0,
      expectedCtcLpa: 5.0,
      noticePeriodDays: 30,
      preferredCountry: 'India',
      bio: 'Enthusiastic Full Stack Engineer with 2 years of hands-on experience designing and delivering scalable web applications using Angular, TypeScript, C#, ASP.NET Core Web API, and Microsoft SQL Server.',
      summary: 'Specialized in building modern single-page applications with Angular and high-throughput REST APIs with .NET Core. Looking for growth opportunities across Maharashtra (Pune, Mumbai, Nashik, Jalgaon) or high-impact Remote roles.',
      updatedAt: new Date().toISOString()
    }
  ],
  candidateSkills: [
    { id: 'csk_1', profileId: INITIAL_PROFILE_ID, skillName: 'Angular', category: 'Frontend', proficiencyLevel: 'Advanced', yearsOfExperience: 2, isPrimary: true },
    { id: 'csk_2', profileId: INITIAL_PROFILE_ID, skillName: 'TypeScript', category: 'Frontend', proficiencyLevel: 'Advanced', yearsOfExperience: 2, isPrimary: true },
    { id: 'csk_3', profileId: INITIAL_PROFILE_ID, skillName: 'JavaScript', category: 'Frontend', proficiencyLevel: 'Advanced', yearsOfExperience: 2, isPrimary: true },
    { id: 'csk_4', profileId: INITIAL_PROFILE_ID, skillName: 'C#', category: 'Backend', proficiencyLevel: 'Advanced', yearsOfExperience: 2, isPrimary: true },
    { id: 'csk_5', profileId: INITIAL_PROFILE_ID, skillName: '.NET Web API', category: 'Backend', proficiencyLevel: 'Advanced', yearsOfExperience: 2, isPrimary: true },
    { id: 'csk_6', profileId: INITIAL_PROFILE_ID, skillName: 'SQL Server', category: 'Database', proficiencyLevel: 'Intermediate', yearsOfExperience: 2, isPrimary: true },
    { id: 'csk_7', profileId: INITIAL_PROFILE_ID, skillName: 'Entity Framework Core', category: 'Backend', proficiencyLevel: 'Intermediate', yearsOfExperience: 1.5, isPrimary: false },
    { id: 'csk_8', profileId: INITIAL_PROFILE_ID, skillName: 'HTML5/CSS3', category: 'Frontend', proficiencyLevel: 'Advanced', yearsOfExperience: 2, isPrimary: false },
    { id: 'csk_9', profileId: INITIAL_PROFILE_ID, skillName: 'Git & GitHub', category: 'Tools & Other', proficiencyLevel: 'Intermediate', yearsOfExperience: 2, isPrimary: false },
    { id: 'csk_10', profileId: INITIAL_PROFILE_ID, skillName: 'RESTful Architecture', category: 'Backend', proficiencyLevel: 'Advanced', yearsOfExperience: 2, isPrimary: false }
  ],
  jobPreferences: [
    {
      id: 'pref_1',
      profileId: INITIAL_PROFILE_ID,
      targetRoles: ['Angular Developer', '.NET Developer', 'Full Stack Developer', 'Software Engineer', '.NET Core Developer'],
      preferredLocations: ['Jalgaon', 'Pune', 'Mumbai', 'Nashik', 'Remote'],
      openToRemote: true,
      minSalaryLpa: 3.5,
      maxSalaryLpa: 7.0,
      jobTypes: ['Full-Time', 'Remote', 'Hybrid'],
      industryPreferences: ['Information Technology', 'FinTech', 'Enterprise SaaS', 'Software Product']
    }
  ],
  resumes: [
    {
      id: 'res_primary_01',
      profileId: INITIAL_PROFILE_ID,
      fileName: 'Huzefa_Khatik_Resume_DotNet_Angular.pdf',
      fileSize: 142800,
      fileType: 'application/pdf',
      rawText: `HUZEFA KHATIK
Email: huzefakhatik8586@gmail.com | Phone: +91 98234 56789 | Location: Jalgaon / Pune, India
LinkedIn: linkedin.com/in/huzefa-khatik | Portfolio: github.com/huzefa-khatik

PROFESSIONAL SUMMARY
Full Stack Software Developer with 2.0 years of experience in architecting and delivering responsive, testable web applications. Adept in Angular (v14-v18), TypeScript, C#, ASP.NET Core Web API, Entity Framework, and SQL Server. Proven track record of boosting API throughput by 35% and building modular component libraries.

CORE COMPETENCIES & TECHNICAL SKILLS
• Frontend: Angular 14+, TypeScript, RxJS, HTML5, CSS3, Bootstrap, Tailwind CSS, JavaScript (ES6+)
• Backend: C#, .NET 6/8, ASP.NET Core Web API, LINQ, Entity Framework Core, Microservices patterns
• Database: Microsoft SQL Server, Stored Procedures, Indexing, T-SQL, Query Optimization
• Version Control & Tools: Git, GitHub, Postman, Visual Studio 2022, VS Code, Swagger, IIS
• Concepts: REST APIs, JWT Authentication, Clean Architecture, Dependency Injection, Agile/Scrum

WORK EXPERIENCE
Full Stack Developer | TechSolutions Pvt Ltd (Pune, India)
June 2024 - Present (2 Years Total)
• Designed and maintained 15+ Angular components with reactive forms and custom state services.
• Built secure, RESTful ASP.NET Core micro-APIs integrating SQL Server databases for banking clients.
• Refactored legacy SQL queries, reducing API latency from 450ms to 120ms.
• Collaborated in bi-weekly sprints, participating in code reviews, automated CI/CD deployments, and unit tests.

EDUCATION
Bachelor of Engineering (B.E.) in Computer Engineering
North Maharashtra University, Jalgaon | Graduated: 2024`,
      isPrimary: true,
      parsedAt: '2026-02-15T10:30:00.000Z',
      createdAt: '2026-02-15T10:30:00.000Z',
      extractedData: {
        candidateName: 'Huzefa Khatik',
        email: 'huzefakhatik8586@gmail.com',
        phone: '+91 98234 56789',
        totalExperienceYears: 2,
        skillsFound: ['Angular', 'TypeScript', 'JavaScript', 'C#', '.NET Web API', 'SQL Server', 'Entity Framework Core', 'HTML5/CSS3', 'Git', 'RESTful Architecture', 'RxJS', 'LINQ'],
        primaryRoles: ['Angular Developer', '.NET Developer', 'Full Stack Developer'],
        experienceItems: [
          {
            role: 'Full Stack Developer',
            company: 'TechSolutions Pvt Ltd (Pune, India)',
            duration: '2024 - Present (2 Years)',
            highlights: [
              'Designed and maintained 15+ Angular components with reactive forms',
              'Built secure RESTful ASP.NET Core micro-APIs with SQL Server',
              'Refactored legacy SQL queries, reducing latency by 70%'
            ]
          }
        ],
        education: [
          {
            degree: 'Bachelor of Engineering in Computer Engineering',
            institution: 'North Maharashtra University, Jalgaon',
            year: '2024'
          }
        ]
      }
    }
  ],
  jobSources: [
    {
      id: 'src_adzuna',
      name: 'Adzuna India API',
      type: 'api',
      status: 'active',
      apiKeyConfigured: true,
      description: 'Live job feed covering tech roles across Pune, Mumbai, Bangalore, and Remote India with salary indices.',
      lastSyncAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      jobsFoundCount: 42
    },
    {
      id: 'src_jooble',
      name: 'Jooble Job Aggregator',
      type: 'api',
      status: 'active',
      apiKeyConfigured: true,
      description: 'Aggregates listings from corporate career portals across Maharashtra, Nashik, Jalgaon, and remote hubs.',
      lastSyncAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      jobsFoundCount: 28
    },
    {
      id: 'src_direct_board',
      name: 'Direct Indian Tech Careers Feed',
      type: 'verified_board',
      status: 'active',
      apiKeyConfigured: true,
      description: 'Verified direct listings from top tier product and IT services companies hiring .NET and Angular talent.',
      lastSyncAt: new Date(Date.now() - 3600000).toISOString(),
      jobsFoundCount: 35
    }
  ],
  jobs: [
    {
      id: 'job_001',
      sourceId: 'src_direct_board',
      externalId: 'ext_pers_01',
      title: 'Angular & .NET Full Stack Engineer',
      company: 'Persistent Systems',
      location: 'Pune (Hinjawadi)',
      isRemote: false,
      minExpYears: 1.5,
      maxExpYears: 3.5,
      minSalaryLpa: 4.5,
      maxSalaryLpa: 6.5,
      salaryCurrency: 'INR',
      jobType: 'Full-Time',
      description: 'Persistent Systems is seeking an energetic Full Stack Developer with hands-on expertise in Angular 15+, TypeScript, C#, and ASP.NET Core Web API. You will work on an enterprise cloud banking platform, building modern SPAs and scalable microservices backed by SQL Server.',
      requirementsSummary: [
        '1.5 - 3.5 years of hands-on experience in Angular and C# .NET Core',
        'Strong knowledge of TypeScript, RxJS, and component architecture',
        'Demonstrated experience with SQL Server database design and stored procedures',
        'Familiarity with Git and Agile sprint workflows'
      ],
      skillsRequired: ['Angular', 'TypeScript', 'C#', '.NET Web API', 'SQL Server', 'Entity Framework Core'],
      applyUrl: 'https://careers.persistent.com/job/angular-dotnet-pune-ext01',
      sourceName: 'Direct Indian Tech Careers Feed',
      postedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      lastSeenAt: new Date().toISOString(),
      isLive: true,
      isActive: true
    },
    {
      id: 'job_002',
      sourceId: 'src_adzuna',
      externalId: 'adz_0921',
      title: 'Angular Developer (v14 - v18)',
      company: 'PubMatic',
      location: 'Pune',
      isRemote: false,
      minExpYears: 2,
      maxExpYears: 4,
      minSalaryLpa: 5.0,
      maxSalaryLpa: 7.5,
      salaryCurrency: 'INR',
      jobType: 'Full-Time',
      description: 'PubMatic is looking for an experienced Angular Developer to create fast, data-heavy dashboards for our ad-tech platform. You will implement modular frontend UI components, manage RxJS streams, and consume secure RESTful endpoints.',
      requirementsSummary: [
        '2+ years in Angular, TypeScript, and modern CSS/SCSS',
        'Experience building reusable components and managing state',
        'Knowledge of REST APIs and web performance optimization'
      ],
      skillsRequired: ['Angular', 'TypeScript', 'JavaScript', 'HTML5/CSS3', 'RESTful Architecture'],
      applyUrl: 'https://pubmatic.com/careers/angular-dev-pune',
      sourceName: 'Adzuna India API',
      postedAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 25).toISOString(),
      lastSeenAt: new Date().toISOString(),
      isLive: true,
      isActive: true
    },
    {
      id: 'job_003',
      sourceId: 'src_jooble',
      externalId: 'jbl_4412',
      title: '.NET Core Backend API Developer',
      company: 'Accion Labs India',
      location: 'Mumbai (Airoli) / Hybrid',
      isRemote: true,
      minExpYears: 2,
      maxExpYears: 4,
      minSalaryLpa: 5.0,
      maxSalaryLpa: 7.0,
      salaryCurrency: 'INR',
      jobType: 'Hybrid',
      description: 'Accion Labs has an immediate opening for a .NET Backend Developer. The candidate will design and build high-performance Web APIs using C#, ASP.NET Core, and Microsoft SQL Server, with automated unit testing.',
      requirementsSummary: [
        '2 to 4 years of experience with C#, ASP.NET Core Web API',
        'Expertise in SQL Server, relational schema design, and LINQ',
        'Knowledge of clean code principles, repository patterns, and Git'
      ],
      skillsRequired: ['C#', '.NET Web API', 'SQL Server', 'Entity Framework Core', 'RESTful Architecture'],
      applyUrl: 'https://accionlabs.com/careers/dotnet-core-api-mumbai',
      sourceName: 'Jooble Job Aggregator',
      postedAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20).toISOString(),
      lastSeenAt: new Date().toISOString(),
      isLive: true,
      isActive: true
    },
    {
      id: 'job_004',
      sourceId: 'src_direct_board',
      externalId: 'ext_cog_88',
      title: 'Full Stack .NET & Angular Software Engineer',
      company: 'Cognizant Technology Solutions',
      location: 'Pune / Remote',
      isRemote: true,
      minExpYears: 2,
      maxExpYears: 5,
      minSalaryLpa: 5.5,
      maxSalaryLpa: 8.0,
      salaryCurrency: 'INR',
      jobType: 'Remote',
      description: 'Cognizant is hiring a Full Stack Engineer to support our North American insurance portal. You will be responsible for creating customer-facing Angular interfaces and secure .NET Web API backends backed by enterprise SQL Server.',
      requirementsSummary: [
        'Solid background in Angular, TypeScript, C#, and .NET Core',
        'Proven ability to build and test end-to-end full stack web modules',
        'Good communication skills for distributed remote team collaboration'
      ],
      skillsRequired: ['Angular', 'TypeScript', 'C#', '.NET Web API', 'SQL Server', 'Git & GitHub'],
      applyUrl: 'https://careers.cognizant.com/job/fullstack-dotnet-angular-remote',
      sourceName: 'Direct Indian Tech Careers Feed',
      postedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 40).toISOString(),
      lastSeenAt: new Date().toISOString(),
      isLive: true,
      isActive: true
    },
    {
      id: 'job_005',
      sourceId: 'src_jooble',
      externalId: 'jbl_nashik_01',
      title: 'Junior to Mid Full Stack Developer (.NET & Angular)',
      company: 'Winjit Technologies',
      location: 'Nashik',
      isRemote: false,
      minExpYears: 1.5,
      maxExpYears: 3,
      minSalaryLpa: 3.8,
      maxSalaryLpa: 5.5,
      salaryCurrency: 'INR',
      jobType: 'Full-Time',
      description: 'Winjit Technologies in Nashik is expanding its digital transformation squad. We need an Angular and C# developer to build enterprise IoT dashboards and business workflow applications.',
      requirementsSummary: [
        '1.5 - 3 years of development with Angular and C# .NET',
        'Local candidate in Nashik or willing to relocate to Nashik',
        'Proficiency in SQL Server stored procedures and API integration'
      ],
      skillsRequired: ['Angular', 'TypeScript', 'C#', '.NET Web API', 'SQL Server'],
      applyUrl: 'https://winjit.com/careers/full-stack-nashik',
      sourceName: 'Jooble Job Aggregator',
      postedAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 28).toISOString(),
      lastSeenAt: new Date().toISOString(),
      isLive: true,
      isActive: true
    },
    {
      id: 'job_006',
      sourceId: 'src_direct_board',
      externalId: 'ext_jalg_it',
      title: 'Software Developer - Web Applications',
      company: 'Jain Software & Tech Hub',
      location: 'Jalgaon',
      isRemote: false,
      minExpYears: 1,
      maxExpYears: 3,
      minSalaryLpa: 3.2,
      maxSalaryLpa: 4.8,
      salaryCurrency: 'INR',
      jobType: 'Full-Time',
      description: 'Looking for a skilled web developer proficient in JavaScript/TypeScript frameworks (Angular preferred) and backend C#/.NET to maintain ERP modules and client portals in Jalgaon.',
      requirementsSummary: [
        'Experience building web applications with Angular and C#',
        'Understanding of relational databases and SQL queries',
        'Based in Jalgaon or nearby region in North Maharashtra'
      ],
      skillsRequired: ['Angular', 'JavaScript', 'C#', 'SQL Server', 'HTML5/CSS3'],
      applyUrl: 'https://jainsoftware.in/careers/jalgaon-web-dev',
      sourceName: 'Direct Indian Tech Careers Feed',
      postedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).toISOString(),
      lastSeenAt: new Date().toISOString(),
      isLive: true,
      isActive: true
    },
    {
      id: 'job_007',
      sourceId: 'src_adzuna',
      externalId: 'adz_wipro_09',
      title: 'C# .NET Backend Microservices Engineer',
      company: 'Wipro Limited',
      location: 'Pune (Hinjawadi)',
      isRemote: true,
      minExpYears: 2,
      maxExpYears: 4,
      minSalaryLpa: 5.2,
      maxSalaryLpa: 7.2,
      salaryCurrency: 'INR',
      jobType: 'Hybrid',
      description: 'Wipro is looking for a C# .NET Backend Engineer to join our banking horizontal. You will write clean, well-architected Web APIs, optimize SQL queries on SQL Server, and implement token-based security.',
      requirementsSummary: [
        '2+ years in C# .NET Core and Web API development',
        'Strong SQL Server querying, indexing, and optimization skills',
        'Experience with Docker or Azure DevOps is an added advantage'
      ],
      skillsRequired: ['C#', '.NET Web API', 'SQL Server', 'RESTful Architecture', 'Git & GitHub'],
      applyUrl: 'https://careers.wipro.com/job/dotnet-engineer-pune',
      sourceName: 'Adzuna India API',
      postedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 35).toISOString(),
      lastSeenAt: new Date().toISOString(),
      isLive: true,
      isActive: true
    },
    {
      id: 'job_008',
      sourceId: 'src_direct_board',
      externalId: 'ext_lti_31',
      title: 'Angular UI Engineer',
      company: 'LTIMindtree',
      location: 'Mumbai (Powai)',
      isRemote: false,
      minExpYears: 2,
      maxExpYears: 4,
      minSalaryLpa: 5.2,
      maxSalaryLpa: 7.8,
      salaryCurrency: 'INR',
      jobType: 'Full-Time',
      description: 'LTIMindtree requires a talented Angular developer to craft modern interfaces for a global retail client. You will construct modular Angular components, integrate complex REST services, and optimize client-side bundle size.',
      requirementsSummary: [
        'Strong experience in Angular (v14+) and TypeScript',
        'Proficiency in CSS, responsive design, and state management',
        'Knowledge of unit testing using Jasmine/Karma'
      ],
      skillsRequired: ['Angular', 'TypeScript', 'JavaScript', 'HTML5/CSS3', 'RESTful Architecture'],
      applyUrl: 'https://careers.ltimindtree.com/job/angular-ui-mumbai',
      sourceName: 'Direct Indian Tech Careers Feed',
      postedAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 22).toISOString(),
      lastSeenAt: new Date().toISOString(),
      isLive: true,
      isActive: true
    }
  ],
  jobSkills: [
    { id: 'jsk_1', jobId: 'job_001', skillName: 'Angular', isRequired: true, importanceWeight: 1.0 },
    { id: 'jsk_2', jobId: 'job_001', skillName: 'C#', isRequired: true, importanceWeight: 1.0 },
    { id: 'jsk_3', jobId: 'job_001', skillName: '.NET Web API', isRequired: true, importanceWeight: 1.0 },
    { id: 'jsk_4', jobId: 'job_001', skillName: 'SQL Server', isRequired: true, importanceWeight: 0.9 },
    { id: 'jsk_5', jobId: 'job_001', skillName: 'TypeScript', isRequired: true, importanceWeight: 0.9 }
  ],
  jobMatches: [],
  matchDetails: [],
  savedJobs: [
    {
      id: 'save_01',
      jobId: 'job_001',
      profileId: INITIAL_PROFILE_ID,
      savedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      notes: 'Strong match for my .NET and Angular background at Persistent Hinjawadi.',
      priorityTag: 'HIGH'
    },
    {
      id: 'save_02',
      jobId: 'job_004',
      profileId: INITIAL_PROFILE_ID,
      savedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      notes: 'Remote option available! Salary up to ₹8 LPA.',
      priorityTag: 'HIGH'
    }
  ],
  jobApplications: [
    {
      id: 'app_01',
      jobId: 'job_001',
      profileId: INITIAL_PROFILE_ID,
      status: 'APPLIED',
      appliedDate: '2026-03-01T10:00:00.000Z',
      resumeVersionId: 'res_primary_01',
      followUpDate: '2026-03-08T10:00:00.000Z',
      notes: 'Submitted application on Persistent portal. Received automated confirmation email.',
      interviewRoundsCount: 0,
      contactPerson: 'HR Campus & Lateral Pune',
      history: [
        { status: 'SAVED', timestamp: '2026-02-28T14:00:00.000Z', note: 'Bookmarked job from morning scan' },
        { status: 'APPLIED', timestamp: '2026-03-01T10:00:00.000Z', note: 'Applied via official portal' }
      ]
    },
    {
      id: 'app_02',
      jobId: 'job_003',
      profileId: INITIAL_PROFILE_ID,
      status: 'INTERVIEWING',
      appliedDate: '2026-02-24T12:00:00.000Z',
      resumeVersionId: 'res_primary_01',
      followUpDate: '2026-03-06T15:00:00.000Z',
      notes: 'Cleared initial screening with recruiter. Technical round scheduled on C# Web API and SQL query optimization.',
      interviewRoundsCount: 1,
      contactPerson: 'Priya Sharma (Tech Recruiter)',
      history: [
        { status: 'APPLIED', timestamp: '2026-02-24T12:00:00.000Z', note: 'Applied on Accion portal' },
        { status: 'INTERVIEWING', timestamp: '2026-03-02T11:00:00.000Z', note: 'Invited for Technical Round 1' }
      ]
    }
  ],
  searchHistory: [
    {
      id: 'sh_01',
      profileId: INITIAL_PROFILE_ID,
      query: 'Angular .NET Developer',
      location: 'Pune',
      filtersJson: { minSalary: 4, experience: 2 },
      resultsCount: 18,
      executedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      triggeredBy: 'SCHEDULED_MORNING'
    },
    {
      id: 'sh_02',
      profileId: INITIAL_PROFILE_ID,
      query: 'Full Stack Developer',
      location: 'Remote',
      filtersJson: { openToRemote: true },
      resultsCount: 14,
      executedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      triggeredBy: 'MANUAL'
    }
  ],
  aiAnalysisLogs: [
    {
      id: 'ail_01',
      profileId: INITIAL_PROFILE_ID,
      jobId: 'job_001',
      provider: 'gemini',
      promptType: 'MATCH_ANALYSIS',
      tokensUsed: 420,
      status: 'SUCCESS',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      responseSnippet: 'Strong 94% compatibility detected. 100% skill alignment with Angular, TypeScript, C#, .NET Web API, and SQL Server.'
    }
  ],
  notificationLogs: [
    {
      id: 'notif_01',
      profileId: INITIAL_PROFILE_ID,
      channel: 'EMAIL',
      recipient: 'huzefakhatik8586@gmail.com',
      subject: '🎯 2 New Excellent Matches (85%+) for your Profile today',
      previewText: 'Persistent Systems and Cognizant are hiring Full Stack .NET & Angular Developers in Pune and Remote with CTC up to ₹8 LPA.',
      sentAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      status: 'DELIVERED',
      matchedJobsCount: 2,
      jobTitles: ['Angular & .NET Full Stack Engineer', 'Full Stack .NET & Angular Software Engineer']
    }
  ],
  searchConfigurations: [
    {
      id: 'sc_01',
      profileId: INITIAL_PROFILE_ID,
      morningCronTime: '08:00',
      eveningCronTime: '18:00',
      isAutoSearchEnabled: true,
      minMatchScoreToNotify: 75,
      emailNotificationsEnabled: true,
      notificationEmail: 'huzefakhatik8586@gmail.com',
      weightsConfig: {
        skills: 40,
        experience: 20,
        title: 15,
        location: 10,
        salary: 10,
        freshness: 5
      }
    }
  ],
  settings: {
    aiProvider: 'gemini',
    geminiModel: 'gemini-3.8-flash',
    openAiModel: 'gpt-4o-mini',
    adzunaAppId: 'adz_in_demo',
    adzunaAppKey: 'adz_in_key_sec',
    joobleApiKey: 'jbl_in_key_sec',
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    hasOpenAiKey: !!process.env.OPENAI_API_KEY
  }
};

class Database {
  private data: DatabaseSchema;
  private initialized = false;

  constructor() {
    this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        this.data = {
          ...INITIAL_DATA,
          ...parsed,
          // ensure arrays are always present
          users: parsed.users || INITIAL_DATA.users,
          candidateProfiles: parsed.candidateProfiles || INITIAL_DATA.candidateProfiles,
          candidateSkills: parsed.candidateSkills || INITIAL_DATA.candidateSkills,
          jobPreferences: parsed.jobPreferences || INITIAL_DATA.jobPreferences,
          resumes: parsed.resumes || INITIAL_DATA.resumes,
          jobSources: parsed.jobSources || INITIAL_DATA.jobSources,
          jobs: parsed.jobs || INITIAL_DATA.jobs,
          jobSkills: parsed.jobSkills || INITIAL_DATA.jobSkills,
          jobMatches: parsed.jobMatches || [],
          matchDetails: parsed.matchDetails || [],
          savedJobs: parsed.savedJobs || INITIAL_DATA.savedJobs,
          jobApplications: parsed.jobApplications || INITIAL_DATA.jobApplications,
          searchHistory: parsed.searchHistory || INITIAL_DATA.searchHistory,
          aiAnalysisLogs: parsed.aiAnalysisLogs || INITIAL_DATA.aiAnalysisLogs,
          notificationLogs: parsed.notificationLogs || INITIAL_DATA.notificationLogs,
          searchConfigurations: parsed.searchConfigurations || INITIAL_DATA.searchConfigurations,
          settings: {
            ...INITIAL_DATA.settings,
            ...(parsed.settings || {}),
            hasGeminiKey: !!process.env.GEMINI_API_KEY,
            hasOpenAiKey: !!process.env.OPENAI_API_KEY
          }
        };
      } else {
        this.save();
      }
      this.initialized = true;
    } catch (err) {
      console.error('Error initializing database, using in-memory fallback:', err);
      this.initialized = true;
    }
  }

  public save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  public getData(): DatabaseSchema {
    return this.data;
  }

  // Profile operations
  public getPrimaryProfile(): CandidateProfile {
    return this.data.candidateProfiles[0];
  }

  public updateProfile(updates: Partial<CandidateProfile>): CandidateProfile {
    const profile = this.data.candidateProfiles[0];
    Object.assign(profile, updates, { updatedAt: new Date().toISOString() });
    this.save();
    return profile;
  }

  // Skills operations
  public getSkills(profileId: string = INITIAL_PROFILE_ID): CandidateSkill[] {
    return this.data.candidateSkills.filter(s => s.profileId === profileId);
  }

  public addSkill(skill: Omit<CandidateSkill, 'id'>): CandidateSkill {
    const newSkill: CandidateSkill = {
      ...skill,
      id: `csk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    };
    this.data.candidateSkills.push(newSkill);
    this.save();
    return newSkill;
  }

  public deleteSkill(skillId: string): boolean {
    const initialLen = this.data.candidateSkills.length;
    this.data.candidateSkills = this.data.candidateSkills.filter(s => s.id !== skillId);
    if (this.data.candidateSkills.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Preferences
  public getPreferences(profileId: string = INITIAL_PROFILE_ID): JobPreferences {
    return this.data.jobPreferences.find(p => p.profileId === profileId) || this.data.jobPreferences[0];
  }

  public updatePreferences(updates: Partial<JobPreferences>): JobPreferences {
    const prefs = this.getPreferences();
    Object.assign(prefs, updates);
    this.save();
    return prefs;
  }

  // Resumes
  public getResumes(profileId: string = INITIAL_PROFILE_ID): ResumeDocument[] {
    return this.data.resumes.filter(r => r.profileId === profileId);
  }

  public addResume(resume: Omit<ResumeDocument, 'id' | 'createdAt'>): ResumeDocument {
    // If set to primary, clear existing primary
    if (resume.isPrimary) {
      this.data.resumes.forEach(r => { r.isPrimary = false; });
    }
    const newDoc: ResumeDocument = {
      ...resume,
      id: `res_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.data.resumes.unshift(newDoc);
    this.save();
    return newDoc;
  }

  public updateResume(resumeId: string, updates: Partial<ResumeDocument>): ResumeDocument | null {
    const res = this.data.resumes.find(r => r.id === resumeId);
    if (!res) return null;
    Object.assign(res, updates);
    this.save();
    return res;
  }

  // Jobs
  public getJobs(): Job[] {
    return this.data.jobs;
  }

  public getJobById(jobId: string): Job | undefined {
    return this.data.jobs.find(j => j.id === jobId);
  }

  public addJobs(newJobs: Job[]): { added: number; existing: number } {
    let added = 0;
    let existing = 0;

    for (const job of newJobs) {
      const exists = this.data.jobs.some(
        j => j.externalId === job.externalId ||
        (j.title.toLowerCase() === job.title.toLowerCase() && j.company.toLowerCase() === job.company.toLowerCase())
      );
      if (!exists) {
        this.data.jobs.unshift(job);
        added++;
      } else {
        existing++;
      }
    }
    if (added > 0) {
      this.save();
    }
    return { added, existing };
  }

  // Matches
  public getJobMatches(): JobMatch[] {
    return this.data.jobMatches;
  }

  public saveJobMatch(match: JobMatch) {
    const idx = this.data.jobMatches.findIndex(m => m.jobId === match.jobId && m.profileId === match.profileId);
    if (idx >= 0) {
      this.data.jobMatches[idx] = match;
    } else {
      this.data.jobMatches.push(match);
    }
    this.save();
  }

  // Saved Jobs
  public getSavedJobs(profileId: string = INITIAL_PROFILE_ID): SavedJob[] {
    return this.data.savedJobs.filter(s => s.profileId === profileId);
  }

  public toggleSaveJob(jobId: string, profileId: string = INITIAL_PROFILE_ID, notes: string = ''): { saved: boolean } {
    const idx = this.data.savedJobs.findIndex(s => s.jobId === jobId && s.profileId === profileId);
    if (idx >= 0) {
      this.data.savedJobs.splice(idx, 1);
      this.save();
      return { saved: false };
    } else {
      this.data.savedJobs.push({
        id: `save_${Date.now()}`,
        jobId,
        profileId,
        savedAt: new Date().toISOString(),
        notes,
        priorityTag: 'HIGH'
      });
      this.save();
      return { saved: true };
    }
  }

  // Applications
  public getApplications(profileId: string = INITIAL_PROFILE_ID): JobApplication[] {
    return this.data.jobApplications.filter(a => a.profileId === profileId);
  }

  public updateApplication(appData: Partial<JobApplication> & { jobId: string }): JobApplication {
    const profileId = INITIAL_PROFILE_ID;
    let app = this.data.jobApplications.find(a => a.jobId === appData.jobId && a.profileId === profileId);
    const now = new Date().toISOString();

    if (!app) {
      app = {
        id: `app_${Date.now()}`,
        jobId: appData.jobId,
        profileId,
        status: appData.status || 'APPLIED',
        appliedDate: appData.appliedDate || now,
        resumeVersionId: appData.resumeVersionId || 'res_primary_01',
        followUpDate: appData.followUpDate || null,
        notes: appData.notes || 'Application tracked via AI Job Finder',
        interviewRoundsCount: appData.interviewRoundsCount || 0,
        contactPerson: appData.contactPerson || '',
        salaryOfferedLpa: appData.salaryOfferedLpa,
        history: [{
          status: appData.status || 'APPLIED',
          timestamp: now,
          note: 'Application record created'
        }]
      };
      this.data.jobApplications.push(app);
    } else {
      const prevStatus = app.status;
      Object.assign(app, appData);
      if (appData.status && appData.status !== prevStatus) {
        app.history.push({
          status: appData.status,
          timestamp: now,
          note: appData.notes || `Status changed from ${prevStatus} to ${appData.status}`
        });
      }
    }
    this.save();
    return app;
  }

  // Search History
  public addSearchHistory(item: Omit<SearchHistoryItem, 'id'>): SearchHistoryItem {
    const newItem: SearchHistoryItem = {
      ...item,
      id: `sh_${Date.now()}`
    };
    this.data.searchHistory.unshift(newItem);
    if (this.data.searchHistory.length > 50) {
      this.data.searchHistory = this.data.searchHistory.slice(0, 50);
    }
    this.save();
    return newItem;
  }

  // Logs
  public addAiLog(log: Omit<AIAnalysisLog, 'id' | 'createdAt'>): AIAnalysisLog {
    const newLog: AIAnalysisLog = {
      ...log,
      id: `ail_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.data.aiAnalysisLogs.unshift(newLog);
    this.save();
    return newLog;
  }

  public addNotificationLog(log: Omit<NotificationLog, 'id' | 'sentAt'>): NotificationLog {
    const newLog: NotificationLog = {
      ...log,
      id: `notif_${Date.now()}`,
      sentAt: new Date().toISOString()
    };
    this.data.notificationLogs.unshift(newLog);
    this.save();
    return newLog;
  }

  // Settings & Configuration
  public getSearchConfig(): SearchConfiguration {
    return this.data.searchConfigurations[0];
  }

  public updateSearchConfig(updates: Partial<SearchConfiguration>): SearchConfiguration {
    Object.assign(this.data.searchConfigurations[0], updates);
    this.save();
    return this.data.searchConfigurations[0];
  }

  public getSettings(): AppSettings {
    this.data.settings.hasGeminiKey = !!process.env.GEMINI_API_KEY;
    this.data.settings.hasOpenAiKey = !!process.env.OPENAI_API_KEY;
    return this.data.settings;
  }

  public updateSettings(updates: Partial<AppSettings>): AppSettings {
    Object.assign(this.data.settings, updates);
    this.save();
    return this.getSettings();
  }
}

export const db = new Database();
