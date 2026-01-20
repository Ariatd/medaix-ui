/**
 * Analysis Service for MedAIx
 * Handles analysis operations
 */

import { apiClient } from './apiClient';

// --- TİPLER AYNI KALDI (Değiştirilmedi) ---
export interface Finding {
  id: string;
  description: string;
  region: string;
  confidence: number;
  severity: 'normal' | 'mild' | 'moderate' | 'severe';
  recommendedAction?: string;
}

export interface SeverityAssessment {
  overallSeverity: 'normal' | 'mild' | 'moderate' | 'severe';
  affectedRegions: string[];
  urgencyLevel: 'routine' | 'urgent' | 'emergency';
  recommendedActions: string[];
}

export interface RegionOfInterest {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  confidence: number;
}

export interface DifferentialDiagnosis {
  condition: string;
  probability: number;
  reasoning: string;
}

export interface QualityMetrics {
  imageQuality: number;
  completeness: number;
  clarity: number;
  artifactLevel: 'none' | 'minimal' | 'moderate' | 'severe';
}

export interface AnalysisMetadata {
  algorithmVersion: string;
  modelUsed: string;
  processingNode: string;
  batchId: string;
  confidenceThresholds: {
    primary: number;
    secondary: number;
    final: number;
  };
}

export interface SecondaryVerificationResult {
  verifiedBy: string;
  verificationTime: string;
  confidenceAdjustment: number;
  notes: string;
}

export interface AnalysisResult {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  confidenceScore: number;
  confidenceLevel: 'low' | 'medium' | 'high' | 'very_high';
  findings: Finding[];
  recommendations: string[];
  differentialDiagnosis: DifferentialDiagnosis[];
  severityAssessment: SeverityAssessment;
  regionsOfInterest: RegionOfInterest[];
  qualityMetrics: QualityMetrics;
  heatmapUrl?: string;
  processingTimeSeconds: number;
  secondaryVerification?: SecondaryVerificationResult;
  metadata: AnalysisMetadata;
  image?: {
    id: string;
    fileName: string;
    imageType: string;
  };
  createdAt: string;
  completedAt?: string;
  error?: string;
}

