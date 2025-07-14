import { Team } from '../entities/Team';
import { Website } from '../entities/Website';
import { Score } from '../entities/Score';
import { ApiKey } from '../entities/ApiKey';
import { HealthLog } from '../entities/HealthLog';
import { TeamScore } from '../types';

export interface TeamRepository {
  findAll(): Promise<Team[]>;
  findById(id: number): Promise<Team | null>;
  create(team: Omit<Team, 'id' | 'createdAt'>): Promise<Team>;
  update(id: number, team: Partial<Omit<Team, 'id' | 'createdAt'>>): Promise<Team | null>;
  delete(id: number): Promise<boolean>;
  getTeamScores(): Promise<TeamScore[]>;
}

export interface WebsiteRepository {
  findAll(): Promise<Website[]>;
  findById(id: number): Promise<Website | null>;
  findByTeamId(teamId: number): Promise<Website[]>;
  create(website: Omit<Website, 'id' | 'createdAt'>): Promise<Website>;
  update(id: number, website: Partial<Omit<Website, 'id' | 'createdAt'>>): Promise<Website | null>;
  delete(id: number): Promise<boolean>;
}

export interface ScoreRepository {
  findAll(limit?: number, teamId?: number): Promise<Score[]>;
  findById(id: number): Promise<Score | null>;
  findByTeamId(teamId: number, limit?: number): Promise<Score[]>;
  create(score: Omit<Score, 'id' | 'createdAt'>): Promise<Score>;
  getLeaderboard(): Promise<TeamScore[]>;
}

export interface ApiKeyRepository {
  findAll(): Promise<Omit<ApiKey, 'key'>[]>;
  findByKey(key: string): Promise<ApiKey | null>;
  create(apiKey: Omit<ApiKey, 'id' | 'createdAt'>): Promise<ApiKey>;
  delete(id: number): Promise<boolean>;
}

export interface HealthLogRepository {
  findByWebsiteId(websiteId: number, limit?: number): Promise<HealthLog[]>;
  create(healthLog: Omit<HealthLog, 'id' | 'createdAt'>): Promise<HealthLog>;
}