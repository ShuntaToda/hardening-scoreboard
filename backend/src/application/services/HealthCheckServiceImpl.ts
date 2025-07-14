import { HealthCheckService } from '../../domain/interfaces/services';
import { HealthCheckResult } from '../../domain/types';

export class HealthCheckServiceImpl implements HealthCheckService {
  private readonly timeout = 2000; // 2 seconds

  async checkWebsite(url: string): Promise<HealthCheckResult> {
    const startTime = Date.now();
    let status = 0;
    let errorMessage: string | null = null;
    let responseTime: number | null = null;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        signal: controller.signal,
        method: 'GET',
      });

      clearTimeout(timeoutId);
      
      status = response.status;
      responseTime = Date.now() - startTime;
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'Unknown error';
      status = 0;
    }

    return {
      websiteId: 0, // Will be set by the caller
      status,
      responseTime,
      errorMessage
    };
  }
}