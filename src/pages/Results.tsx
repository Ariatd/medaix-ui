import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import ConfirmationModal from '../components/ConfirmationModal';
import LoadingAnimation from '../components/LoadingAnimation';
import ErrorAlert from '../components/ErrorAlert';
import WarningBanner from '../components/WarningBanner';
import { analysisService, type AnalysisResult } from '../api/analysisService';
import { useToast } from '../context/ToastContext';
import { toPercent, formatPercent } from '../utils/confidenceUtils';
import { useAuth } from '../context/AuthContext';
import type { ValidationResult } from '../utils/imageValidator';

const Results: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Check if this is a new upload from navigation state
  const navigationData = location.state as {
    analysis?: AnalysisResult;
    validationResult?: ValidationResult;
    warningType?: 'yellow' | 'red';
  } | null;

  useEffect(() => {
    // Handle new uploads from navigation state
    if (navigationData?.analysis) {
      console.log('[Results] Loading analysis from navigation state');
      setAnalysis(navigationData.analysis);
      setValidationResult(navigationData.validationResult || null);
      setLoading(false);
      return;
    }

    // Handle existing analyses from database
    if (!id) {
      setError('Missing analysis ID');
      setLoading(false);
      return;
    }

    const fetchAnalysis = async () => {
      try {
        console.log('[Results] Fetching analysis for id:', id);
        const response = await analysisService.getAnalysis(id);
        
        // CRITICAL FIX: API returns data wrapped like { success: true, data: { analysis: {...} } }
        // Add null checks for response structure
        if (!response) {
          console.error('[Results] Empty response from getAnalysis');
          setError('No response from server');
          return;
        }

        if (!response.data) {
          console.error('[Results] Missing data in response:', response);
          setError('Invalid response: missing data');
          return;
        }

        if (!response.data.analysis) {
          console.error('[Results] Missing analysis in response:', response);
          setError('Analysis not found');
          return;
        }

        console.log('[Results] Analysis loaded successfully:', response.data.analysis.id);
        setAnalysis(response.data.analysis);
      } catch (err) {
        console.error('[Results] Error fetching analysis:', err);
        setError(err instanceof Error ? err.message : 'Failed to load analysis');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigationData]);

    if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[calc(100vh-300px)] items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-neutral-900 to-black text-gray-100 px-4 sm:px-6">
          <LoadingAnimation message="Loading results..." />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !analysis) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[calc(100vh-300px)] items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-neutral-900 to-black text-gray-100 px-4 sm:px-6">
          <div className="w-full max-w-md">
            <ErrorAlert message={error || 'Analysis not found'} onClose={() => navigate('/history')} />
            <button
              onClick={() => navigate('/history')}
              className="mt-4 w-full rounded-lg bg-primary px-6 py-2 font-semibold text-white transition hover:bg-blue-700"
            >
              Back to History
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#f7f8fa] dark:bg-[#071029] text-gray-900 dark:text-gray-100 ring-1 ring-black/5 dark:ring-white/6 px-4 sm:px-6 py-6 sm:py-8">
        <div className="mx-auto max-w-7xl">
          {/* Header - Responsive */}
          <div className="mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="mb-2 text-xl sm:text-2xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">Analysis Results</h1>
                <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 truncate">{analysis.image?.fileName || 'Unknown file'}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">ID: {analysis.id.substring(0, 12)}...</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                <Link
                  to="/history"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3 sm:px-4 py-2 font-semibold text-white transition hover:bg-blue-700 w-full sm:w-auto text-sm sm:text-base"
                >
                  ← Back to History
                </Link>

                <button
                  onClick={() => {
                    if (!analysis) return;
                    
                    try {
                      // Create CSV content from analysis data
                      const headers = ['File Name', 'Image Type', 'Status', 'Confidence', 'Date', 'Findings'];
                      const rows = [
                        [
                          analysis.image?.fileName || 'Unknown',
                          analysis.image?.imageType || 'Unknown',
                          analysis.status,
                          analysis.confidenceScore !== undefined ? formatPercent(analysis.confidenceScore) : 'N/A',
                          new Date(analysis.createdAt).toLocaleString(),
                          analysis.findings?.map(f => `${f.description} (${formatPercent(f.confidence)})`).join('; ') || 'None'
                        ]
                      ];
                      
                      // Generate CSV content
                      const csvContent = [
                        headers.join(','),
                        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
                      ].join('\n');
                      
                      // Download the file
                      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.setAttribute('download', `analysis-${analysis.id.substring(0, 8)}.csv`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      URL.revokeObjectURL(url);
                      
                      addToast('Analysis exported to CSV successfully', 'success');
                    } catch (error) {
                      console.error('Error exporting CSV:', error);
                      addToast('Failed to export CSV', 'error');
                    }
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-3 sm:px-4 py-2 font-semibold text-white transition hover:bg-green-700 w-full sm:w-auto text-sm sm:text-base"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span className="hidden sm:inline">Export CSV</span>
                  <span className="sm:hidden">CSV</span>
                </button>

                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-3 sm:px-4 py-2 font-semibold text-white transition hover:bg-red-700 w-full sm:w-auto text-sm sm:text-base"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span className="hidden sm:inline">Delete</span>
                  <span className="sm:hidden">Delete</span>
                </button>
              </div>
            </div>
          </div>

          {/* Validation Warning Banners */}
          {validationResult?.warningType && (
            <div className="mb-6 sm:mb-8">
              <WarningBanner
                type={validationResult.warningType}
                message={validationResult.message}
              />
            </div>
          )}

          {/* Status Banner - Responsive */}
          <div className="mb-6 sm:mb-8 rounded-lg border-2 border-green-600 bg-green-100 dark:bg-green-900/30 p-4 sm:p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-green-900 dark:text-green-300">{analysis.image?.imageType || 'Unknown'} Image</h2>
                <p className="mt-1 text-sm sm:text-base text-green-800 dark:text-gray-300">Status: {analysis.status}</p>
              </div>
              <div className="text-center sm:text-right">
                <div className="text-2xl sm:text-3xl lg:text-5xl font-bold text-green-900 dark:text-green-300">
                  {analysis.confidenceScore !== undefined && analysis.confidenceScore !== null
                    ? formatPercent(analysis.confidenceScore)
                    : 'N/A'}
                </div>
                <p className="text-xs sm:text-sm text-green-700 dark:text-gray-400">Confidence</p>
              </div>
            </div>
          </div>

          {/* Main Content Grid - Responsive */}
          <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* File Information - Responsive */}
              <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800/80 shadow-lg border border-gray-200 dark:border-gray-700 ring-1 dark:ring-white/6">
                <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/60 px-4 sm:px-6 py-3 sm:py-4">
                  <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-gray-100">Image Information</h3>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">File Name</p>
                      <p className="mt-1 sm:mt-2 font-medium text-gray-900 dark:text-gray-100 break-all text-xs sm:text-sm">{analysis.image?.fileName || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Image Type</p>
                      <span className="mt-1 sm:mt-2 inline-block rounded-full bg-blue-900/30 px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-300">
                        {analysis.image?.imageType || 'Unknown'}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Upload Date</p>
                      <p className="mt-1 sm:mt-2 font-medium text-gray-900 dark:text-gray-100 text-xs sm:text-sm">
                        {new Date(analysis.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">File Size</p>
                      <p className="mt-1 sm:mt-2 font-medium text-gray-900 dark:text-gray-100 text-xs sm:text-sm">
                        Unknown
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analysis Findings - Responsive */}
              <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800/80 shadow-lg border border-gray-200 dark:border-gray-700 ring-1 dark:ring-white/6">
                <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/60 px-4 sm:px-6 py-3 sm:py-4">
                  <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-gray-100">Analysis Findings</h3>
                </div>
                <div className="p-4 sm:p-6">
                  {analysis.findings && analysis.findings.length > 0 ? (
                    <div className="space-y-4">
                      {analysis.findings.map((finding, idx) => (
                        <div key={idx} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 p-3 sm:p-4">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-xs sm:text-sm">{finding.description}</h4>
                              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">Region: {finding.region}</p>
                            </div>
                            {(() => {
                              const pct = toPercent(finding.confidence);
                              const cls = pct !== null && pct >= 80
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                : pct !== null && pct >= 60
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';

                              return (
                                <span className={`inline-flex flex-shrink-0 items-center rounded-full px-2 sm:px-3 py-1 text-xs font-semibold whitespace-nowrap self-start sm:self-center ${cls}`}>
                                  {formatPercent(finding.confidence)}
                                </span>
                              );
                            })()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300 text-sm">No specific findings recorded</p>
                  )}
                </div>
              </div>

              {/* Recommendations - Responsive */}
              {analysis.recommendations && analysis.recommendations.length > 0 && (
                <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800/80 shadow-lg border border-gray-200 dark:border-gray-700 ring-1 dark:ring-white/6">
                  <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/60 px-4 sm:px-6 py-3 sm:py-4">
                    <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-gray-100">Recommendations</h3>
                  </div>
                  <div className="p-4 sm:p-6">
                    <ul className="space-y-3">
                      {analysis.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <svg className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-green-600 dark:text-green-300 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-800 dark:text-gray-300 text-xs sm:text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Responsive */}
            <div className="mt-6 lg:mt-0">
              {/* Quick Summary - Silver Card */}
              <div className="overflow-hidden rounded-lg bg-gray-100 dark:bg-transparent shadow-lg border border-gray-200 dark:border-transparent ring-1 dark:ring-white/6">
                <div className="border-b border-gray-200 dark:border-gray-800 bg-gray-200 dark:bg-gray-900/80 px-4 sm:px-6 py-3 sm:py-4">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base lg:text-lg">Quick Summary</h3>
                </div>
                <div className="p-4 sm:p-6 space-y-4">
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Status</p>
                    <span className={`mt-1 sm:mt-2 inline-block rounded-full px-2 sm:px-3 py-1 text-xs font-semibold ${
                      analysis.status === 'completed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : analysis.status === 'processing'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {analysis.status.charAt(0).toUpperCase() + analysis.status.slice(1)}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Overall Confidence</p>
                    <div className="mt-1 sm:mt-2 flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-gray-300 dark:bg-gray-700">
                        <div
                          className="h-full rounded-full bg-primary-600"
                          style={{ width: `${(toPercent(analysis.confidenceScore) || 0)}%` }}
                        ></div>
                      </div>
                        <span className="font-bold text-gray-900 dark:text-gray-100 text-xs sm:text-sm">
                          {analysis.confidenceScore !== undefined && analysis.confidenceScore !== null
                            ? formatPercent(analysis.confidenceScore)
                            : 'N/A'}
                        </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Findings Count</p>
                    <p className="mt-1 sm:mt-2 text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {analysis.findings ? analysis.findings.length : 0}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate('/history')}
                    className="w-full rounded-lg bg-primary px-3 sm:px-4 py-2 font-semibold text-white transition hover:bg-blue-700 text-xs sm:text-sm"
                  >
                    ← Back to History
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer - Responsive */}
          <div className="mt-8 sm:mt-12 flex items-start gap-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-4 border border-yellow-200 dark:border-transparent" role="alert">
            <svg
              className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 text-yellow-300 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-xs sm:text-sm text-gray-900 dark:text-gray-300">
              <strong className="text-gray-900 dark:text-gray-100">Important Notice:</strong> This analysis is for research and educational purposes only.
              These results are not a clinical diagnosis and should not be used as a substitute for professional medical advice.
              Always consult with qualified healthcare professionals.
            </p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Analysis"
        message="Are you sure you want to delete this analysis? This action cannot be undone."
        isDangerous
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleting}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={async () => {
          if (!analysis) return;
          
          setDeleting(true);
          try {
            await analysisService.deleteAnalysis(analysis.id);
            addToast('Analysis deleted successfully', 'success');
            setShowDeleteModal(false);
            navigate('/history');
          } catch (error) {
            console.error('Error deleting analysis:', error);
            addToast('Failed to delete analysis', 'error');
          } finally {
            setDeleting(false);
          }
        }}
      />
    </DashboardLayout>
  );
};

export default Results;
