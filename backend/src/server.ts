import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { WebSocketServer } from 'ws';
import * as dotenv from 'dotenv';

// Infrastructure
import { connectDatabase } from './infrastructure/database/prisma';
import { TeamRepositoryImpl } from './infrastructure/database/repositories/TeamRepositoryImpl';
import { WebsiteRepositoryImpl } from './infrastructure/database/repositories/WebsiteRepositoryImpl';
import { ScoreRepositoryImpl } from './infrastructure/database/repositories/ScoreRepositoryImpl';
import { ApiKeyRepositoryImpl } from './infrastructure/database/repositories/ApiKeyRepositoryImpl';
import { HealthLogRepositoryImpl } from './infrastructure/database/repositories/HealthLogRepositoryImpl';
import { WebSocketServiceImpl } from './infrastructure/websocket/WebSocketServiceImpl';

// Application
import { TeamUseCases } from './application/usecases/TeamUseCases';
import { WebsiteUseCases } from './application/usecases/WebsiteUseCases';
import { ScoreUseCases } from './application/usecases/ScoreUseCases';
import { ApiKeyUseCases } from './application/usecases/ApiKeyUseCases';
import { HealthCheckServiceImpl } from './application/services/HealthCheckServiceImpl';
import { HealthCheckOrchestrator } from './application/services/HealthCheckOrchestrator';

// Presentation
import { createTeamController } from './presentation/controllers/TeamController';
import { createWebsiteController } from './presentation/controllers/WebsiteController';
import { createScoreController } from './presentation/controllers/ScoreController';
import { createApiKeyController } from './presentation/controllers/ApiKeyController';
import { createApiKeyAuth } from './presentation/middleware/auth';

dotenv.config();

const app = new Hono();
const port = parseInt(process.env.PORT || '3000');
const wsPort = parseInt(process.env.WS_PORT || '3001');

// Initialize repositories
const teamRepository = new TeamRepositoryImpl();
const websiteRepository = new WebsiteRepositoryImpl();
const scoreRepository = new ScoreRepositoryImpl();
const apiKeyRepository = new ApiKeyRepositoryImpl();
const healthLogRepository = new HealthLogRepositoryImpl();

// Initialize use cases
const teamUseCases = new TeamUseCases(teamRepository);
const websiteUseCases = new WebsiteUseCases(websiteRepository, teamRepository);
const scoreUseCases = new ScoreUseCases(scoreRepository, teamRepository);
const apiKeyUseCases = new ApiKeyUseCases(apiKeyRepository);

// Initialize services
const healthCheckService = new HealthCheckServiceImpl();

// Middleware
app.use('/*', cors());

// Create middleware
const apiKeyAuth = createApiKeyAuth(apiKeyUseCases);

// Routes
app.route('/api/teams', createTeamController(teamUseCases));
app.route('/api/websites', createWebsiteController(websiteUseCases, healthLogRepository));
app.route('/api/scores', createScoreController(scoreUseCases, {} as any, apiKeyAuth)); // WebSocket service will be injected later
app.route('/api/api-keys', createApiKeyController(apiKeyUseCases));

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

async function startServer() {
  try {
    // Connect to database
    await connectDatabase();

    // Start HTTP server
    serve({
      fetch: app.fetch,
      port,
    });

    // WebSocket setup on separate port
    const wss = new WebSocketServer({ port: wsPort });
    const webSocketService = new WebSocketServiceImpl(wss, teamRepository);

    // Update score controller with WebSocket service
    app.route('/api/scores', createScoreController(scoreUseCases, webSocketService, apiKeyAuth));

    // Start health check orchestrator
    const healthCheckOrchestrator = new HealthCheckOrchestrator(
      healthCheckService,
      websiteRepository,
      scoreRepository,
      healthLogRepository,
      webSocketService
    );
    healthCheckOrchestrator.start();

    console.log(`HTTP Server is running on port ${port}`);
    console.log(`WebSocket server is running on port ${wsPort}`);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();