export interface Team {
  id: number;
  name: string;
  created_at: Date;
  total_score?: number;
}

export interface Website {
  id: number;
  team_id: number;
  url: string;
  name: string;
  created_at: Date;
  team_name?: string;
}

export interface Score {
  id: number;
  team_id: number;
  website_id: number | null;
  points: number;
  source: 'health_check' | 'external_api';
  created_at: Date;
  team_name?: string;
  website_name?: string;
}

export interface ApiKey {
  id: number;
  name: string;
  expires_at: Date | null;
  created_at: Date;
  key?: string;
}

export interface TeamScore {
  id: number;
  name: string;
  total_score: number;
  score_count: number;
  last_update: Date | null;
}