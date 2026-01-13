import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { prisma } from '../server';
import { getAnalysisResult } from '../services/inference';

const router = express.Router();

// Mock analyses data - maintaining compatibility with existing localStorage structure
const mockAnalyses = [
  {
    id: 'analysis-1',
    projectId: 'project-1',
    imageId: 'image-1',
    analystId: 'user-123',
    analysisType: 'medical_imaging',
    status: 'completed',
    confidenceScore: 0.92,
    processingTimeSeconds: 45,
    algorithmVersion: 'v2.1.0',
    modelUsed: 'MedAIx-CNN-v3',
    findings: [
      {
        description: 'Normal anatomical structures observed',
        confidence: 0.95,
        region: 'chest',
        severity: 'normal'
      },
      {
        description: 'No acute abnormalities detected',
        confidence: 0.88,
        region: 'cardiac',
        severity: 'normal'
      }
    ],
    recommendations: [
      'Routine follow-up recommended',
      'No immediate intervention required'
    ],
    differentialDiagnosis: [
      {
        condition: 'Normal variant',
        probability: 0.85
      },
      {
        condition: 'Benign finding',
        probability: 0.12
      },
      {
        condition: 'Pathologic finding',
        probability: 0.03
      }
    ],
    qualityMetrics: {
      imageQuality: 0.95,
      completeness: 0.98,
      clarity: 0.92
    },
    reviewRequired: false,
    reviewedById: null,
    reviewedAt: null,
    reviewNotes: null,
    approvedById: null,
    approvedAt: null,
    metadata: {
      processingNode: 'medaix-cluster-1',
      gpuUsed: 'NVIDIA-V100',
      batchId: 'batch-2024-001'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// @route   GET /api/analyses
// @desc    Get analyses with filtering and pagination
// @access  Private
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const {
    projectId,
    imageId,
    analystId,
    status,
    analysisType,
    startDate,
    endDate,
    minConfidence,
    maxConfidence,
    page = 1,
    limit = 20
  } = req.query;

  // Build where clause for filtering
  const where: any = {};

  if (projectId) {
    where.projectId = projectId;
  }

  if (imageId) {
    where.imageId = imageId;
  }

  if (analystId) {
    where.analystId = analystId;
  }

  if (status) {
    where.status = status;
  }

  if (analysisType) {
    where.analysisType = analysisType;
  }

  if (minConfidence || maxConfidence) {
    where.confidenceScore = {};
    if (minConfidence) {
      where.confidenceScore.gte = parseFloat(minConfidence as string);
    }
    if (maxConfidence) {
      where.confidenceScore.lte = parseFloat(maxConfidence as string);
    }
  }

  // Date range filtering
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) {
      where.createdAt.gte = new Date(startDate as string);
    }
    if (endDate) {
      where.createdAt.lte = new Date(endDate as string);
    }
  }

  // Get total count for pagination
  const total = await prisma.researchAnalysis.count({ where });

  // Get paginated results
  const analyses = await prisma.researchAnalysis.findMany({
    where,
    include: {
      image: {
        select: {
          originalFileName: true,
          fileSize: true,
          mimeType: true,
          imageType: true,
          createdAt: true
        }
      },
      analyst: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true
        }
      },
      project: {
        select: {
          id: true,
          name: true,
          description: true
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    skip: (parseInt(page as string) - 1) * parseInt(limit as string),
    take: parseInt(limit as string)
  });

  // Calculate summary statistics
  const completedAnalyses = analyses.filter(a => a.status === 'completed');
  const successRate = analyses.length > 0
    ? (completedAnalyses.length / analyses.length) * 100
    : 0;

  const avgConfidence = completedAnalyses.length > 0
    ? completedAnalyses.reduce((sum, a) => sum + (a.confidenceScore ? Number(a.confidenceScore) : 0), 0) / completedAnalyses.length
    : 0;

  // Transform analyses to include full result data
  const transformedAnalyses = await Promise.all(
    analyses.map(async (analysis) => {
      const fullResult = await getAnalysisResult(analysis.imageId);
      return {
        ...analysis,
        ...fullResult,
        createdAt: analysis.createdAt,
        updatedAt: analysis.updatedAt
      };
    })
  );

  res.json({
    success: true,
    data: {
      analyses: transformedAnalyses,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      },
      summary: {
        totalAnalyses: total,
        completedAnalyses: completedAnalyses.length,
        pendingAnalyses: analyses.filter(a => a.status === 'pending').length,
        failedAnalyses: analyses.filter(a => a.status === 'failed').length,
        successRate: Math.round(successRate * 100) / 100,
        avgConfidence: Math.round(avgConfidence * 100) / 100
      }
    }
  });
}));

