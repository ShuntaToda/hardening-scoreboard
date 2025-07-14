import { Score } from '../../../domain/entities/Score';
import { ScoreRepository } from '../../../domain/interfaces/repositories';
import { TeamScore, Source } from '../../../domain/types';
import { prisma } from '../prisma';

export class ScoreRepositoryImpl implements ScoreRepository {
  async findAll(limit: number = 100, teamId?: number): Promise<Score[]> {
    const scores = await prisma.score.findMany({
      where: teamId ? { teamId } : undefined,
      include: {
        team: true,
        website: true
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    return scores.map(score => new Score(
      score.id,
      score.teamId,
      score.websiteId,
      score.points,
      score.source as Source,
      score.createdAt
    ));
  }

  async findById(id: number): Promise<Score | null> {
    const score = await prisma.score.findUnique({
      where: { id }
    });
    return score ? new Score(
      score.id,
      score.teamId,
      score.websiteId,
      score.points,
      score.source as Source,
      score.createdAt
    ) : null;
  }

  async findByTeamId(teamId: number, limit: number = 100): Promise<Score[]> {
    const scores = await prisma.score.findMany({
      where: { teamId },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    return scores.map(score => new Score(
      score.id,
      score.teamId,
      score.websiteId,
      score.points,
      score.source as Source,
      score.createdAt
    ));
  }

  async create(scoreData: Omit<Score, 'id' | 'createdAt'>): Promise<Score> {
    const score = await prisma.score.create({
      data: {
        teamId: scoreData.teamId,
        websiteId: scoreData.websiteId,
        points: scoreData.points,
        source: scoreData.source
      }
    });

    return new Score(
      score.id,
      score.teamId,
      score.websiteId,
      score.points,
      score.source as Source,
      score.createdAt
    );
  }

  async getLeaderboard(): Promise<TeamScore[]> {
    const result = await prisma.$queryRaw<Array<{
      id: number;
      name: string;
      total_score: bigint;
      score_entries: bigint;
      last_score_at: Date | null;
    }>>`
      SELECT 
        t.id,
        t.name,
        COALESCE(SUM(s.points), 0) as total_score,
        COUNT(DISTINCT s.id) as score_entries,
        MAX(s.created_at) as last_score_at
      FROM teams t
      LEFT JOIN scores s ON t.id = s.team_id
      GROUP BY t.id, t.name
      ORDER BY total_score DESC, t.name
    `;

    return result.map(row => ({
      id: row.id,
      name: row.name,
      totalScore: Number(row.total_score),
      scoreCount: Number(row.score_entries),
      lastUpdate: row.last_score_at
    }));
  }
}