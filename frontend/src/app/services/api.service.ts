import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Team, Website, Score, ApiKey, TeamScore } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  // Teams
  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.apiUrl}/teams`);
  }

  getTeam(id: number): Observable<Team> {
    return this.http.get<Team>(`${this.apiUrl}/teams/${id}`);
  }

  createTeam(team: { name: string }): Observable<Team> {
    return this.http.post<Team>(`${this.apiUrl}/teams`, team);
  }

  updateTeam(id: number, team: { name: string }): Observable<Team> {
    return this.http.put<Team>(`${this.apiUrl}/teams/${id}`, team);
  }

  deleteTeam(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/teams/${id}`);
  }

  // Websites
  getWebsites(): Observable<Website[]> {
    return this.http.get<Website[]>(`${this.apiUrl}/websites`);
  }

  getWebsitesByTeam(teamId: number): Observable<Website[]> {
    return this.http.get<Website[]>(`${this.apiUrl}/websites/team/${teamId}`);
  }

  createWebsite(website: { team_id: number; url: string; name: string }): Observable<Website> {
    return this.http.post<Website>(`${this.apiUrl}/websites`, website);
  }

  updateWebsite(id: number, website: { team_id: number; url: string; name: string }): Observable<Website> {
    return this.http.put<Website>(`${this.apiUrl}/websites/${id}`, website);
  }

  deleteWebsite(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/websites/${id}`);
  }

  // Scores
  getScores(teamId?: number, limit: number = 100): Observable<Score[]> {
    let url = `${this.apiUrl}/scores?limit=${limit}`;
    if (teamId) {
      url += `&team_id=${teamId}`;
    }
    return this.http.get<Score[]>(url);
  }

  getLeaderboard(): Observable<TeamScore[]> {
    return this.http.get<TeamScore[]>(`${this.apiUrl}/scores/leaderboard`);
  }

  // API Keys
  getApiKeys(): Observable<ApiKey[]> {
    return this.http.get<ApiKey[]>(`${this.apiUrl}/api-keys`);
  }

  createApiKey(apiKey: { name: string; expires_at?: string }): Observable<ApiKey> {
    return this.http.post<ApiKey>(`${this.apiUrl}/api-keys`, apiKey);
  }

  deleteApiKey(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api-keys/${id}`);
  }
}