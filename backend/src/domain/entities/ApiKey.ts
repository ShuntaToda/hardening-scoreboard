import crypto from 'crypto';

export class ApiKey {
  constructor(
    public readonly id: number,
    public readonly key: string,
    public readonly name: string,
    public readonly expiresAt: Date | null,
    public readonly createdAt: Date
  ) {}

  static create(name: string, expiresAt?: Date): Omit<ApiKey, 'id' | 'createdAt'> {
    const key = crypto.randomBytes(32).toString('hex');
    return { key, name, expiresAt: expiresAt || null };
  }

  isExpired(): boolean {
    if (!this.expiresAt) return false;
    return new Date() > this.expiresAt;
  }

  isValid(): boolean {
    return !this.isExpired();
  }
}