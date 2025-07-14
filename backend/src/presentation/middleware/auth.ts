import { Context, Next } from 'hono';
import { ApiKeyUseCases } from '../../application/usecases/ApiKeyUseCases';

export function createApiKeyAuth(apiKeyUseCases: ApiKeyUseCases) {
  return async function apiKeyAuth(c: Context, next: Next) {
    const apiKey = c.req.header('X-API-Key');
    
    if (!apiKey) {
      return c.json({ error: 'API key required' }, 401);
    }

    try {
      const validApiKey = await apiKeyUseCases.validateApiKey(apiKey);

      if (!validApiKey) {
        return c.json({ error: 'Invalid or expired API key' }, 401);
      }

      c.set('apiKey', validApiKey);
      await next();
    } catch (error) {
      console.error('Auth error:', error);
      return c.json({ error: 'Authentication failed' }, 500);
    }
  };
}