// @route   POST /api/analyses
// @desc    Create new analysis
// @access  Private
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const {
    projectId,
    imageId,
    analystId,
    analysisType = 'medical_imaging',
    algorithmVersion,
    modelUsed
  } = req.body;

  if (!imageId || !analystId) {
    throw createError('Image ID and Analyst ID are required', 400);
  }

  const newAnalysis = {
    id: `analysis-${Date.now()}`,
    projectId: projectId || null,
    imageId,
    analystId,
    analysisType,
    status: 'pending' as const,
    confidenceScore: null,
    processingTimeSeconds: null,
    algorithmVersion: algorithmVersion || null,
    modelUsed: modelUsed || null,
    findings: [],
    recommendations: [],
    differentialDiagnosis: [],
    severityAssessment: null,
    regionsOfInterest: null,
    qualityMetrics: null,
    errorMessage: null,
    reviewRequired: false,
    reviewedById: null,
    reviewedAt: null,
    reviewNotes: null,
    approvedById: null,
    approvedAt: null,
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // In production, save to database and queue for processing
  mockAnalyses.push(newAnalysis);

  res.status(201).json({
    success: true,
    data: {
      analysis: newAnalysis,
      message: 'Analysis created successfully'
    }
  });
}));

// @route   GET /api/analyses/image/:id
// @desc    Get analysis result by image ID
// @access  Private
router.get('/image/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Try to get from database first
  const dbAnalysis = await prisma.researchAnalysis.findFirst({
    where: { imageId: id },
    include: {
      image: {
        select: {
          originalFileName: true,
          fileSize: true,
          mimeType: true,
          imageType: true,
          createdAt: true
        }
      },
      analyst: {
        select: {
          id: true,
          email: true,
          name: true
        }
      }
    }
  });

  if (dbAnalysis) {
    // Transform database result to match frontend expectations
    const result = {
      id: dbAnalysis.id,
      status: dbAnalysis.status,
      image: dbAnalysis.image ? {
        id: dbAnalysis.imageId,
        fileName: dbAnalysis.image.originalFileName || 'Unknown',
        imageType: dbAnalysis.image.imageType || 'standard'
      } : undefined,
      findings: Array.isArray(dbAnalysis.findings) ? dbAnalysis.findings : [],
      confidence: dbAnalysis.confidenceScore ? Number(dbAnalysis.confidenceScore) : 0,
      createdAt: dbAnalysis.createdAt.toISOString(),
      completedAt: dbAnalysis.updatedAt.toISOString(),
      error: dbAnalysis.errorMessage || undefined
    };

    res.json({
      success: true,
      data: {
        analysis: result
      }
    });
    return;
  }

  // Fallback to mock data if not found in database
  const mockAnalysis = mockAnalyses.find(a => a.id === id);

  if (!mockAnalysis) {
    throw createError('Analysis not found', 404);
  }

  res.json(mockAnalysis);
}));

// @route   GET /api/analyses/:id
// @desc    Get specific analysis by analysis ID
// @access  Private
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Try to get from database first
  const dbAnalysis = await prisma.researchAnalysis.findUnique({
    where: { id },
    include: {
      image: {
        select: {
          originalFileName: true,
          fileSize: true,
          mimeType: true,
          imageType: true,
          createdAt: true
        }
      },
      analyst: {
        select: {
          id: true,
          email: true,
          name: true
        }
      }
    }
  });

  if (dbAnalysis) {
    // Transform database result to match frontend expectations
    const result = {
      id: dbAnalysis.id,
      status: dbAnalysis.status,
      image: dbAnalysis.image ? {
        id: dbAnalysis.imageId,
        fileName: dbAnalysis.image.originalFileName || 'Unknown',
        imageType: dbAnalysis.image.imageType || 'standard'
      } : undefined,
      findings: Array.isArray(dbAnalysis.findings) ? dbAnalysis.findings : [],
      confidence: dbAnalysis.confidenceScore ? Number(dbAnalysis.confidenceScore) : 0,
      createdAt: dbAnalysis.createdAt.toISOString(),
      completedAt: dbAnalysis.updatedAt.toISOString(),
      error: dbAnalysis.errorMessage || undefined
    };

    res.json({
      success: true,
      data: {
        analysis: result
      }
    });
    return;
  }

  // Fallback to mock data
  const analysis = mockAnalyses.find(a => a.id === id);

  if (!analysis) {
    throw createError('Analysis not found', 404);
  }

  res.json({
    success: true,
    data: {
      analysis
    }
  });
}));

