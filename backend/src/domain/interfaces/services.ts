import { HealthCheckResult } from '../types';

export interface HealthCheckService {
  checkWebsite(url: string): Promise<HealthCheckResult>;
}

export interface WebSocketService {
  broadcastScoreUpdate(teamId?: number): Promise<void>;
}