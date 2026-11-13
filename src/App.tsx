import React, { useState, useEffect } from 'react';
import { Sidebar, type ActiveTab } from './components/Sidebar.tsx';
import { Header } from './components/Header.tsx';
import { DashboardView } from './views/DashboardView.tsx';
import { JobsView } from './views/JobsView.tsx';
import { ProfileView } from './views/ProfileView.tsx';
import { ResumeView } from './views/ResumeView.tsx';
import { ApplicationsView } from './views/ApplicationsView.tsx';
import { CompareView } from './views/CompareView.tsx';
import { CoachView } from './views/CoachView.tsx';
import { AssistantView } from './views/AssistantView.tsx';
import { AutomationView } from './views/AutomationView.tsx';
import { SettingsView } from './views/SettingsView.tsx';
import { MatchBreakdownModal } from './components/MatchBreakdownModal.tsx';
import { InterviewPrepModal } from './components/InterviewPrepModal.tsx';
import { NotificationPreviewModal } from './components/NotificationPreviewModal.tsx';
import { api } from './services/api.ts';
import type { DashboardMetrics, Job, NotificationLog } from './types/index.ts';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState<boolean>(true);
  const [isRunningSync, setIsRunningSync] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  // Modals state
  const [breakdownJob, setBreakdownJob] = useState<Job | null>(null);
  const [interviewJob, setInterviewJob] = useState<Job | null>(null);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState<boolean>(false);
  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>([]);

  // Compare IDs
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>(['job_001', 'job_004']);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await api.getDashboard();
      setMetrics(data);
      const logs = await api.getAutomationLogs();
      setNotificationLogs(logs.notificationLogs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMetrics(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Global "Run Search Now" trigger
  const handleRunSearchNow = async () => {
    setIsRunningSync(true);
    showToast('Executing 9-step automated discovery and matching pipeline...');
    try {
      const res = await api.runAutomationSync();
      await loadDashboardData();
      showToast(`Search completed! Found ${res.report?.newJobsFound || 2} new jobs & updated compatibility scores.`);
    } catch (err: any) {
      showToast(`Search error: ${err.message}`);
    } finally {
      setIsRunningSync(false);
    }
  };

  // Toggle Save Job
  const handleToggleSaveJob = async (jobId: string) => {
    try {
      const res = await api.toggleSaveJob(jobId);
      showToast(res.saved ? 'Job bookmarked to Saved Jobs!' : 'Removed from Saved Jobs.');
      loadDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  // Compare Toggle
  const handleToggleCompareJob = (jobId: string) => {
    if (selectedCompareIds.includes(jobId)) {
      setSelectedCompareIds(selectedCompareIds.filter(id => id !== jobId));
    } else {
      if (selectedCompareIds.length >= 3) {
        showToast('You can compare a maximum of 3 jobs at once.');
        return;
      }
      setSelectedCompareIds([...selectedCompareIds, jobId]);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0b0f19] text-slate-100' : 'bg-slate-50 text-slate-900'} font-sans flex antialiased selection:bg-purple-600 selection:text-white`}>
      {/* Toast banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[#1e293b] border border-purple-500/50 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-bounce-short">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Collapsible Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={isSidebarCollapsed}
        setCollapsed={setIsSidebarCollapsed}
        savedCount={metrics?.savedJobs || 0}
        applicationsCount={metrics?.applicationsSubmitted || 0}
        matchesCount={metrics?.excellentMatches || 2}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isSidebarCollapsed ? 'pl-20' : 'pl-64'
        }`}
      >
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          onRunSearchNow={handleRunSearchNow}
          isRunningSync={isRunningSync}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          unreadNotifsCount={notificationLogs.length}
          onOpenNotifications={() => setIsNotificationModalOpen(true)}
        />

        {/* View Canvas */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardView
              metrics={metrics}
              loading={loadingMetrics}
              onRunSearchNow={handleRunSearchNow}
              isRunningSync={isRunningSync}
              onNavigateToJobs={() => setActiveTab('jobs')}
              onNavigateToProfile={() => setActiveTab('profile')}
              onNavigateToApplications={() => setActiveTab('applications')}
              onViewJobMatch={(job) => setBreakdownJob(job)}
              onToggleSaveJob={handleToggleSaveJob}
              onPrepareInterview={(job) => setInterviewJob(job)}
            />
          )}

          {activeTab === 'jobs' && (
            <JobsView
              onViewJobMatch={(job) => setBreakdownJob(job)}
              onToggleSaveJob={handleToggleSaveJob}
              onPrepareInterview={(job) => setInterviewJob(job)}
              selectedCompareIds={selectedCompareIds}
              onToggleCompareJob={handleToggleCompareJob}
              onOpenCompareMatrix={() => setActiveTab('compare')}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView
              onProfileUpdated={() => {
                loadDashboardData();
                showToast('Candidate profile updated and match scores recalculated!');
              }}
            />
          )}

          {activeTab === 'resume' && (
            <ResumeView
              onProfileSynced={() => {
                loadDashboardData();
                showToast('Extracted resume profile attributes synchronized!');
              }}
            />
          )}

          {activeTab === 'applications' && (
            <ApplicationsView
              onNavigateToJobs={() => setActiveTab('jobs')}
            />
          )}

          {activeTab === 'compare' && (
            <CompareView
              selectedJobIds={selectedCompareIds}
              onRemoveJobFromCompare={(id) => setSelectedCompareIds(selectedCompareIds.filter(i => i !== id))}
              onPrepareInterview={(job) => setInterviewJob(job)}
              onNavigateToJobs={() => setActiveTab('jobs')}
            />
          )}

          {activeTab === 'coach' && (
            <CoachView
              onPrepareInterviewForJob={(job) => setInterviewJob(job)}
            />
          )}

          {activeTab === 'assistant' && (
            <AssistantView
              onNavigateToJobsWithFilter={(params) => {
                setActiveTab('jobs');
                showToast(`Filtered jobs by ${params.keyword || ''} in ${params.location || 'India'}`);
              }}
              onNavigateToCompare={() => setActiveTab('compare')}
            />
          )}

          {activeTab === 'automation' && (
            <AutomationView
              onOpenEmailPreview={() => setIsNotificationModalOpen(true)}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              onWeightsUpdated={() => {
                loadDashboardData();
                showToast('Weights updated and compatibility scores recalculated!');
              }}
            />
          )}
        </main>
      </div>

      {/* Match Breakdown Deep-Dive Modal */}
      {breakdownJob && (
        <MatchBreakdownModal
          job={breakdownJob}
          score={(breakdownJob as any).matchScore ?? 85}
          breakdown={(breakdownJob as any).matchBreakdown}
          onClose={() => setBreakdownJob(null)}
          onPrepareInterview={(job) => {
            setBreakdownJob(null);
            setInterviewJob(job);
          }}
          onUpdateStatus={(status) => {
            showToast(`Application status updated to ${status}`);
            loadDashboardData();
          }}
        />
      )}

      {/* AI Interview Prep Modal */}
      {interviewJob && (
        <InterviewPrepModal
          job={interviewJob}
          onClose={() => setInterviewJob(null)}
        />
      )}

      {/* Notification / Email Alert Preview Modal */}
      {isNotificationModalOpen && (
        <NotificationPreviewModal
          notifications={notificationLogs}
          onClose={() => setIsNotificationModalOpen(false)}
        />
      )}
    </div>
  );
}
