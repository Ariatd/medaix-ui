/**
 * Analysis Service for MedAIx
 * Handles analysis operations
 */

import { apiClient } from './apiClient';

// Analysis Result type (defined locally to avoid import issues)
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

export const analysisService = {
  /**
   * Get all analyses for the current user
   */
  async getAnalyses(): Promise<GetAnalysesResponse> {
    try {
      const response = await apiClient.get('/analyses');
      
      // Validate response structure
      if (!response || typeof response !== 'object') {
        console.error('[analysisService] Invalid getAnalyses response:', response);
        throw new Error('Invalid response from server');
      }
      
      return response as GetAnalysesResponse;
    } catch (error) {
      console.error('[analysisService] Error fetching analyses:', error);
      throw error;
    }
  },

  /**
   * Get a single analysis by ID
   */
  async getAnalysis(id: string): Promise<AnalysisResult> {
    try {
      const response = await apiClient.get<GetAnalysisResponse>(`/analyses/${id}`);
      
      // Validate response structure
      if (!response || typeof response !== 'object') {
        console.error('[analysisService] Invalid getAnalysis response:', response);
        throw new Error('Invalid response from server');
      }
      
      // Handle both wrapped ({ success: boolean; analysis: {...} }) and unwrapped ({ id: "...", ... }) responses
      const analysisData = response.analysis || response;
      
      if (!analysisData || !analysisData.id) {
        console.error('[analysisService] Missing analysis in response:', response);
        throw new Error('Analysis not found in response');
      }
      
      return analysisData;
    } catch (error) {
      console.error('[analysisService] Error fetching analysis:', error);
      throw error;
    }
  },

  /**
   * Get analysis result (polls until completion)
   * Returns the analysis object directly from { success: boolean; analysis: {...} }
   */
  async getAnalysisResult(imageId: string): Promise<AnalysisResult> {
    try {
      const response = await apiClient.get<AnalysisResultResponse>(`/analyses/image/${imageId}`);
      
      // Validate response structure - CRITICAL FIX for production
      if (!response) {
        console.error('[analysisService] Empty response for imageId:', imageId);
        throw new Error('No response received from server');
      }
      
      if (typeof response !== 'object') {
        console.error('[analysisService] Invalid response type:', typeof response, response);
        throw new Error('Invalid response format from server');
      }
      
      // Handle both wrapped ({ success: boolean; analysis: {...} }) and unwrapped ({ id: "...", ... }) responses
      const analysisData = response.analysis || response;
      
      if (!analysisData || !analysisData.id) {
        console.error('[analysisService] Missing analysis in response:', response);
        throw new Error('Analysis not found in response');
      }
      
      // Log response for debugging in production
      console.log('[analysisService] getAnalysisResult response:', JSON.stringify(response, null, 2));
      
      return analysisData as AnalysisResult;
    } catch (error) {
      console.error('[analysisService] Error fetching analysis result:', error);
      throw error;
    }
  },

  /**
   * Create a new analysis
   */
  async createAnalysis(imageId: string): Promise<CreateAnalysisResponse> {
    return apiClient.post('/analyses', { imageId });
  },

  /**
   * Delete an analysis
   */
  async deleteAnalysis(id: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete(`/analyses/${id}`);
  },

  /**
   * Update analysis status
   */
  async updateAnalysisStatus(id: string, status: string): Promise<AnalysisResult> {
    return apiClient.patch(`/analyses/${id}`, { status });
  },

  /**
   * Get user statistics
   */
  async getStatistics(userId: string): Promise<StatisticsResponse> {
    return apiClient.get(`/analyses/user/${userId}/statistics`);
  },
};

