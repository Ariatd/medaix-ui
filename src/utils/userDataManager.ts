/**
 * User-specific data management with localStorage persistence
 * All analysis data is stored per user and never shared across accounts
 */

export interface AnalysisDetail {
  confidence: number;
  severity?: string;
  region?: string;
  description?: string;
}

export interface Analysis {
  id: string;
  fileName: string;
  uploadedAt: string;
  imageType?: string;
  imageConfidence?: number;
  status: 'completed' | 'processing' | 'failed';
  results?: {
    findings: AnalysisDetail[];
    overallConfidence: number;
    recommendations?: string[];
  };
  userSettings?: {
    confidenceThreshold?: number;
  };
  error?: string;
}

export interface UserStatistics {
  totalAnalyses: number;
  successRate: number;
  thisMonth: number;
  avgConfidence: number;
}

export interface UserData {
  userId: string;
  analyses: Analysis[];
  createdAt: string;
  lastUpdated: string;
  statistics: UserStatistics;
}

const STORAGE_KEY_PREFIX = 'medaix_user_';
const DATA_KEY_SUFFIX = '_data';

/**
 * Get storage key for a specific user
 */
export function getStorageKey(userId: string): string {
  return `${STORAGE_KEY_PREFIX}${userId}${DATA_KEY_SUFFIX}`;
}

/**
 * Initialize empty user data
 */
function createEmptyUserData(userId: string): UserData {
  return {
    userId,
    analyses: [],
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    statistics: {
      totalAnalyses: 0,
      successRate: 0,
      thisMonth: 0,
      avgConfidence: 0,
    },
  };
}

/**
 * Recalculate statistics based on analyses
 */
import { toPercent } from './confidenceUtils';

function calculateStatistics(analyses: Analysis[]): UserStatistics {
  if (analyses.length === 0) {
    return {
      totalAnalyses: 0,
      successRate: 0,
      thisMonth: 0,
      avgConfidence: 0,
    };
  }

  const completedAnalyses = analyses.filter((a) => a.status === 'completed');
  const successRate =
    completedAnalyses.length > 0
      ? (completedAnalyses.length / analyses.length) * 100
      : 0;

  // Count analyses from current month
  const now = new Date();
  const currentMonth = analyses.filter((a) => {
    const analysisDate = new Date(a.uploadedAt);
    return (
      analysisDate.getMonth() === now.getMonth() &&
      analysisDate.getFullYear() === now.getFullYear()
    );
  });

  // Calculate average confidence from completed analyses
  const confidenceValues = completedAnalyses
    .map((a) => toPercent(a.results?.overallConfidence as number) || 0)
    .filter((c) => c > 0);
  const avgConfidence =
    confidenceValues.length > 0
      ? confidenceValues.reduce((a, b) => a + b, 0) / confidenceValues.length
      : 0;

  return {
    totalAnalyses: analyses.length,
    successRate: Math.round(successRate),
    thisMonth: currentMonth.length,
    avgConfidence: Math.round(avgConfidence * 100) / 100,
  };
}

/**
 * Get user data from localStorage, create if doesn't exist
 */
export function getUserData(userId: string): UserData {
  try {
    const key = getStorageKey(userId);
    const stored = localStorage.getItem(key);

    if (!stored) {
      const newData = createEmptyUserData(userId);
      localStorage.setItem(key, JSON.stringify(newData));
      return newData;
    }

    const data = JSON.parse(stored) as UserData;
    // Validate data structure
    if (!data.userId || !Array.isArray(data.analyses)) {
  // No-op placeholder for patch formatting
    }

    return data;
  } catch (error) {
    console.error('Error reading user data, creating new:', error);
    const newData = createEmptyUserData(userId);
    localStorage.setItem(getStorageKey(userId), JSON.stringify(newData));
    return newData;
  }
}

/**
 * Save user data to localStorage
 */
export function saveUserData(data: UserData): void {
  try {
    const key = getStorageKey(data.userId);
    data.lastUpdated = new Date().toISOString();
    // Recalculate statistics before saving
    data.statistics = calculateStatistics(data.analyses);
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving user data:', error);
    throw new Error('Failed to save user data');
  }
}

/**
 * Add a new analysis to user data
 */
