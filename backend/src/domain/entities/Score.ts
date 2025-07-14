import { Source } from '../types';

export class Score {
  constructor(
    public readonly id: number,
    public readonly teamId: number,
    public readonly websiteId: number | null,
    public readonly points: number,
    public readonly source: Source,
    public readonly createdAt: Date
  ) {}

  static create(
    teamId: number,
    points: number,
    source: Source,
    websiteId?: number
  ): Omit<Score, 'id' | 'createdAt'> {
    return { teamId, websiteId: websiteId || null, points, source };
  }

  isPositive(): boolean {
    return this.points > 0;
  }

  isFromHealthCheck(): boolean {
    return this.source === 'health_check';
  }
}