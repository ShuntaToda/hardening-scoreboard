import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Team, Website, ApiKey } from '../../models/types';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-panel">
      <h1>Admin Panel</h1>

      <div class="tabs">
        <button [class.active]="activeTab === 'teams'" (click)="activeTab = 'teams'">Teams</button>
        <button [class.active]="activeTab === 'websites'" (click)="activeTab = 'websites'">Websites</button>
        <button [class.active]="activeTab === 'api-keys'" (click)="activeTab = 'api-keys'">API Keys</button>
      </div>

      <!-- Teams Tab -->
      <div class="tab-content" *ngIf="activeTab === 'teams'">
        <div class="add-form">
          <h3>Add Team</h3>
          <input [(ngModel)]="newTeamName" placeholder="Team name" />
          <button (click)="addTeam()">Add</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Score</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let team of teams">
              <td>{{ team.id }}</td>
              <td>{{ team.name }}</td>
              <td>{{ team.total_score || 0 }}</td>
              <td>
                <button (click)="deleteTeam(team.id)" class="delete-btn">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Websites Tab -->
      <div class="tab-content" *ngIf="activeTab === 'websites'">
        <div class="add-form">
          <h3>Add Website</h3>
          <select [(ngModel)]="newWebsite.team_id">
            <option value="">Select team</option>
            <option *ngFor="let team of teams" [value]="team.id">{{ team.name }}</option>
          </select>
          <input [(ngModel)]="newWebsite.name" placeholder="Website name" />
          <input [(ngModel)]="newWebsite.url" placeholder="URL" />
          <button (click)="addWebsite()">Add</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Team</th>
              <th>Name</th>
              <th>URL</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let website of websites">
              <td>{{ website.id }}</td>
              <td>{{ website.team_name }}</td>
              <td>{{ website.name }}</td>
              <td><a [href]="website.url" target="_blank">{{ website.url }}</a></td>
              <td>
                <button (click)="deleteWebsite(website.id)" class="delete-btn">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- API Keys Tab -->
      <div class="tab-content" *ngIf="activeTab === 'api-keys'">
        <div class="add-form">
          <h3>Create API Key</h3>
          <input [(ngModel)]="newApiKeyName" placeholder="API Key name" />
          <button (click)="createApiKey()">Create</button>
        </div>

        <div class="api-key-created" *ngIf="createdApiKey">
          <p><strong>API Key Created!</strong></p>
          <p>Key: <code>{{ createdApiKey }}</code></p>
          <p class="warning">Save this key now. You won't be able to see it again.</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Created At</th>
              <th>Expires At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let key of apiKeys">
              <td>{{ key.id }}</td>
              <td>{{ key.name }}</td>
              <td>{{ key.created_at | date:'short' }}</td>
              <td>{{ key.expires_at ? (key.expires_at | date:'short') : 'Never' }}</td>
              <td>
                <button (click)="deleteApiKey(key.id)" class="delete-btn">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .admin-panel {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    h1 {
      margin-bottom: 30px;
    }

    .tabs {
      display: flex;
      gap: 10px;
      margin-bottom: 30px;
    }

    .tabs button {
      padding: 10px 20px;
      border: 1px solid #ddd;
      background: white;
      cursor: pointer;
      border-radius: 4px;
    }

    .tabs button.active {
      background: #007bff;
      color: white;
      border-color: #007bff;
    }

    .tab-content {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .add-form {
      margin-bottom: 30px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .add-form h3 {
      margin-top: 0;
    }

    .add-form input, .add-form select {
      padding: 8px 12px;
      margin-right: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .add-form button {
      padding: 8px 20px;
      background: #28a745;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      background: #f8f9fa;
      padding: 12px;
      text-align: left;
      border-bottom: 2px solid #dee2e6;
    }

    td {
      padding: 12px;
      border-bottom: 1px solid #dee2e6;
    }

    .delete-btn {
      padding: 5px 15px;
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .api-key-created {
      margin: 20px 0;
      padding: 15px;
      background: #d4edda;
      border: 1px solid #c3e6cb;
      border-radius: 4px;
    }

    .api-key-created code {
      background: #fff;
      padding: 5px;
      border-radius: 3px;
      font-family: monospace;
    }

    .warning {
      color: #721c24;
      font-weight: bold;
    }
  `]
})
export class AdminComponent implements OnInit {
  activeTab: 'teams' | 'websites' | 'api-keys' = 'teams';
  
  teams: Team[] = [];
  websites: Website[] = [];
  apiKeys: ApiKey[] = [];
  
  newTeamName = '';
  newWebsite = { team_id: '', name: '', url: '' };
  newApiKeyName = '';
  createdApiKey: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadTeams();
    this.loadWebsites();
    this.loadApiKeys();
  }

  loadTeams() {
    this.apiService.getTeams().subscribe(teams => {
      this.teams = teams;
    });
  }

  loadWebsites() {
    this.apiService.getWebsites().subscribe(websites => {
      this.websites = websites;
    });
  }

  loadApiKeys() {
    this.apiService.getApiKeys().subscribe(keys => {
      this.apiKeys = keys;
    });
  }

  addTeam() {
    if (!this.newTeamName.trim()) return;
    
    this.apiService.createTeam({ name: this.newTeamName }).subscribe(() => {
      this.newTeamName = '';
      this.loadTeams();
    });
  }

  deleteTeam(id: number) {
    if (confirm('Are you sure you want to delete this team?')) {
      this.apiService.deleteTeam(id).subscribe(() => {
        this.loadTeams();
      });
    }
  }

  addWebsite() {
    const teamId = parseInt(this.newWebsite.team_id);
    if (!teamId || !this.newWebsite.name.trim() || !this.newWebsite.url.trim()) return;
    
    this.apiService.createWebsite({
      team_id: teamId,
      name: this.newWebsite.name,
      url: this.newWebsite.url
    }).subscribe(() => {
      this.newWebsite = { team_id: '', name: '', url: '' };
      this.loadWebsites();
    });
  }

  deleteWebsite(id: number) {
    if (confirm('Are you sure you want to delete this website?')) {
      this.apiService.deleteWebsite(id).subscribe(() => {
        this.loadWebsites();
      });
    }
  }

  createApiKey() {
    if (!this.newApiKeyName.trim()) return;
    
    this.apiService.createApiKey({ name: this.newApiKeyName }).subscribe(key => {
      this.createdApiKey = key.key || null;
      this.newApiKeyName = '';
      this.loadApiKeys();
      
      // Clear the displayed key after 30 seconds
      setTimeout(() => {
        this.createdApiKey = null;
      }, 30000);
    });
  }

  deleteApiKey(id: number) {
    if (confirm('Are you sure you want to delete this API key?')) {
      this.apiService.deleteApiKey(id).subscribe(() => {
        this.loadApiKeys();
      });
    }
  }
}