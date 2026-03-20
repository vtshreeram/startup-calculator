export const features = {
  aiEvaluation: true,
  teamAnalysis: true,
  equityCalculator: true,
  mobileResponsive: true,
};

export const config = {
  apiBaseUrl: process.env.VITE_API_URL || 'http://localhost:3001/api',
  geminiTemperature: 0.3,
  cacheTtlMinutes: 15,
};

export function isFeatureEnabled(feature: keyof typeof features): boolean {
  return features[feature];
}
