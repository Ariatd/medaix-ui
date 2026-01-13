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
  data: {
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
  };
}

export interface GetAnalysisResponse {
  success: boolean;
  data: {
    analysis: AnalysisResult;
  };
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
  data: {
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
  };
}

export const analysisService = {
  /**
   * Get all analyses for the current user
   */
  async getAnalyses(): Promise<GetAnalysesResponse> {
    return apiClient.get('/analyses');
  },

  /**
   * Get a single analysis by ID
   */
  async getAnalysis(id: string): Promise<GetAnalysisResponse> {
    return apiClient.get(`/analyses/${id}`);
  },

  /**
   * Get analysis result (polls until completion)
   */
  async getAnalysisResult(imageId: string): Promise<AnalysisResultResponse> {
    return apiClient.get(`/analyses/image/${imageId}`);
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
};

