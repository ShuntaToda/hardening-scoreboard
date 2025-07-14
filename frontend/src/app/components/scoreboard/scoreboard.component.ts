import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TeamScore } from '../../models/types';
import { ApiService } from '../../services/api.service';
import { WebSocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-scoreboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="scoreboard">
      <h1>Hardening Scoreboard</h1>
      
      <div class="connection-status" [class.connected]="connected">
        {{ connected ? 'Connected' : 'Disconnected' }}
      </div>

      <div class="leaderboard">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Team</th>
              <th>Score</th>
              <th>Last Update</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let team of teams; let i = index" 
                [class.updated]="team.id === lastUpdatedTeamId">
              <td class="rank">{{ i + 1 }}</td>
              <td class="team-name">{{ team.name }}</td>
              <td class="score">{{ team.total_score }}</td>
              <td class="last-update">
                {{ team.last_update ? (team.last_update | date:'short') : '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .scoreboard {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    h1 {
      text-align: center;
      margin-bottom: 30px;
    }

    .connection-status {
      position: fixed;
      top: 10px;
      right: 10px;
      padding: 5px 15px;
      border-radius: 20px;
      background: #dc3545;
      color: white;
      font-size: 12px;
    }

    .connection-status.connected {
      background: #28a745;
    }

    .leaderboard {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      background: #f8f9fa;
      padding: 15px;
      text-align: left;
      font-weight: 600;
      border-bottom: 2px solid #dee2e6;
    }

    td {
      padding: 15px;
      border-bottom: 1px solid #dee2e6;
    }

    tr:last-child td {
      border-bottom: none;
    }

    tr.updated {
      animation: highlight 1s ease-in-out;
    }

    @keyframes highlight {
      0% { background-color: #ffc107; }
      100% { background-color: transparent; }
    }

    .rank {
      font-weight: bold;
      width: 60px;
    }

    .score {
      font-weight: 600;
      font-size: 18px;
      color: #007bff;
    }

    .last-update {
      color: #6c757d;
      font-size: 14px;
    }
  `]
})
export class ScoreboardComponent implements OnInit, OnDestroy {
  teams: TeamScore[] = [];
  connected = false;
  lastUpdatedTeamId: number | null = null;
  
  private subscriptions = new Subscription();

  constructor(
    private apiService: ApiService,
    private wsService: WebSocketService
  ) {}

  ngOnInit() {
    // Load initial data
    this.loadLeaderboard();

    // Subscribe to WebSocket updates
    this.subscriptions.add(
      this.wsService.getScoreUpdates().subscribe(teams => {
        this.teams = teams;
        // Highlight the updated team briefly
        if (teams.length > 0) {
          const latestTeam = teams.reduce((prev, current) => 
            (prev.last_update || 0) > (current.last_update || 0) ? prev : current
          );
          this.lastUpdatedTeamId = latestTeam.id;
          setTimeout(() => this.lastUpdatedTeamId = null, 1000);
        }
      })
    );

    // Monitor connection status
    this.subscriptions.add(
      this.wsService.getConnectionStatus().subscribe(status => {
        this.connected = status;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private loadLeaderboard() {
    this.apiService.getLeaderboard().subscribe(teams => {
      this.teams = teams;
    });
  }
}