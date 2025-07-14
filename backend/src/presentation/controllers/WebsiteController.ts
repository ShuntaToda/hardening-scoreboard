import { Hono } from 'hono';
import { z } from 'zod';
import { WebsiteUseCases } from '../../application/usecases/WebsiteUseCases';
import { HealthLogRepository } from '../../domain/interfaces/repositories';

const createWebsiteSchema = z.object({
  team_id: z.number().int().positive(),
  url: z.string().url(),
  name: z.string().min(1).max(255)
});

export function createWebsiteController(
  websiteUseCases: WebsiteUseCases,
  healthLogRepository: HealthLogRepository
) {
  const router = new Hono();

  // Get all websites
  router.get('/', async (c) => {
    try {
      const websites = await websiteUseCases.getAllWebsites();
      return c.json(websites);
    } catch (error) {
      console.error('Error fetching websites:', error);
      return c.json({ error: 'Failed to fetch websites' }, 500);
    }
  });

  // Get websites by team
  router.get('/team/:teamId', async (c) => {
    const teamId = parseInt(c.req.param('teamId'));
    
    try {
      const websites = await websiteUseCases.getWebsitesByTeamId(teamId);
      return c.json(websites);
    } catch (error) {
      console.error('Error fetching websites:', error);
      return c.json({ error: 'Failed to fetch websites' }, 500);
    }
  });

  // Create new website
  router.post('/', async (c) => {
    try {
      const body = await c.req.json();
      const data = createWebsiteSchema.parse(body);
      
      const website = await websiteUseCases.createWebsite(
        data.team_id,
        data.url,
        data.name
      );
      
      return c.json(website, 201);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return c.json({ error: 'Invalid input', details: error.errors }, 400);
      }
      if (error instanceof Error) {
        return c.json({ error: error.message }, 400);
      }
      console.error('Error creating website:', error);
      return c.json({ error: 'Failed to create website' }, 500);
    }
  });

  // Update website
  router.put('/:id', async (c) => {
    const id = parseInt(c.req.param('id'));
    
    try {
      const body = await c.req.json();
      const data = createWebsiteSchema.parse(body);
      
      const website = await websiteUseCases.updateWebsite(
        id,
        data.team_id,
        data.url,
        data.name
      );
      
      if (!website) {
        return c.json({ error: 'Website not found' }, 404);
      }
      
      return c.json(website);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return c.json({ error: 'Invalid input', details: error.errors }, 400);
      }
      if (error instanceof Error) {
        return c.json({ error: error.message }, 400);
      }
      console.error('Error updating website:', error);
      return c.json({ error: 'Failed to update website' }, 500);
    }
  });

  // Delete website
  router.delete('/:id', async (c) => {
    const id = parseInt(c.req.param('id'));
    
    try {
      const success = await websiteUseCases.deleteWebsite(id);
      
      if (!success) {
        return c.json({ error: 'Website not found' }, 404);
      }
      
      return c.json({ message: 'Website deleted successfully' });
    } catch (error) {
      console.error('Error deleting website:', error);
      return c.json({ error: 'Failed to delete website' }, 500);
    }
  });

  // Get health logs for website
  router.get('/:id/health-logs', async (c) => {
    const id = parseInt(c.req.param('id'));
    const limit = parseInt(c.req.query('limit') || '100');
    
    try {
      const healthLogs = await healthLogRepository.findByWebsiteId(id, limit);
      return c.json(healthLogs);
    } catch (error) {
      console.error('Error fetching health logs:', error);
      return c.json({ error: 'Failed to fetch health logs' }, 500);
    }
  });

  return router;
}