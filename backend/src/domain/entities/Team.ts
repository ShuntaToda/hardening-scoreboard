export class Team {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly createdAt: Date
  ) {}

  static create(name: string): Omit<Team, 'id' | 'createdAt'> {
    return { name };
  }
}