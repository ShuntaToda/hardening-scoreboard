export class HealthLog {
  constructor(
    public readonly id: number,
    public readonly websiteId: number,
    public readonly status: number,
    public readonly responseTime: number | null,
    public readonly errorMessage: string | null,
    public readonly createdAt: Date
  ) {}

  static create(
    websiteId: number,
    status: number,
    responseTime?: number,
    errorMessage?: string
  ): Omit<HealthLog, 'id' | 'createdAt'> {
    return {
      websiteId,
      status,
      responseTime: responseTime || null,
      errorMessage: errorMessage || null
    };
  }

  isSuccess(): boolean {
    return this.status >= 200 && this.status < 300;
  }

  hasError(): boolean {
    return this.errorMessage !== null;
  }
}