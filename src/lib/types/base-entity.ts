export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  createdBy: string | null;
  updatedBy: string | null;
  deletedBy: string | null;
}

export interface BaseEntitySql {
  id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  created_by: string | null;
  updated_by: string | null;
  deleted_by: string | null;
}

export type AuditFields = keyof BaseEntity;
export type AuditSqlFields = keyof BaseEntitySql;

export type CreateEntityInput<T> = Omit<T, AuditFields> & {
  id?: string;
  createdBy?: string | null;
};

export type UpdateEntityInput<T> = Partial<Omit<T, AuditFields>> & {
  id: string;
  updatedBy?: string | null;
};

export interface SoftDeleteEntityInput {
  id: string;
  deletedBy?: string | null;
}

