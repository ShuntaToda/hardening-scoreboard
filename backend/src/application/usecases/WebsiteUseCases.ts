import { Website } from '../../domain/entities/Website';
import { WebsiteRepository, TeamRepository } from '../../domain/interfaces/repositories';

export class WebsiteUseCases {
  constructor(
    private websiteRepository: WebsiteRepository,
    private teamRepository: TeamRepository
  ) {}

  async getAllWebsites(): Promise<Website[]> {
    return this.websiteRepository.findAll();
  }

  async getWebsiteById(id: number): Promise<Website | null> {
    return this.websiteRepository.findById(id);
  }

  async getWebsitesByTeamId(teamId: number): Promise<Website[]> {
    return this.websiteRepository.findByTeamId(teamId);
  }

  async createWebsite(teamId: number, url: string, name: string): Promise<Website> {
    if (!name.trim()) {
      throw new Error('Website name is required');
    }

    if (!url.trim()) {
      throw new Error('Website URL is required');
    }

    // Validate team exists
    const team = await this.teamRepository.findById(teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      throw new Error('Invalid URL format');
    }

    const websiteData = Website.create(teamId, url.trim(), name.trim());
    return this.websiteRepository.create(websiteData);
  }

  async updateWebsite(id: number, teamId: number, url: string, name: string): Promise<Website | null> {
    if (!name.trim()) {
      throw new Error('Website name is required');
    }

    if (!url.trim()) {
      throw new Error('Website URL is required');
    }

    // Validate team exists
    const team = await this.teamRepository.findById(teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      throw new Error('Invalid URL format');
    }

    return this.websiteRepository.update(id, {
      teamId,
      url: url.trim(),
      name: name.trim()
    });
  }

  async deleteWebsite(id: number): Promise<boolean> {
    return this.websiteRepository.delete(id);
  }
}