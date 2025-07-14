import { Hono } from 'hono';
import { z } from 'zod';
import { ApiKeyUseCases } from '../../application/usecases/ApiKeyUseCases';

const createApiKeySchema = z.object({
  name: z.string().min(1).max(255),
  expires_at: z.string().datetime().optional()
});

export function createApiKeyController(apiKeyUseCases: ApiKeyUseCases) {
  const router = new Hono();

  // Get all API keys (without the actual key values)
  router.get('/', async (c) => {
    try {
      const apiKeys = await apiKeyUseCases.getAllApiKeys();
      return c.json(apiKeys);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      return c.json({ error: 'Failed to fetch API keys' }, 500);
    }
  });

  // Create new API key
  router.post('/', async (c) => {
    try {
      const body = await c.req.json();
      const data = createApiKeySchema.parse(body);
      
      const expiresAt = data.expires_at ? new Date(data.expires_at) : undefined;
      const apiKey = await apiKeyUseCases.createApiKey(data.name, expiresAt);
      
      // Return the key only once when created
      return c.json(apiKey, 201);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return c.json({ error: 'Invalid input', details: error.errors }, 400);
      }
      if (error instanceof Error) {
        return c.json({ error: error.message }, 400);
      }
      console.error('Error creating API key:', error);
      return c.json({ error: 'Failed to create API key' }, 500);
    }
  });

  // Delete API key
  router.delete('/:id', async (c) => {
    const id = parseInt(c.req.param('id'));
    
    try {
      const success = await apiKeyUseCases.deleteApiKey(id);
      
      if (!success) {
        return c.json({ error: 'API key not found' }, 404);
      }
      
      return c.json({ message: 'API key deleted successfully' });
    } catch (error) {
      console.error('Error deleting API key:', error);
      return c.json({ error: 'Failed to delete API key' }, 500);
    }
  });

  return router;
}