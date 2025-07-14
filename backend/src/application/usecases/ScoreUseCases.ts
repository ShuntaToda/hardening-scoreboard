import { Score } from '../../domain/entities/Score';
import { ScoreRepository, TeamRepository } from '../../domain/interfaces/repositories';
import { TeamScore, Source } from '../../domain/types';

export class ScoreUseCases {
  constructor(
    private scoreRepository: ScoreRepository,
    private teamRepository: TeamRepository
  ) {}

  async getAllScores(limit?: number, teamId?: number): Promise<Score[]> {
    return this.scoreRepository.findAll(limit, teamId);
  }

  async getScoresByTeamId(teamId: number, limit?: number): Promise<Score[]> {
    return this.scoreRepository.findByTeamId(teamId, limit);
  }

  async addScore(teamId: number, points: number, source: Source, websiteId?: number): Promise<Score> {
    if (points === 0) {
      throw new Error('Points cannot be zero');
    }

    // Validate team exists
    const team = await this.teamRepository.findById(teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    const scoreData = Score.create(teamId, points, source, websiteId);
    return this.scoreRepository.create(scoreData);
  }

  async getLeaderboard(): Promise<TeamScore[]> {
    return this.scoreRepository.getLeaderboard();
  }
}