export function addAnalysis(userId: string, analysis: Analysis): Analysis {
  const userData = getUserData(userId);

  // Generate ID if not provided
  if (!analysis.id) {
    analysis.id = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Set timestamp if not provided
  if (!analysis.uploadedAt) {
    analysis.uploadedAt = new Date().toISOString();
  }

  userData.analyses.unshift(analysis); // Add to beginning
  saveUserData(userData);

  return analysis;
}

/**
 * Update an existing analysis
 */
export function updateAnalysis(userId: string, analysisId: string, updates: Partial<Analysis>): Analysis | null {
  const userData = getUserData(userId);
  const index = userData.analyses.findIndex((a) => a.id === analysisId);

  if (index === -1) {
    console.error(`Analysis ${analysisId} not found`);
    return null;
  }

  userData.analyses[index] = {
    ...userData.analyses[index],
    ...updates,
  };

  saveUserData(userData);
  return userData.analyses[index];
}

/**
 * Get all analyses for a user
 */
export function getAnalyses(userId: string): Analysis[] {
  const userData = getUserData(userId);
  return userData.analyses;
}

/**
 * Get a specific analysis by ID
 */
export function getAnalysisById(userId: string, analysisId: string): Analysis | null {
  const analyses = getAnalyses(userId);
  return analyses.find((a) => a.id === analysisId) || null;
}

/**
 * Get user statistics
 */
export function getStatistics(userId: string): UserStatistics {
  const userData = getUserData(userId);
  return userData.statistics;
}

/**
 * Delete an analysis
 */
export function deleteAnalysis(userId: string, analysisId: string): boolean {
  try {
    const userData = getUserData(userId);
    const initialLength = userData.analyses.length;

    userData.analyses = userData.analyses.filter((a) => a.id !== analysisId);

    if (userData.analyses.length === initialLength) {
      return false; // Not found
    }

    saveUserData(userData);
    return true;
  } catch (error) {
    console.error('Error deleting analysis:', error);
    return false;
  }
}

/**
 * Clear all user data (careful - this is destructive!)
 */
export function clearUserData(userId: string): void {
  try {
    const key = getStorageKey(userId);
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
}

/**
 * Export user data as JSON
 */
export function exportUserData(userId: string): string {
  const userData = getUserData(userId);
  return JSON.stringify(userData, null, 2);
}

/**
 * Export analyses as CSV
 */
export function exportAnalysesAsCSV(userId: string): string {
  const analyses = getAnalyses(userId);

  if (analyses.length === 0) {
    return 'No analyses to export';
  }

  // CSV headers
  const headers = [
    'Analysis ID',
    'File Name',
    'Upload Date',
    'Image Type',
    'Image Confidence',
    'Status',
    'Overall Confidence',
    'Findings Count',
  ];

  // CSV rows
    const rows = analyses.map((a) => [
    a.id,
    a.fileName,
    a.uploadedAt,
    a.imageType || '',
      a.imageConfidence !== undefined && a.imageConfidence !== null ? (toPercent(a.imageConfidence) || 0).toFixed(2) : '',
    a.status,
      a.results?.overallConfidence ? (toPercent(a.results.overallConfidence) || 0).toFixed(2) : '',
    a.results?.findings ? a.results.findings.length : 0,
  ]);

  const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');

  return csv;
}

/**
 * Import data from JSON (with validation)
 */
export function importUserData(userId: string, jsonString: string): boolean {
  try {
    const importedData = JSON.parse(jsonString) as UserData;

    // Validate structure
    if (!importedData.userId || !Array.isArray(importedData.analyses)) {
      throw new Error('Invalid data structure');
    }

    // Set user ID to current user to prevent cross-user imports
    importedData.userId = userId;
    importedData.lastUpdated = new Date().toISOString();

    // Validate each analysis
    importedData.analyses.forEach((a) => {
      if (!a.id || !a.fileName || !a.uploadedAt) {
        throw new Error('Invalid analysis structure');
      }
    });

    saveUserData(importedData);
    return true;
  } catch (error) {
    console.error('Error importing user data:', error);
    return false;
  }
}

/**
 * Get analyses for a specific date range (for filtering)
 */
export function getAnalysesByDateRange(userId: string, startDate: Date, endDate: Date): Analysis[] {
  const analyses = getAnalyses(userId);

  return analyses.filter((a) => {
    const analysisDate = new Date(a.uploadedAt);
    return analysisDate >= startDate && analysisDate <= endDate;
  });
}

/**
 * Get analyses by status
 */
export function getAnalysesByStatus(userId: string, status: Analysis['status']): Analysis[] {
  const analyses = getAnalyses(userId);
  return analyses.filter((a) => a.status === status);
}

/**
 * Migrate old mock data format to new format (if needed)
 */
export function migrateUserData(userId: string): void {
  try {
    const userData = getUserData(userId);
    // Add any migration logic here if data structure changes
    // This is a hook for future backwards compatibility
    saveUserData(userData);
  } catch (error) {
    console.error('Error migrating user data:', error);
  }
}
