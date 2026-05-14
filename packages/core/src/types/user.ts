import { UserType, UserStatus, Role } from './auth.js';
import { AuditFields } from './common.js';

export interface User extends AuditFields {
  id: string;
  tenantId: string;
  email: string;
  userType: UserType;
  status: UserStatus;
  emailVerified: boolean;
  lastLogin?: Date;
  roles?: Role[];
}

export interface CreateUserRequest {
  email: string;
  password: string;
  userType: UserType;
  roleIds?: string[];
}

export interface UpdateUserRequest {
  email?: string;
  userType?: UserType;
  status?: UserStatus;
  roleIds?: string[];
}

export interface UserWithRoles extends User {
  roles: Role[];
}

export interface AssignRolesRequest {
  roleIds: string[];
}

export interface UserListFilters {
  search?: string;
  userType?: UserType;
  status?: UserStatus;
  roleId?: string;
}
