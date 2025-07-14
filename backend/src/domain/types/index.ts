export type Source = 'health_check' | 'external_api';

export interface TeamScore {
  id: number;
  name: string;
  totalScore: number;
  scoreCount: number;
  lastUpdate: Date | null;
}

export interface HealthCheckResult {
  websiteId: number;
  status: number;
  responseTime: number | null;
  errorMessage: string | null;
}