import { Hono } from 'hono';
import { z } from 'zod';
import { ScoreUseCases } from '../../application/usecases/ScoreUseCases';
import { WebSocketService } from '../../domain/interfaces/services';

const addScoreSchema = z.object({
  team_id: z.number().int().positive(),
  points: z.number().int(),
  reason: z.string().optional()
});

export function createScoreController(
  scoreUseCases: ScoreUseCases,
  webSocketService: WebSocketService,
  apiKeyAuth: any
) {
  const router = new Hono();

  // Get all scores
  router.get('/', async (c) => {
    const limit = parseInt(c.req.query('limit') || '100');
    const teamId = c.req.query('team_id');
    
    try {
      const scores = await scoreUseCases.getAllScores(
        limit,
        teamId ? parseInt(teamId) : undefined
      );
      return c.json(scores);
    } catch (error) {
      console.error('Error fetching scores:', error);
      return c.json({ error: 'Failed to fetch scores' }, 500);
    }
  });

  // Add score via API (requires authentication)
  router.post('/', apiKeyAuth, async (c) => {
    try {
      const body = await c.req.json();
      const data = addScoreSchema.parse(body);
      
      const score = await scoreUseCases.addScore(
        data.team_id,
        data.points,
        'external_api'
      );
      
      // Broadcast score update
      await webSocketService.broadcastScoreUpdate(data.team_id);
      
      return c.json(score, 201);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return c.json({ error: 'Invalid input', details: error.errors }, 400);
      }
      if (error instanceof Error) {
        return c.json({ error: error.message }, 400);
      }
      console.error('Error adding score:', error);
      return c.json({ error: 'Failed to add score' }, 500);
    }
  });

  // Get team leaderboard
  router.get('/leaderboard', async (c) => {
    try {
      const leaderboard = await scoreUseCases.getLeaderboard();
      return c.json(leaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return c.json({ error: 'Failed to fetch leaderboard' }, 500);
    }
  });

  return router;
}