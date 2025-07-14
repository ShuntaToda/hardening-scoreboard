import { HealthCheckService, WebSocketService } from '../../domain/interfaces/services';
import { WebsiteRepository, ScoreRepository, HealthLogRepository } from '../../domain/interfaces/repositories';
import { Score } from '../../domain/entities/Score';
import { HealthLog } from '../../domain/entities/HealthLog';

export class HealthCheckOrchestrator {
  private intervalId: NodeJS.Timeout | null = null;
  private checkInterval = 60000; // 1 minute
  private concurrency = 5;
  private successPoints = 10;

  constructor(
    private healthCheckService: HealthCheckService,
    private websiteRepository: WebsiteRepository,
    private scoreRepository: ScoreRepository,
    private healthLogRepository: HealthLogRepository,
    private webSocketService: WebSocketService
  ) {}

  async start() {
    console.log('Starting health check orchestrator...');
    await this.runHealthChecks();
    
    this.intervalId = setInterval(() => {
      this.runHealthChecks();
    }, this.checkInterval);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private async runHealthChecks() {
    try {
      const websites = await this.websiteRepository.findAll();
      console.log(`Running health checks for ${websites.length} websites...`);

      // Process websites in batches
      for (let i = 0; i < websites.length; i += this.concurrency) {
        const batch = websites.slice(i, i + this.concurrency);
        await Promise.all(batch.map(website => this.checkWebsite(website)));
      }
    } catch (error) {
      console.error('Error running health checks:', error);
    }
  }

  private async checkWebsite(website: any) {
    try {
      const result = await this.healthCheckService.checkWebsite(website.url);
      
      // Log health check result
      const healthLogData = HealthLog.create(
        website.id,
        result.status,
        result.responseTime,
        result.errorMessage
      );
      await this.healthLogRepository.create(healthLogData);

      // Success: 2xx status codes
      if (result.status >= 200 && result.status < 300) {
        const scoreData = Score.create(
          website.teamId,
          this.successPoints,
          'health_check',
          website.id
        );
        await this.scoreRepository.create(scoreData);

        // Notify WebSocket clients
        await this.webSocketService.broadcastScoreUpdate(website.teamId);
      }
    } catch (error) {
      console.error(`Error checking website ${website.url}:`, error);
    }
  }
}