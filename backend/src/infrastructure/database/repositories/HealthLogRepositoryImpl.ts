import { HealthLog } from '../../../domain/entities/HealthLog';
import { HealthLogRepository } from '../../../domain/interfaces/repositories';
import { prisma } from '../prisma';

export class HealthLogRepositoryImpl implements HealthLogRepository {
  async findByWebsiteId(websiteId: number, limit: number = 100): Promise<HealthLog[]> {
    const healthLogs = await prisma.healthLog.findMany({
      where: { websiteId },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    return healthLogs.map(log => new HealthLog(
      log.id,
      log.websiteId,
      log.status,
      log.responseTime,
      log.errorMessage,
      log.createdAt
    ));
  }

  async create(healthLogData: Omit<HealthLog, 'id' | 'createdAt'>): Promise<HealthLog> {
    const healthLog = await prisma.healthLog.create({
      data: {
        websiteId: healthLogData.websiteId,
        status: healthLogData.status,
        responseTime: healthLogData.responseTime,
        errorMessage: healthLogData.errorMessage
      }
    });

    return new HealthLog(
      healthLog.id,
      healthLog.websiteId,
      healthLog.status,
      healthLog.responseTime,
      healthLog.errorMessage,
      healthLog.createdAt
    );
  }
}