import { ApiKey } from '../../domain/entities/ApiKey';
import { ApiKeyRepository } from '../../domain/interfaces/repositories';

export class ApiKeyUseCases {
  constructor(private apiKeyRepository: ApiKeyRepository) {}

  async getAllApiKeys(): Promise<Omit<ApiKey, 'key'>[]> {
    return this.apiKeyRepository.findAll();
  }

  async validateApiKey(key: string): Promise<ApiKey | null> {
    const apiKey = await this.apiKeyRepository.findByKey(key);
    if (!apiKey || !apiKey.isValid()) {
      return null;
    }
    return apiKey;
  }

  async createApiKey(name: string, expiresAt?: Date): Promise<ApiKey> {
    if (!name.trim()) {
      throw new Error('API key name is required');
    }

    if (expiresAt && expiresAt <= new Date()) {
      throw new Error('Expiration date must be in the future');
    }

    const apiKeyData = ApiKey.create(name.trim(), expiresAt);
    return this.apiKeyRepository.create(apiKeyData);
  }

  async deleteApiKey(id: number): Promise<boolean> {
    return this.apiKeyRepository.delete(id);
  }
}