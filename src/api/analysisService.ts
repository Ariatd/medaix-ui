/**
 * Analysis Service for MedAIx
 * Handles analysis operations
 */

import { apiClient } from './apiClient';
import { isDemoMode } from './apiClient';

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

// --- DEMO MODE MOCK DATA ---

// Helper to create demo analysis ID
const createDemoId = (prefix: string = 'demo'): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Helper to get date N days ago
const daysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

// Comprehensive demo analysis data
const MOCK_ANALYSIS: AnalysisResult = {
  id: createDemoId('demo'),
  status: 'completed',
  confidenceScore: 0.942,
  confidenceLevel: 'very_high',
  findings: [
    { id: 'f1', description: 'Normal pulmonary patterns detected in both lungs', region: 'Bilateral Lungs', confidence: 0.96, severity: 'normal' },
    { id: 'f2', description: 'No acute cardiopulmonary abnormality', region: 'Heart', confidence: 0.94, severity: 'normal' },
    { id: 'f3', description: 'Clear costophrenic angles bilaterally', region: 'Pleura', confidence: 0.98, severity: 'normal' },
  ],
  recommendations: [
    'Routine follow-up recommended in 12 months',
    'Maintain regular health checkups',
    'Continue healthy lifestyle practices',
  ],
  differentialDiagnosis: [
    { condition: 'Normal Study', probability: 95.2, reasoning: 'All structures within normal limits' },
    { condition: 'Chronic Obstructive Pulmonary Disease', probability: 3.1, reasoning: 'Minimal changes, likely artifact' },
    { condition: 'Mild Bronchial thickening', probability: 1.7, reasoning: 'Within normal variation' },
  ],
  severityAssessment: { 
    overallSeverity: 'normal', 
    affectedRegions: [], 
    urgencyLevel: 'routine', 
    recommendedActions: ['Continue routine monitoring'] 
  },
  regionsOfInterest: [],
  qualityMetrics: { 
    imageQuality: 0.95, 
    completeness: 1.0, 
    clarity: 0.92, 
    artifactLevel: 'none' 
  },
  processingTimeSeconds: 2.4,
  metadata: { 
    algorithmVersion: 'v2.1.0-demo', 
    modelUsed: 'MedAIx-Demo-Core', 
    processingNode: 'demo-node-01', 
    batchId: 'demo-batch-001',
    confidenceThresholds: { primary: 0.8, secondary: 0.85, final: 0.9 }
  },
  image: {
    id: 'demo_image_1',
    fileName: 'Chest_XRay_Demo.jpg',
    imageType: 'Chest X-Ray'
  },
  createdAt: new Date().toISOString(),
  completedAt: new Date().toISOString(),
};

// Generate multiple mock analyses for history/dashboard
const generateMockAnalyses = (count: number): AnalysisResult[] => {
  const analyses: AnalysisResult[] = [];
  const statuses: Array<'completed' | 'processing'> = ['completed', 'completed', 'completed', 'processing'];
  const imageTypes = ['Chest X-Ray', 'Brain MRI', 'Chest CT', 'Abdominal Ultrasound', 'Spine X-Ray', 'Knee MRI'];
  const fileNames = [
    'Chest_XRay_Patient001.dcm',
    'Brain_MRI_Scan002.dcm',
    'Chest_CT_Scan003.dcm',
    'Abdomen_US_004.jpg',
    'Spine_XRay_005.dcm',
    'Knee_MRI_006.dcm',
  ];
  
  for (let i = 0; i < count; i++) {
    const status = statuses[i % statuses.length];
    const confidence = 0.75 + Math.random() * 0.23; // 75-98%
    
    analyses.push({
      id: createDemoId('demo'),
      status,
      confidenceScore: confidence,
      confidenceLevel: confidence >= 0.9 ? 'very_high' : confidence >= 0.75 ? 'high' : 'medium',
      findings: status === 'completed' ? [
        { id: `f${i}_1`, description: `Finding ${i + 1} description`, region: 'Region A', confidence, severity: 'normal' }
      ] : [],
      recommendations: status === 'completed' ? ['Routine follow-up recommended'] : [],
      differentialDiagnosis: status === 'completed' ? [
        { condition: 'Normal', probability: confidence * 100, reasoning: 'Clear visibility' }
      ] : [],
      severityAssessment: { 
        overallSeverity: 'normal', 
        affectedRegions: [], 
        urgencyLevel: 'routine', 
        recommendedActions: [] 
      },
      regionsOfInterest: [],
      qualityMetrics: { 
        imageQuality: 0.9 + Math.random() * 0.1, 
        completeness: 1.0, 
        clarity: 0.88 + Math.random() * 0.12, 
        artifactLevel: 'none' 
      },
      processingTimeSeconds: 1.5 + Math.random() * 2,
      metadata: { 
        algorithmVersion: 'v2.1.0-demo', 
        modelUsed: 'MedAIx-Demo-Core', 
        processingNode: 'demo-node-01', 
        batchId: `demo-batch-${i + 1}`,
        confidenceThresholds: { primary: 0.8, secondary: 0.85, final: 0.9 }
      },
      image: {
        id: `demo_image_${i + 1}`,
        fileName: fileNames[i % fileNames.length],
        imageType: imageTypes[i % imageTypes.length]
      },
      createdAt: daysAgo(i * 3 + Math.floor(Math.random() * 2)),
      completedAt: status === 'completed' ? daysAgo(i * 3) : undefined,
    });
  }
  
  return analyses;
};

