import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { analysisService, type AnalysisResult } from '../api/analysisService';
import { useToast } from '../context/ToastContext';
import { toPercent, formatPercent } from '../utils/confidenceUtils';
import { useAuth } from '../context/AuthContext';
import { isDemoMode } from '../api/apiClient';

// Demo badge component
const DemoBadge: React.FC = () => (
  <span className="inline-flex items-center gap-1 ml-2 px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
    </svg>
    Demo Mode
  </span>
);

const History: React.FC = () => {
  const { currentUser } = useAuth();
  const [allAnalyses, setAllAnalyses] = useState<AnalysisResult[]>([]);
  const [filteredAnalyses, setFilteredAnalyses] = useState<AnalysisResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { addToast } = useToast();
  const [sortBy, setSortBy] = useState('date');
  const itemsPerPage = 10;
  
  // Check if running in demo mode
  const demoMode = isDemoMode();

  // Filters
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: '',
  });

  // Load analyses on mount
  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const response = await analysisService.getAnalyses();

        // CRITICAL FIX: API returns data directly like { analyses: [...] }
        // Add null checks for response structure
        if (!response) {
          throw new Error('No response received from analyses API');
        }

        if (!response.analyses) {
          console.warn('[History] No analyses property in response:', response);
        }

        const analyses = response.analyses || [];
        setAllAnalyses(analyses);
        setFilteredAnalyses(analyses);
      } catch (error) {
        console.error('Error loading analyses:', error);
        addToast('Failed to load analyses', 'error');
      }
    };

    fetchAnalyses();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let results = [...allAnalyses];

    // Search
    if (searchTerm) {
      results = results.filter((a) =>
        (a.image?.fileName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        a.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date range
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      results = results.filter((a) => new Date(a.createdAt) >= startDate);
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      results = results.filter((a) => new Date(a.createdAt) <= endDate);
    }

    // Filter by status
    if (filters.status) {
      results = results.filter((a) => a.status === filters.status);
    }

    // Sort
    if (sortBy === 'date') {
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'confidence') {
      results.sort((a, b) => {
        const pa = toPercent(a.confidenceScore) || 0;
        const pb = toPercent(b.confidenceScore) || 0;
        return pb - pa;
      });
    } else if (sortBy === 'type') {
      results.sort((a, b) => (a.image?.imageType || '').localeCompare(b.image?.imageType || ''));
    }

    setFilteredAnalyses(results);
    setCurrentPage(1);
  }, [allAnalyses, searchTerm, filters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAnalyses.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedAnalyses = filteredAnalyses.slice(startIdx, startIdx + itemsPerPage);

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    
    try {
      await analysisService.deleteAnalysis(deleteId);
      setShowDeleteModal(false);
      setDeleteId(null);
      addToast('Analysis deleted successfully', 'success');
      
      // Refresh the list
      const response = await analysisService.getAnalyses();

      // CRITICAL FIX: API returns data directly like { analyses: [...] }
      if (!response || !response.analyses) {
        console.warn('[History] No analyses property in refresh response:', response);
        return;
      }

      setAllAnalyses(response.analyses);
      setFilteredAnalyses(response.analyses);
    } catch (error) {
      console.error('Error deleting analysis:', error);
      addToast('Failed to delete analysis', 'error');
    }
  };

  const handleExport = () => {
    // Export functionality not yet implemented in backend
    addToast('Export functionality not yet implemented', 'info');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success-50 text-success';
      case 'processing':
        return 'bg-warning-50 text-warning';
      case 'failed':
        return 'bg-danger-50 text-danger';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-success-50 text-success';
    if (confidence >= 75) return 'bg-blue-50 text-primary';
    if (confidence >= 60) return 'bg-warning-50 text-warning';
    return 'bg-danger-50 text-danger';
  };

  const statuses = Array.from(new Set(allAnalyses.map((a) => a.status)));

  if (!currentUser?.id) {
    return <DashboardLayout><div className="px-4 sm:px-6 py-12">Loading...</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#f7f8fa] dark:bg-[#071029] text-gray-900 dark:text-gray-100 ring-1 ring-black/5 dark:ring-white/6 px-4 sm:px-6 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl">
          {allAnalyses.length === 0 ? (
            // Empty State for new users - Responsive
            <div className="min-h-[60vh] flex flex-col items-center justify-center rounded-xl bg-gray-50/50 dark:bg-gray-800/80 py-12 sm:py-20 shadow-sm dark:shadow-lg border border-gray-200 dark:border-gray-700 px-4">
              <svg
                className="mb-6 h-16 w-16 sm:h-20 sm:w-20 text-gray-900 dark:text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h2 className="mb-2 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white text-center">No Analysis History Yet</h2>
              <p className="mb-8 text-center text-gray-600 dark:text-gray-300 max-w-sm text-sm sm:text-base">
                Upload and analyze your first medical image to start building your analysis history
              </p>
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 sm:px-8 py-3 sm:py-4 font-semibold text-white transition hover:bg-blue-700 text-sm sm:text-base"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Start Analyzing Now
              </Link>
            </div>
          ) : (
            <>
              {/* Header - Responsive */}
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center flex-wrap gap-2">
                  <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white">Analysis History</h1>
                  {demoMode && <DemoBadge />}
                </div>
              </div>

              {/* Success Message */}
              {successMessage && (
                <div className="mb-6 flex items-start gap-3 rounded-lg border border-success bg-success-50 p-4">
                  <svg className="h-5 w-5 flex-shrink-0 text-success mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-success">{successMessage}</p>
                </div>
              )}

              {/* Filters Section - Responsive */}
              <div className="mb-6 sm:mb-8 rounded-xl bg-white dark:bg-gray-800/80 p-4 sm:p-6 shadow-sm dark:shadow-lg border border-gray-200 dark:border-gray-700">
                <h2 className="mb-4 text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">Filters</h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  {/* Search */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-gray-300">Search</label>
                    <input
                      type="text"
                      placeholder="File name or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 text-sm sm:text-base text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    />
                  </div>

                  {/* Start Date */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-gray-300">Start Date</label>
                    <input
                      type="date"
                      value={filters.startDate}
                      onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 text-sm sm:text-base text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-gray-300">End Date</label>
                    <input
                      type="date"
                      value={filters.endDate}
                      onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 text-sm sm:text-base text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-gray-300">Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 text-sm sm:text-base text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    >
                      <option value="">All Statuses</option>
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-gray-300">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 text-sm sm:text-base text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    >
                      <option value="date">Date (Newest)</option>
                      <option value="confidence">Confidence (High to Low)</option>
                      <option value="type">Type (A to Z)</option>
                    </select>
                  </div>
                </div>

                {/* Clear Filters */}
                {(searchTerm || filters.startDate || filters.endDate || filters.status) && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilters({ startDate: '', endDate: '', status: '' });
                    }}
                    className="mt-4 text-sm text-primary hover:underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>

              {/* Results Count */}
              <div className="mb-4 text-xs sm:text-sm text-gray-900 dark:text-gray-300">
                Showing <span className="font-semibold">{paginatedAnalyses.length}</span> of{' '}
                <span className="font-semibold">{filteredAnalyses.length}</span> analyses
              </div>

              {/* Table - Responsive */}
              {paginatedAnalyses.length > 0 ? (
                <div className="rounded-xl bg-white dark:bg-gray-800/80 shadow-sm dark:shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  {/* Mobile Card View */}
                  <div className="block lg:hidden">
                    {paginatedAnalyses.map((analysis) => (
                      <div key={analysis.id} className="border-b border-gray-700 bg-gray-800/60 p-4 sm:p-6 last:border-b-0">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-100 text-sm sm:text-base truncate">{analysis.image?.fileName || 'Unknown'}</h3>
                              <p className="text-xs sm:text-sm text-gray-300">{new Date(analysis.createdAt).toLocaleString()}</p>
                            </div>
                            <span className={`inline-block rounded-full px-2 sm:px-3 py-1 text-xs font-semibold ${getStatusColor(analysis.status)}`}>
                              {analysis.status.charAt(0).toUpperCase() + analysis.status.slice(1)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="inline-block rounded-full bg-blue-900/30 px-2 sm:px-3 py-1 text-xs font-semibold text-gray-900 dark:text-gray-100">
                              {analysis.image?.imageType || 'Unknown'}
                            </span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                              {analysis.confidenceScore !== undefined && analysis.confidenceScore !== null
                                ? formatPercent(analysis.confidenceScore)
                                : '-'}
                            </span>
                          </div>
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            to={`/results/${analysis.id}`}
                            title="View details"
                            className="rounded-lg bg-primary-900/30 p-2.5 text-primary transition hover:bg-primary hover:text-white touch-manipulation"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-7-9.542 7-4.477 5.064 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => handleDelete(analysis.id)}
                            title="Delete"
                            className="rounded-lg bg-red-900/30 p-2.5 text-red-400 transition hover:bg-red-600 hover:text-white touch-manipulation"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table View - With overflow handling */}
                  <div className="hidden lg:block overflow-x-auto">
                    <div className="min-w-full inline-block align-middle">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800/60">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 whitespace-nowrap">Date</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 whitespace-nowrap">File Name</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 whitespace-nowrap">Image Type</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 whitespace-nowrap">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 whitespace-nowrap">Confidence</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-gray-200 whitespace-nowrap">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {paginatedAnalyses.map((analysis) => (
                            <tr key={analysis.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/60 transition">
                              <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-300 whitespace-nowrap">
                                {new Date(analysis.createdAt).toLocaleString()}
                              </td>
                              <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-100 max-w-xs truncate">
                                {analysis.image?.fileName || 'Unknown'}
                              </td>
                              <td className="px-6 py-4 text-sm whitespace-nowrap">
                                <span className="inline-block rounded-full bg-blue-900/30 px-3 py-1 text-xs font-semibold text-gray-900 dark:text-gray-100">
                                  {analysis.image?.imageType || 'Unknown'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm whitespace-nowrap">
                                <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(analysis.status)}`}>
                                  {analysis.status.charAt(0).toUpperCase() + analysis.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap">
                                {analysis.confidenceScore !== undefined && analysis.confidenceScore !== null
                                  ? formatPercent(analysis.confidenceScore)
                                  : '-'}
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <Link
                                    to={`/results/${analysis.id}`}
                                    title="View details"
                                    className="rounded-lg bg-primary-900/30 p-2 text-primary transition hover:bg-primary hover:text-white touch-manipulation"
                                  >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                  </Link>
                                  <button
                                    onClick={() => handleDelete(analysis.id)}
                                    title="Delete"
                                    className="rounded-lg bg-red-900/30 p-2 text-red-400 transition hover:bg-red-600 hover:text-white touch-manipulation"
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
                  </div>

                  {/* Pagination - Responsive */}
                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 px-4 sm:px-6 py-4">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm font-semibold text-gray-900 transition hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed order-2 sm:order-1 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700/40"
                      >
                        ← Previous
                      </button>

                      <div className="flex flex-wrap items-center justify-center gap-1 order-1 sm:order-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`rounded-lg px-3 py-1 text-sm font-semibold transition ${
                              currentPage === page
                                ? 'bg-primary text-white'
                                : 'border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700/40'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm font-semibold text-gray-900 transition hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed order-3 sm:order-3 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700/40"
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="min-h-[40vh] flex flex-col items-center justify-center rounded-xl bg-white dark:bg-gray-800/80 py-12 shadow-sm dark:shadow-lg border border-gray-200 dark:border-gray-700">
                  <svg className="mb-4 h-12 w-12 sm:h-16 sm:w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-600 text-sm sm:text-base">No analyses match your filters</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilters({ startDate: '', endDate: '', status: '' });
                    }}
                    className="mt-4 text-sm text-primary hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-xl bg-gray-800/90 p-6 sm:p-8 shadow-2xl ring-1 ring-white/6">
            <h3 className="mb-2 text-xl sm:text-2xl font-bold text-gray-100">Delete Analysis?</h3>
            <p className="mb-6 text-sm sm:text-base text-gray-300">
              Are you sure you want to delete this analysis? This action cannot be undone.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 rounded-lg border-2 border-gray-600 px-4 py-2 font-semibold text-gray-200 transition hover:bg-gray-700/40"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default History;
