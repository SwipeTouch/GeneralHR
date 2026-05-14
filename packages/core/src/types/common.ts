export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface FileUpload {
  fieldName: string;
  originalName: string;
  encoding: string;
  mimetype: string;
  size: number;
  path: string;
  url?: string;
}

export type EntityStatus = 'active' | 'inactive';

export interface AuditFields {
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface SoftDelete {
  deletedAt?: Date;
  deletedBy?: string;
  isDeleted: boolean;
}