// Demo statistics
const getDemoStatistics = (): StatisticsResponse => ({
  success: true,
  statistics: {
    totalAnalyses: 120,
    successRate: 98,
    thisMonth: 45,
    avgConfidence: 94,
    completedAnalyses: 118,
    failedAnalyses: 2,
    pendingAnalyses: 0,
  }
});

// Mock analyses for list view
const DEMO_ANALYSES = generateMockAnalyses(5);

export const analysisService = {
  /**
   * Check if running in demo mode
   */
  isDemoMode,

  /**
   * Get all analyses for the current user
   */
  async getAnalyses(): Promise<GetAnalysesResponse> {
    if (isDemoMode()) {
      console.log('[AnalysisService] Demo mode: Returning mock analyses');
      return {
        success: true,
        analyses: DEMO_ANALYSES,
        pagination: { page: 1, limit: 10, total: DEMO_ANALYSES.length, pages: 1 },
        summary: {
          totalAnalyses: DEMO_ANALYSES.length,
          completedAnalyses: DEMO_ANALYSES.filter(a => a.status === 'completed').length,
          pendingAnalyses: DEMO_ANALYSES.filter(a => a.status !== 'completed').length,
          failedAnalyses: 0,
          successRate: 100,
          avgConfidence: Math.round(DEMO_ANALYSES.reduce((sum, a) => sum + a.confidenceScore, 0) / DEMO_ANALYSES.length * 100)
        }
      };
    }
    try {
      const response = await apiClient.get('/analyses');
      if (!response || typeof response !== 'object') throw new Error('Invalid response');
      return response as GetAnalysesResponse;
    } catch (error) {
      console.error('[AnalysisService] Error fetching analyses:', error);
      throw error;
    }
  },

  /**
   * Get a single analysis by ID
   */
  async getAnalysis(id: string): Promise<AnalysisResult> {
    // In demo mode, check if it's a demo ID
    if (isDemoMode() || id.startsWith('demo_') || id.includes('demo')) {
      console.log('[AnalysisService] Demo mode: Returning mock analysis for id:', id);
      return {
        ...MOCK_ANALYSIS,
        id,
        image: {
          ...MOCK_ANALYSIS.image!,
          fileName: id.startsWith('demo_') ? 'Demo_Image.jpg' : MOCK_ANALYSIS.image!.fileName
        }
      };
    }
    try {
      const response = await apiClient.get<GetAnalysisResponse>(`/analyses/${id}`);
      const analysisData = response.analysis || response;
      if (!analysisData || !analysisData.id) throw new Error('Analysis not found');
      return analysisData;
    } catch (error) {
      console.error('[AnalysisService] Error fetching analysis:', error);
      throw error;
    }
  },

  /**
   * Get analysis result (polls until completion)
   */
  async getAnalysisResult(imageId: string): Promise<AnalysisResult> {
    if (isDemoMode()) {
      console.log('[AnalysisService] Demo mode: Simulating analysis result');
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      return {
        ...MOCK_ANALYSIS,
        id: createDemoId('demo'),
        image: {
          id: imageId,
          fileName: 'Processed_Image.jpg',
          imageType: 'Chest X-Ray'
        }
      };
    }
    try {
      const response = await apiClient.get<AnalysisResultResponse>(`/analyses/image/${imageId}`);
      if (!response) throw new Error('No response');
      const analysisData = response.analysis || response;
      if (!analysisData || !analysisData.id) throw new Error('Analysis not found');
      return analysisData as AnalysisResult;
    } catch (error) {
      console.error('[AnalysisService] Error fetching analysis result:', error);
      throw error;
    }
  },

  /**
   * Create a new analysis
   */
  async createAnalysis(imageId: string): Promise<CreateAnalysisResponse> {
    if (isDemoMode()) {
      const demoId = createDemoId('demo');
      console.log('[AnalysisService] Demo mode: Creating mock analysis');
      return {
        success: true,
        data: { analysis: { id: demoId, status: 'processing', createdAt: new Date().toISOString() } },
        message: "Analysis started (Demo Mode)"
      };
    }
    return apiClient.post('/analyses', { imageId });
  },

  /**
   * Delete an analysis
   */
  async deleteAnalysis(id: string): Promise<{ success: boolean; message: string }> {
    if (isDemoMode()) {
      console.log('[AnalysisService] Demo mode: Simulating delete for id:', id);
      return { success: true, message: "Analysis deleted (Demo Mode)" };
    }
    return apiClient.delete(`/analyses/${id}`);
  },

  /**
   * Update analysis status
   */
  async updateAnalysisStatus(id: string, status: string): Promise<AnalysisResult> {
    if (isDemoMode()) {
      return { ...MOCK_ANALYSIS, id, status: status as AnalysisResult['status'] };
    }
    return apiClient.patch(`/analyses/${id}`, { status });
  },

  /**
   * Get user statistics
   */
  async getStatistics(userId: string): Promise<StatisticsResponse> {
    if (isDemoMode()) {
      console.log('[AnalysisService] Demo mode: Returning mock statistics');
      return getDemoStatistics();
    }
    try {
      return await apiClient.get(`/analyses/user/${userId}/statistics`);
    } catch (error) {
      console.error('[AnalysisService] Error fetching statistics:', error);
      throw error;
    }
  },
};
