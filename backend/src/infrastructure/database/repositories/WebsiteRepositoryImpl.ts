import { Website } from '../../../domain/entities/Website';
import { WebsiteRepository } from '../../../domain/interfaces/repositories';
import { prisma } from '../prisma';

export class WebsiteRepositoryImpl implements WebsiteRepository {
  async findAll(): Promise<Website[]> {
    const websites = await prisma.website.findMany({
      include: { team: true },
      orderBy: [{ team: { name: 'asc' } }, { name: 'asc' }]
    });
    return websites.map(website => new Website(
      website.id,
      website.teamId,
      website.url,
      website.name,
      website.createdAt
    ));
  }

  async findById(id: number): Promise<Website | null> {
    const website = await prisma.website.findUnique({
      where: { id }
    });
    return website ? new Website(
      website.id,
      website.teamId,
      website.url,
      website.name,
      website.createdAt
    ) : null;
  }

  async findByTeamId(teamId: number): Promise<Website[]> {
    const websites = await prisma.website.findMany({
      where: { teamId },
      orderBy: { name: 'asc' }
    });
    return websites.map(website => new Website(
      website.id,
      website.teamId,
      website.url,
      website.name,
      website.createdAt
    ));
  }

  async create(websiteData: Omit<Website, 'id' | 'createdAt'>): Promise<Website> {
    const website = await prisma.website.create({
      data: {
        teamId: websiteData.teamId,
        url: websiteData.url,
        name: websiteData.name
      }
    });
    return new Website(
      website.id,
      website.teamId,
      website.url,
      website.name,
      website.createdAt
    );
  }

  async update(id: number, websiteData: Partial<Omit<Website, 'id' | 'createdAt'>>): Promise<Website | null> {
    try {
      const website = await prisma.website.update({
        where: { id },
        data: websiteData
      });
      return new Website(
        website.id,
        website.teamId,
        website.url,
        website.name,
        website.createdAt
      );
    } catch {
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await prisma.website.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}