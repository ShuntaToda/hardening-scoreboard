import { WebSocketServer, WebSocket } from 'ws';
import { WebSocketService } from '../../domain/interfaces/services';
import { TeamRepository } from '../../domain/interfaces/repositories';

interface WebSocketMessage {
  type: 'initial' | 'update';
  data: any[];
  teamId?: number;
}

export class WebSocketServiceImpl implements WebSocketService {
  private clients: Set<WebSocket> = new Set();

  constructor(
    private wss: WebSocketServer,
    private teamRepository: TeamRepository
  ) {
    this.setupWebSocketServer();
  }

  private setupWebSocketServer() {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('New WebSocket connection');
      this.clients.add(ws);

      ws.on('close', () => {
        console.log('WebSocket connection closed');
        this.clients.delete(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
      });

      // Send initial scores
      this.sendInitialScores(ws);
    });
  }

  private async sendInitialScores(ws: WebSocket) {
    try {
      const scores = await this.teamRepository.getTeamScores();
      ws.send(JSON.stringify({
        type: 'initial',
        data: scores
      }));
    } catch (error) {
      console.error('Error sending initial scores:', error);
    }
  }

  async broadcastScoreUpdate(teamId?: number) {
    try {
      const scores = await this.teamRepository.getTeamScores();
      const message = JSON.stringify({
        type: 'update',
        data: scores,
        teamId
      });

      this.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    } catch (error) {
      console.error('Error broadcasting score update:', error);
    }
  }
}