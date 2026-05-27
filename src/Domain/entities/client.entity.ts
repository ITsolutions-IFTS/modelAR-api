export interface ClientEntity {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  orgSlug: string;
  role: 'superadmin' | 'client';
  createdAt: Date;
  updatedAt: Date;
}
