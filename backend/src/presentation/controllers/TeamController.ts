import { Hono } from 'hono';
import { z } from 'zod';
import { TeamUseCases } from '../../application/usecases/TeamUseCases';

const createTeamSchema = z.object({
  name: z.string().min(1).max(255)
});

export function createTeamController(teamUseCases: TeamUseCases) {
  const router = new Hono();

  // Get all teams with scores
  router.get('/', async (c) => {
    try {
      const teams = await teamUseCases.getTeamScores();
      return c.json(teams);
    } catch (error) {
      console.error('Error fetching teams:', error);
      return c.json({ error: 'Failed to fetch teams' }, 500);
    }
  });

  // Get single team with details
  router.get('/:id', async (c) => {
    const id = parseInt(c.req.param('id'));
    
    try {
      const team = await teamUseCases.getTeamById(id);

      if (!team) {
        return c.json({ error: 'Team not found' }, 404);
      }

      return c.json(team);
    } catch (error) {
      console.error('Error fetching team:', error);
      return c.json({ error: 'Failed to fetch team' }, 500);
    }
  });

  // Create new team
  router.post('/', async (c) => {
    try {
      const body = await c.req.json();
      const data = createTeamSchema.parse(body);
      
      const team = await teamUseCases.createTeam(data.name);
      return c.json(team, 201);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return c.json({ error: 'Invalid input', details: error.errors }, 400);
      }
      if (error instanceof Error) {
        return c.json({ error: error.message }, 400);
      }
      console.error('Error creating team:', error);
      return c.json({ error: 'Failed to create team' }, 500);
    }
  });

  // Update team
  router.put('/:id', async (c) => {
    const id = parseInt(c.req.param('id'));
    
    try {
      const body = await c.req.json();
      const data = createTeamSchema.parse(body);
      
      const team = await teamUseCases.updateTeam(id, data.name);
      
      if (!team) {
        return c.json({ error: 'Team not found' }, 404);
      }
      
      return c.json(team);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return c.json({ error: 'Invalid input', details: error.errors }, 400);
      }
      if (error instanceof Error) {
        return c.json({ error: error.message }, 400);
      }
      console.error('Error updating team:', error);
      return c.json({ error: 'Failed to update team' }, 500);
    }
  });

  // Delete team
  router.delete('/:id', async (c) => {
    const id = parseInt(c.req.param('id'));
    
    try {
      const success = await teamUseCases.deleteTeam(id);
      
      if (!success) {
        return c.json({ error: 'Team not found' }, 404);
      }
      
      return c.json({ message: 'Team deleted successfully' });
    } catch (error) {
      console.error('Error deleting team:', error);
      return c.json({ error: 'Failed to delete team' }, 500);
    }
  });

  return router;
}