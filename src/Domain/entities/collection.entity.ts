export interface CollectionEntity {
  id: string;
  orgSlug: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}
