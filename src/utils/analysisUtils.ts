export interface Analysis {
  id: string;
  date: string;
  imageName: string;
  result: string;
  confidence: number;
  region: string;
  modality: string;
  findings: string[];
  differentialDiagnosis: { condition: string; probability: number }[];
}

const ANALYSES_KEY = 'medaix_analyses';

export const saveAnalysis = (analysis: Analysis): void => {
  const analyses = getAnalyses();
  analyses.unshift(analysis);
  localStorage.setItem(ANALYSES_KEY, JSON.stringify(analyses));
};

export const getAnalyses = (): Analysis[] => {
  const stored = localStorage.getItem(ANALYSES_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const getAnalysisById = (id: string): Analysis | undefined => {
  const analyses = getAnalyses();
  return analyses.find(a => a.id === id);
};

export const deleteAnalysis = (id: string): void => {
  const analyses = getAnalyses();
  const filtered = analyses.filter(a => a.id !== id);
  localStorage.setItem(ANALYSES_KEY, JSON.stringify(filtered));
};

export const filterAnalyses = (
  analyses: Analysis[],
  searchTerm: string = '',
  filters: {
    startDate?: string;
    endDate?: string;
    resultType?: string;
    minConfidence?: number;
    maxConfidence?: number;
  } = {}
): Analysis[] => {
  return analyses.filter(analysis => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        analysis.imageName.toLowerCase().includes(term) ||
        analysis.result.toLowerCase().includes(term) ||
        analysis.region.toLowerCase().includes(term);

      if (!matchesSearch) return false;
    }

    if (filters.startDate) {
      const analysisDate = new Date(analysis.date);
      const startDate = new Date(filters.startDate);
      if (analysisDate < startDate) return false;
    }

    if (filters.endDate) {
      const analysisDate = new Date(analysis.date);
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      if (analysisDate > endDate) return false;
    }

    if (filters.resultType && analysis.result !== filters.resultType) {
      return false;
    }

    if (filters.minConfidence !== undefined && analysis.confidence < filters.minConfidence) {
      return false;
    }

    if (filters.maxConfidence !== undefined && analysis.confidence > filters.maxConfidence) {
      return false;
    }

    return true;
  });
};

export const exportToCSV = (analyses: Analysis[]): string => {
  if (analyses.length === 0) {
    return 'No analyses to export';
  }

  const headers = ['ID', 'Date', 'Image Name', 'Result', 'Confidence (%)', 'Region', 'Modality'];
  const rows = analyses.map(a => [
    a.id,
    new Date(a.date).toLocaleString(),
    a.imageName,
    a.result,
    a.confidence.toString(),
    a.region,
    a.modality,
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  return csv;
};

export const downloadCSV = (csv: string, filename: string = 'analyses.csv'): void => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getStatistics = (analyses: Analysis[]) => {
  const total = analyses.length;
  const thisMonth = analyses.filter(a => {
    const analysisDate = new Date(a.date);
    const now = new Date();
    return (
      analysisDate.getMonth() === now.getMonth() &&
      analysisDate.getFullYear() === now.getFullYear()
    );
  }).length;

  const avgConfidence = total > 0
    ? Math.round(analyses.reduce((sum, a) => sum + a.confidence, 0) / total)
    : 0;

  const successRate = 95;

  return {
    totalAnalyses: total,
    thisMonthAnalyses: thisMonth,
    successRate,
    avgConfidence,
  };
};

export const getAnalysesLastDays = (days: number = 7): { date: string; count: number }[] => {
  const analyses = getAnalyses();
  const grouped: { [key: string]: number } = {};

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    grouped[dateStr] = 0;
  }

  analyses.forEach(analysis => {
    const dateStr = analysis.date.split('T')[0];
    if (grouped[dateStr] !== undefined) {
      grouped[dateStr]++;
    }
  });

  return Object.entries(grouped).map(([date, count]) => ({ date, count }));
};

export const getResultDistribution = (): { result: string; count: number }[] => {
  const analyses = getAnalyses();
  const distribution: { [key: string]: number } = {};

  analyses.forEach(analysis => {
    distribution[analysis.result] = (distribution[analysis.result] || 0) + 1;
  });

  return Object.entries(distribution).map(([result, count]) => ({ result, count }));
};
