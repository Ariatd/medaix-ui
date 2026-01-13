import { type Analysis } from './analysisUtils';

const SAMPLE_IMAGE_NAMES = [
  'Brain_MRI_001.dcm',
  'Chest_XRay_002.jpg',
  'Lung_CT_003.dcm',
  'Abdomen_CT_004.dcm',
  'Cardiac_MRI_005.dcm',
  'Brain_CT_006.dcm',
  'Spine_MRI_007.dcm',
  'Knee_XRay_008.jpg',
  'Pelvis_CT_009.dcm',
  'Shoulder_MRI_010.dcm',
  'Hand_XRay_011.jpg',
  'Ankle_CT_012.dcm',
  'Hip_MRI_013.dcm',
  'Liver_Ultrasound_014.jpg',
  'Brain_Tumor_015.dcm',
];

const REGIONS = [
  'Brain',
  'Chest',
  'Abdomen',
  'Spine',
  'Pelvis',
  'Cardiac',
  'Extremity',
  'Lung',
  'Liver',
  'Kidney',
];

const MODALITIES = [
  'MRI',
  'CT',
  'X-Ray',
  'Ultrasound',
  'PET',
  'SPECT',
];

const SAMPLE_RESULTS = [
  'Normal',
  'Abnormal Finding',
  'Suspicious Region',
  'Needs Further Review',
  'Clear',
  'Dense Tissue',
  'Atypical Pattern',
];

const SAMPLE_FINDINGS = [
  ['No acute abnormality', 'Normal anatomical structures'],
  ['Subtle opacity noted', 'Requires clinical correlation'],
  ['Enlarged area detected', 'Recommend follow-up imaging'],
  ['Calcifications present', 'Benign appearance'],
  ['Fluid collection observed', 'Stable configuration'],
];

const SAMPLE_DIFFERENTIAL = [
  [
    { condition: 'Normal Variant', probability: 85 },
    { condition: 'Benign Process', probability: 10 },
    { condition: 'Pathologic Finding', probability: 5 },
  ],
  [
    { condition: 'Infection', probability: 60 },
    { condition: 'Inflammation', probability: 25 },
    { condition: 'Neoplasm', probability: 15 },
  ],
  [
    { condition: 'Trauma', probability: 70 },
    { condition: 'Degenerative', probability: 20 },
    { condition: 'Metabolic', probability: 10 },
  ],
];

/**
 * Generate a single mock analysis
 */
function generateMockAnalysis(daysAgo: number): Analysis {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

  const confidence = Math.floor(Math.random() * 26) + 70; // 70-95%

  return {
    id: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    date: date.toISOString(),
    imageName: SAMPLE_IMAGE_NAMES[Math.floor(Math.random() * SAMPLE_IMAGE_NAMES.length)],
    result: SAMPLE_RESULTS[Math.floor(Math.random() * SAMPLE_RESULTS.length)],
    confidence,
    region: REGIONS[Math.floor(Math.random() * REGIONS.length)],
    modality: MODALITIES[Math.floor(Math.random() * MODALITIES.length)],
    findings: SAMPLE_FINDINGS[Math.floor(Math.random() * SAMPLE_FINDINGS.length)],
    differentialDiagnosis: SAMPLE_DIFFERENTIAL[Math.floor(Math.random() * SAMPLE_DIFFERENTIAL.length)],
  };
}

/**
 * Generate mock data and initialize localStorage if needed
 */
export const initializeMockData = (): void => {
  const ANALYSES_KEY = 'medaix_analyses';
  const existing = localStorage.getItem(ANALYSES_KEY);

  // Only initialize if no data exists
  if (!existing) {
    const mockAnalyses: Analysis[] = [];

    // Generate 15 analyses over the last 30 days
    for (let i = 0; i < 15; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      mockAnalyses.push(generateMockAnalysis(daysAgo));
    }

    // Sort by date descending (most recent first)
    mockAnalyses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    localStorage.setItem(ANALYSES_KEY, JSON.stringify(mockAnalyses));
  }
};

/**
 * Add a new analysis from the upload flow
 */
export const addAnalysisFromUpload = (imageName: string, jobId: string): Analysis => {
  const now = new Date().toISOString();
  const confidence = Math.floor(Math.random() * 26) + 70; // 70-95%

  const analysis: Analysis = {
    id: jobId,
    date: now,
    imageName,
    result: SAMPLE_RESULTS[Math.floor(Math.random() * SAMPLE_RESULTS.length)],
    confidence,
    region: REGIONS[Math.floor(Math.random() * REGIONS.length)],
    modality: MODALITIES[Math.floor(Math.random() * MODALITIES.length)],
    findings: SAMPLE_FINDINGS[Math.floor(Math.random() * SAMPLE_FINDINGS.length)],
    differentialDiagnosis: SAMPLE_DIFFERENTIAL[Math.floor(Math.random() * SAMPLE_DIFFERENTIAL.length)],
  };

  const ANALYSES_KEY = 'medaix_analyses';
  const analyses = JSON.parse(localStorage.getItem(ANALYSES_KEY) || '[]');
  analyses.unshift(analysis);
  localStorage.setItem(ANALYSES_KEY, JSON.stringify(analyses));

  return analysis;
};
