import { Team } from '../../../domain/entities/Team';
import { TeamRepository } from '../../../domain/interfaces/repositories';
import { TeamScore } from '../../../domain/types';
import { prisma } from '../prisma';

export class TeamRepositoryImpl implements TeamRepository {
  async findAll(): Promise<Team[]> {
    const teams = await prisma.team.findMany({
      orderBy: { name: 'asc' }
    });
    return teams.map(team => new Team(team.id, team.name, team.createdAt));
  }

  async findById(id: number): Promise<Team | null> {
    const team = await prisma.team.findUnique({
      where: { id }
    });
    return team ? new Team(team.id, team.name, team.createdAt) : null;
  }

  async create(teamData: Omit<Team, 'id' | 'createdAt'>): Promise<Team> {
    const team = await prisma.team.create({
      data: { name: teamData.name }
    });
    return new Team(team.id, team.name, team.createdAt);
  }

  async update(id: number, teamData: Partial<Omit<Team, 'id' | 'createdAt'>>): Promise<Team | null> {
    try {
      const team = await prisma.team.update({
        where: { id },
        data: teamData
      });
      return new Team(team.id, team.name, team.createdAt);
    } catch {
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await prisma.team.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async getTeamScores(): Promise<TeamScore[]> {
    const result = await prisma.$queryRaw<Array<{
      id: number;
      name: string;
      total_score: bigint;
      score_count: bigint;
      last_update: Date | null;
    }>>`
      SELECT 
        t.id,
        t.name,
        COALESCE(SUM(s.points), 0) as total_score,
        COUNT(DISTINCT s.id) as score_count,
        MAX(s.created_at) as last_update
      FROM teams t
      LEFT JOIN scores s ON t.id = s.team_id
      GROUP BY t.id, t.name
      ORDER BY total_score DESC, t.name
    `;

    return result.map(row => ({
      id: row.id,
      name: row.name,
      totalScore: Number(row.total_score),
      scoreCount: Number(row.score_count),
      lastUpdate: row.last_update
    }));
  }
}