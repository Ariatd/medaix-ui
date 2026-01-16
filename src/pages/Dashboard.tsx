import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { getAnalyses, getStatistics, deleteAnalysis } from '../utils/userDataManager';
import ConfirmationModal from '../components/ConfirmationModal';
import { useToast } from '../context/ToastContext';
import { formatPercent } from '../utils/confidenceUtils';
import { useIsMobile, useIsTablet } from '../hooks/useDeviceType';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    thisMonth: 0,
    successRate: 0,
    avgConfidence: 0,
  });
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const { addToast } = useToast();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!currentUser?.id) return;

    try {
      const allAnalyses = getAnalyses(currentUser.id);
      setAnalyses(allAnalyses);
      const statistics = getStatistics(currentUser.id);
      setStats(statistics);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }, [currentUser?.id]);

  const recentAnalyses = analyses.slice(0, 5);

  // Determine grid columns based on device
  const paddingClass = isMobile ? 'px-4 py-6' : isTablet ? 'px-6 py-10' : 'px-6 py-12';
  const maxWidthClass = isMobile ? 'max-w-full' : 'max-w-7xl';

  return (
    <DashboardLayout>
      <div className={`min-h-screen bg-[#f7f8fa] dark:bg-[#071029] text-gray-900 dark:text-gray-100 ring-1 ring-black/5 dark:ring-white/6 ${paddingClass}`}>
        <div className={`mx-auto ${maxWidthClass}`}>
          {/* Welcome Header - Responsive */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">
              Welcome back! 👋
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
              Here's what's happening with your analyses today
            </p>
          </div>

          {/* Statistics Cards - Responsive */}
          <div className={`mb-8 sm:mb-12 grid gap-4 sm:gap-6 ${isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
            {/* Total Analyses */}
            <div className="rounded-xl bg-white dark:bg-gray-800/80 p-4 sm:p-6 shadow-sm dark:shadow-lg border border-gray-200 dark:border-gray-700 transition hover:shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-300">Total Analyses</p>
                  <p className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">{stats.totalAnalyses}</p>
                  <p className="mt-1 text-xs text-gray-400">All-time total</p>
                </div>
                <div className="rounded-lg bg-primary-900/30 p-3 sm:p-4 flex-shrink-0">
                  <svg className="h-6 w-6 sm:h-8 sm:w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Success Rate */}
            <div className="rounded-xl bg-white dark:bg-gray-800/80 p-4 sm:p-6 shadow-sm dark:shadow-lg border border-gray-200 dark:border-gray-700 transition hover:shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-300">Success Rate</p>
                  <p className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-success">{stats.successRate}%</p>
                  <div className="mt-3 h-2 rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-success transition-all duration-300"
                      style={{ width: `${stats.successRate}%` }}
                    ></div>
                  </div>
                </div>
                <div className="rounded-lg bg-green-900/30 p-3 sm:p-4 flex-shrink-0">
                  <svg className="h-6 w-6 sm:h-8 sm:w-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* This Month */}
            <div className="rounded-xl bg-white dark:bg-gray-800/80 p-4 sm:p-6 shadow-sm dark:shadow-lg border border-gray-200 dark:border-gray-700 transition hover:shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-300">This Month</p>
                  <p className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600">{stats.thisMonth}</p>
                  <p className="mt-1 text-xs text-gray-500">Analyses performed</p>
                </div>
                <div className="rounded-lg bg-blue-900/30 p-3 sm:p-4 flex-shrink-0">
                  <svg className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Avg Confidence */}
            <div className="rounded-xl bg-white dark:bg-gray-800/80 p-4 sm:p-6 shadow-sm dark:shadow-lg border border-gray-200 dark:border-gray-700 transition hover:shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-300">Avg Confidence</p>
                  <p className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-600">{stats.avgConfidence}%</p>
                  <p className="mt-1 text-xs text-gray-500">Analysis accuracy</p>
                </div>
                <div className="rounded-lg bg-amber-900/30 p-3 sm:p-4 flex-shrink-0">
                  <svg className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Analyses Section */}
          {recentAnalyses.length > 0 ? (
            <div className="mb-8 sm:mb-12 rounded-xl bg-white dark:bg-gray-800/80 p-4 sm:p-6 lg:p-8 shadow-sm dark:shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Recent Analyses</h2>
                <Link
                  to="/history"
                  className="text-sm font-semibold text-primary hover:underline text-center sm:text-left"
                >
                  View All →
                </Link>
              </div>

              {/* Mobile Card View */}
              {isMobile ? (
                <div className="space-y-4">
                  {recentAnalyses.map(analysis => (
                    <div key={analysis.id} className="border border-gray-700 rounded-lg bg-gray-800/60 p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-100 text-sm truncate">{analysis.fileName}</h3>
                          <p className="text-xs text-gray-300">{new Date(analysis.uploadedAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                          analysis.status === 'completed'
                            ? 'bg-success-50 text-success'
                            : analysis.status === 'processing'
                            ? 'bg-warning-50 text-warning'
                            : 'bg-danger-50 text-danger'
                        }`}>
                          {analysis.status.charAt(0).toUpperCase() + analysis.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-block rounded-full bg-blue-900/30 px-2 py-1 text-xs font-semibold text-blue-300">
                          {analysis.imageType || 'Unknown'}
                        </span>
                        <span className="text-xs font-medium text-gray-100">
                          {analysis.results?.overallConfidence !== undefined && analysis.results?.overallConfidence !== null
                            ? formatPercent(analysis.results.overallConfidence)
                            : 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/results/${analysis.id}`}
                          className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-primary-900/30 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white"
                        >
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </Link>
                        <button
                          onClick={() => { setDeleteId(analysis.id); setShowDeleteModal(true); }}
                          title="Delete"
                          className="rounded-lg bg-red-900/30 p-2 text-red-400 transition hover:bg-red-600 hover:text-white"
                        >
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Desktop Table View */
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-200">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-200">Image Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-200">Type</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-200">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-200">Confidence</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-200">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentAnalyses.map(analysis => (
                        <tr key={analysis.id} className="border-b border-gray-700 hover:bg-gray-800/60 transition">
                          <td className="px-4 py-4 text-sm text-gray-300">
                            {new Date(analysis.uploadedAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-100">
                            {analysis.fileName}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-300">
                            <span className="inline-block rounded-full bg-blue-900/30 px-3 py-1 text-xs font-semibold text-blue-300">
                              {analysis.imageType || 'Unknown'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-300">
                            <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                              analysis.status === 'completed'
                                ? 'bg-success-50 text-success'
                                : analysis.status === 'processing'
                                ? 'bg-warning-50 text-warning'
                                : 'bg-danger-50 text-danger'
                            }`}>
                              {analysis.status.charAt(0).toUpperCase() + analysis.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-100">
                            {analysis.results?.overallConfidence !== undefined && analysis.results?.overallConfidence !== null
                              ? formatPercent(analysis.results.overallConfidence)
                              : 'N/A'}
                          </td>
                          <td className="px-4 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Link
                                to={`/results/${analysis.id}`}
                                className="inline-flex items-center gap-2 rounded-lg bg-primary-900/30 px-3 py-1 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                              >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                View
                              </Link>

                              <button
                                onClick={() => { setDeleteId(analysis.id); setShowDeleteModal(true); }}
                                title="Delete"
                                className="rounded-lg bg-red-900/30 p-2 text-red-400 transition hover:bg-red-600 hover:text-white"
                              >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            /* Empty State - Responsive */
            <div className="mb-8 sm:mb-12 rounded-xl bg-white dark:bg-gray-800/80 p-8 shadow-sm dark:shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col items-center justify-center py-8 sm:py-12">
                <svg className="mb-4 h-12 w-12 sm:h-20 sm:w-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-bold text-gray-100 text-center">No Analyses Yet</h3>
                <p className="mt-2 text-center text-gray-300 max-w-sm text-sm sm:text-base">
                  Start your first medical image analysis to see your results here
                </p>
                <Link
                  to="/upload"
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-blue-700 text-sm sm:text-base"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Start Your First Analysis
                </Link>
              </div>
            </div>
          )}

          {/* Quick Actions - Informational Cards Only */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
            {/* Card 1 - System Status */}
            <div className="rounded-xl bg-sky-800 p-4 sm:p-6 text-white shadow-lg">
              <div className="mb-3 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-white bg-opacity-20">
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold">System Status</h3>
              <p className="mt-1 text-xl sm:text-2xl font-semibold">All Systems Operational</p>
              <p className="mt-1 text-xs sm:text-sm text-blue-100">Last checked: Just now</p>
            </div>

            {/* Card 2 - Weekly Activity */}
            <div className="rounded-xl bg-emerald-800 p-4 sm:p-6 text-white shadow-lg">
              <div className="mb-3 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-white bg-opacity-20">
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold">This Week</h3>
              <p className="mt-1 text-xl sm:text-2xl font-semibold">{stats.thisMonth > 0 ? `${stats.thisMonth} Active` : 'Getting Started'}</p>
              <p className="mt-1 text-xs sm:text-sm text-green-100">Your research is on track</p>
            </div>

            {/* Card 3 - Quick Tip */}
            <div className="rounded-xl bg-amber-700 p-4 sm:p-6 text-white shadow-lg">
              <div className="mb-3 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-white bg-opacity-20">
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold">Pro Tip</h3>
              <p className="mt-1 text-xl sm:text-2xl font-semibold">Use high-resolution images</p>
              <p className="mt-1 text-xs sm:text-sm text-orange-100">For better analysis accuracy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Analysis"
        message="Are you sure you want to delete this analysis? This action cannot be undone."
        isDangerous
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleting}
        onCancel={() => { setShowDeleteModal(false); setDeleteId(null); }}
        onConfirm={() => {
          if (!currentUser?.id || !deleteId) return;
          setDeleting(true);
          const ok = deleteAnalysis(currentUser.id, deleteId);
          setDeleting(false);
          setShowDeleteModal(false);
          setDeleteId(null);
          if (ok) {
            const updated = getAnalyses(currentUser.id);
            setAnalyses(updated);
            const statistics = getStatistics(currentUser.id);
            setStats(statistics);
            addToast('Analysis deleted successfully', 'success');
          } else {
            addToast('Failed to delete analysis', 'error');
          }
        }}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
