/**
 * API Types for MedAIx
 * Type definitions for API responses and data structures
 */

// Generic API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Paginated response
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Analysis Result types
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

export interface QualityMetrics {
  imageQuality: number;
  completeness: number;
  clarity: number;
  artifactLevel: 'none' | 'minimal' | 'moderate' | 'severe';
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

export interface SecondaryVerificationResult {
  verifiedBy: string;
  verificationTime: string;
  confidenceAdjustment: number;
  notes: string;
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

// Image types
export interface Image {
  id: string;
  fileName: string;
  originalFileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  width?: number;
  height?: number;
  imageType: string;
  analysisStatus: string;
  tags: string[];
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  lastLoginAt?: string;
}

// Project types
export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
}