// @route   PATCH /api/analyses/:id
// @desc    Update analysis
// @access  Private
router.patch('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const analysisIndex = mockAnalyses.findIndex(a => a.id === id);

  if (analysisIndex === -1) {
    throw createError('Analysis not found', 404);
  }

  // Update analysis
  mockAnalyses[analysisIndex] = {
    ...mockAnalyses[analysisIndex],
    ...updates,
    updatedAt: new Date()
  };

  res.json({
    success: true,
    data: {
      analysis: mockAnalyses[analysisIndex]
    }
  });
}));

// @route   POST /api/analyses/:id/complete
// @desc    Mark analysis as completed with results
// @access  Private
router.post('/:id/complete', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    findings,
    recommendations,
    differentialDiagnosis,
    confidenceScore,
    processingTimeSeconds,
    qualityMetrics
  } = req.body;

  const analysisIndex = mockAnalyses.findIndex(a => a.id === id);

  if (analysisIndex === -1) {
    throw createError('Analysis not found', 404);
  }

  // Update analysis with completion data
  mockAnalyses[analysisIndex] = {
    ...mockAnalyses[analysisIndex],
    status: 'completed',
    findings: findings || [],
    recommendations: recommendations || [],
    differentialDiagnosis: differentialDiagnosis || [],
    confidenceScore: confidenceScore || null,
    processingTimeSeconds: processingTimeSeconds || null,
    qualityMetrics: qualityMetrics || null,
    updatedAt: new Date()
  };

  res.json({
    success: true,
    data: {
      analysis: mockAnalyses[analysisIndex],
      message: 'Analysis completed successfully'
    }
  });
}));

// @route   POST /api/analyses/:id/fail
// @desc    Mark analysis as failed
// @access  Private
router.post('/:id/fail', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { errorMessage } = req.body;

  const analysisIndex = mockAnalyses.findIndex(a => a.id === id);

  if (analysisIndex === -1) {
    throw createError('Analysis not found', 404);
  }

  // Update analysis as failed
  mockAnalyses[analysisIndex] = {
    ...mockAnalyses[analysisIndex],
    status: 'failed',
    errorMessage: errorMessage || 'Analysis failed',
    updatedAt: new Date()
  };

  res.json({
    success: true,
    data: {
      analysis: mockAnalyses[analysisIndex],
      message: 'Analysis marked as failed'
    }
  });
}));

// @route   GET /api/analyses/user/:userId/statistics
// @desc    Get user analysis statistics (maintaining compatibility with localStorage structure)
// @access  Private
router.get('/user/:userId/statistics', asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const userAnalyses = mockAnalyses.filter(a => a.analystId === userId);

  const totalAnalyses = userAnalyses.length;
  const completedAnalyses = userAnalyses.filter(a => a.status === 'completed').length;
  const failedAnalyses = userAnalyses.filter(a => a.status === 'failed').length;
  
  const successRate = totalAnalyses > 0 
    ? (completedAnalyses / totalAnalyses) * 100 
    : 0;

  // Count analyses this month
  const now = new Date();
  const thisMonth = userAnalyses.filter(a => {
    const analysisDate = new Date(a.createdAt);
    return analysisDate.getMonth() === now.getMonth() &&
           analysisDate.getFullYear() === now.getFullYear();
  }).length;

  // Average confidence from completed analyses
  const completedWithConfidence = userAnalyses.filter(a => 
    a.status === 'completed' && a.confidenceScore !== null
  );
  const avgConfidence = completedWithConfidence.length > 0
    ? completedWithConfidence.reduce((sum, a) => sum + (a.confidenceScore || 0), 0) / completedWithConfidence.length
    : 0;

  // Calculate confidence percentage (0-100 scale)
  const avgConfidencePercent = Math.round(avgConfidence * 10000) / 100; // Convert to percentage

  // Mock project count (would query projects table in production)
  const totalProjects = 1;
  const activeProjects = 1;
  const completedProjects = 0;

  const statistics = {
    totalAnalyses,
    successRate: Math.round(successRate * 100) / 100,
    thisMonth,
    avgConfidence: avgConfidencePercent,
    // Additional fields for compatibility
    totalProjects,
    activeProjects,
    completedProjects,
    failedAnalyses,
    lastActive: new Date(),
    memberSince: new Date('2024-01-01') // Would come from user record
  };

  res.json({
    success: true,
    data: {
      statistics
    }
  });
}));

// @route   DELETE /api/analyses/:id
// @desc    Delete analysis
// @access  Private
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const analysisIndex = mockAnalyses.findIndex(a => a.id === id);

  if (analysisIndex === -1) {
    throw createError('Analysis not found', 404);
  }

  // In production, also delete associated files and data
  mockAnalyses.splice(analysisIndex, 1);

  res.json({
    success: true,
    message: 'Analysis deleted successfully'
  });
}));

export default router;
