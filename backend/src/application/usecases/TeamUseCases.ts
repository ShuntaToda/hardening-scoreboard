import { Team } from '../../domain/entities/Team';
import { TeamRepository } from '../../domain/interfaces/repositories';
import { TeamScore } from '../../domain/types';

export class TeamUseCases {
  constructor(private teamRepository: TeamRepository) {}

  async getAllTeams(): Promise<Team[]> {
    return this.teamRepository.findAll();
  }

  async getTeamById(id: number): Promise<Team | null> {
    return this.teamRepository.findById(id);
  }

  async createTeam(name: string): Promise<Team> {
    if (!name.trim()) {
      throw new Error('Team name is required');
    }

    const teamData = Team.create(name.trim());
    return this.teamRepository.create(teamData);
  }

  async updateTeam(id: number, name: string): Promise<Team | null> {
    if (!name.trim()) {
      throw new Error('Team name is required');
    }

    return this.teamRepository.update(id, { name: name.trim() });
  }

  async deleteTeam(id: number): Promise<boolean> {
    return this.teamRepository.delete(id);
  }

  async getTeamScores(): Promise<TeamScore[]> {
    return this.teamRepository.getTeamScores();
  }
}