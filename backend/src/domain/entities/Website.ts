export class Website {
  constructor(
    public readonly id: number,
    public readonly teamId: number,
    public readonly url: string,
    public readonly name: string,
    public readonly createdAt: Date
  ) {}

  static create(teamId: number, url: string, name: string): Omit<Website, 'id' | 'createdAt'> {
    return { teamId, url, name };
  }

  isValidUrl(): boolean {
    try {
      new URL(this.url);
      return true;
    } catch {
      return false;
    }
  }
}