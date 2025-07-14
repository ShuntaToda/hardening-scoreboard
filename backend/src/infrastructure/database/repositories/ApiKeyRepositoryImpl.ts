import { ApiKey } from '../../../domain/entities/ApiKey';
import { ApiKeyRepository } from '../../../domain/interfaces/repositories';
import { prisma } from '../prisma';

export class ApiKeyRepositoryImpl implements ApiKeyRepository {
  async findAll(): Promise<Omit<ApiKey, 'key'>[]> {
    const apiKeys = await prisma.apiKey.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return apiKeys.map(apiKey => ({
      id: apiKey.id,
      name: apiKey.name,
      expiresAt: apiKey.expiresAt,
      createdAt: apiKey.createdAt
    }));
  }

  async findByKey(key: string): Promise<ApiKey | null> {
    const apiKey = await prisma.apiKey.findUnique({
      where: { key }
    });
    return apiKey ? new ApiKey(
      apiKey.id,
      apiKey.key,
      apiKey.name,
      apiKey.expiresAt,
      apiKey.createdAt
    ) : null;
  }

  async create(apiKeyData: Omit<ApiKey, 'id' | 'createdAt'>): Promise<ApiKey> {
    const apiKey = await prisma.apiKey.create({
      data: {
        key: apiKeyData.key,
        name: apiKeyData.name,
        expiresAt: apiKeyData.expiresAt
      }
    });
    return new ApiKey(
      apiKey.id,
      apiKey.key,
      apiKey.name,
      apiKey.expiresAt,
      apiKey.createdAt
    );
  }

  async delete(id: number): Promise<boolean> {
    try {
      await prisma.apiKey.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}