export interface GetAnalysesResponse {
  success: boolean;
  analyses: AnalysisResult[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  summary?: {
    totalAnalyses: number;
    completedAnalyses: number;
    pendingAnalyses: number;
    failedAnalyses: number;
    successRate: number;
    avgConfidence: number;
  };
}

export interface GetAnalysisResponse {
  success: boolean;
  analysis: AnalysisResult;
}

export interface CreateAnalysisResponse {
  success: boolean;
  data: {
    analysis: {
      id: string;
      status: string;
      createdAt: string;
    };
  };
  message: string;
}

export interface AnalysisResultResponse {
  success: boolean;
  analysis: {
    id: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    image?: {
      id: string;
      fileName: string;
      imageType: string;
    };
    findings?: any[];
    confidence?: number;
    createdAt: string;
    completedAt?: string;
    error?: string;
  };
}

export interface StatisticsResponse {
  success: boolean;
  statistics: {
    totalAnalyses: number;
    successRate: number;
    thisMonth: number;
    avgConfidence: number;
    completedAnalyses: number;
    failedAnalyses: number;
    pendingAnalyses: number;
  };
}

// --- DEMO VERİLERİ (Taklit için kullanılacak) ---
const MOCK_ANALYSIS: AnalysisResult = {
  id: 'demo_analysis_1',
  status: 'completed',
  confidenceScore: 98.4,
  confidenceLevel: 'very_high',
  findings: [
    { id: 'f1', description: 'Normal pulmonary patterns detected', region: 'Right Lung', confidence: 99, severity: 'normal' }
  ],
  recommendations: ['Routine follow-up in 12 months'],
  differentialDiagnosis: [{ condition: 'Healthy Appearance', probability: 99.5, reasoning: 'Clear visibility' }],
  severityAssessment: { overallSeverity: 'normal', affectedRegions: [], urgencyLevel: 'routine', recommendedActions: [] },
  regionsOfInterest: [],
  qualityMetrics: { imageQuality: 0.95, completeness: 1.0, clarity: 0.98, artifactLevel: 'none' },
  processingTimeSeconds: 2.4,
  metadata: { 
    algorithmVersion: 'v2.1.0-demo', 
    modelUsed: 'MedAIx-Demo-Core', 
    processingNode: 'demo-node-01', 
    batchId: 'demo-batch-001',
    confidenceThresholds: { primary: 0.8, secondary: 0.85, final: 0.9 }
  },
  createdAt: new Date().toISOString()
};

export const analysisService = {
  /**
   * Get all analyses for the current user
   */
  async getAnalyses(): Promise<GetAnalysesResponse> {
    if (import.meta.env.VITE_IS_DEMO === 'true') {
      return {
        success: true,
        analyses: [MOCK_ANALYSIS],
        pagination: { page: 1, limit: 10, total: 1, pages: 1 },
        summary: { totalAnalyses: 1, completedAnalyses: 1, pendingAnalyses: 0, failedAnalyses: 0, successRate: 100, avgConfidence: 98.4 }
      };
    }
    try {
      const response = await apiClient.get('/analyses');
      if (!response || typeof response !== 'object') throw new Error('Invalid response');
      return response as GetAnalysesResponse;
    } catch (error) { throw error; }
  },

  /**
   * Get a single analysis by ID
   */
  async getAnalysis(id: string): Promise<AnalysisResult> {
    if (import.meta.env.VITE_IS_DEMO === 'true') return MOCK_ANALYSIS;
    try {
      const response = await apiClient.get<GetAnalysisResponse>(`/analyses/${id}`);
      const analysisData = response.analysis || response;
      if (!analysisData || !analysisData.id) throw new Error('Analysis not found');
      return analysisData;
    } catch (error) { throw error; }
  },

  /**
   * Get analysis result (polls until completion)
   */
  async getAnalysisResult(imageId: string): Promise<AnalysisResult> {
    if (import.meta.env.VITE_IS_DEMO === 'true') {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Analiz ediliyormuş gibi beklet
      return MOCK_ANALYSIS;
    }
    try {
      const response = await apiClient.get<AnalysisResultResponse>(`/analyses/image/${imageId}`);
      if (!response) throw new Error('No response');
      const analysisData = response.analysis || response;
      if (!analysisData || !analysisData.id) throw new Error('Analysis not found');
      return analysisData as AnalysisResult;
    } catch (error) { throw error; }
  },

  /**
   * Create a new analysis
   */
  async createAnalysis(imageId: string): Promise<CreateAnalysisResponse> {
    if (import.meta.env.VITE_IS_DEMO === 'true') {
      return {
        success: true,
        data: { analysis: { id: 'demo_analysis_1', status: 'processing', createdAt: new Date().toISOString() } },
        message: "Analysis started (Demo Mode)"
      };
    }
    return apiClient.post('/analyses', { imageId });
  },

  /**
   * Delete an analysis
   */
  async deleteAnalysis(id: string): Promise<{ success: boolean; message: string }> {
    if (import.meta.env.VITE_IS_DEMO === 'true') return { success: true, message: "Deleted (Demo)" };
    return apiClient.delete(`/analyses/${id}`);
  },

  /**
   * Update analysis status
   */
  async updateAnalysisStatus(id: string, status: string): Promise<AnalysisResult> {
    if (import.meta.env.VITE_IS_DEMO === 'true') return MOCK_ANALYSIS;
    return apiClient.patch(`/analyses/${id}`, { status });
  },

  /**
   * Get user statistics
   */
  async getStatistics(userId: string): Promise<StatisticsResponse> {
    if (import.meta.env.VITE_IS_DEMO === 'true') {
      return {
        success: true,
        statistics: { totalAnalyses: 1, successRate: 100, thisMonth: 1, avgConfidence: 98.4, completedAnalyses: 1, failedAnalyses: 0, pendingAnalyses: 0 }
      };
    }
    return apiClient.get(`/analyses/user/${userId}/statistics`);
  },
};