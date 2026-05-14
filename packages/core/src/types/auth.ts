export interface LoginRequest {
  email: string;
  password: string;
  tenantSubdomain?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
  expiresIn: number;
}

export interface AuthUser {
  id: string;
  tenantId: string;
  email: string;
  userType: UserType;
  status: UserStatus;
  permissions: string[];
  roles: string[];
  employee?: {
    id: string;
    firstName: string;
    lastName: string;
    employeeCode: string;
    designation?: string;
    department?: string;
    profilePictureUrl?: string;
  };
}

export interface TokenPayload {
  userId: string;
  tenantId: string;
  userType: UserType;
  email: string;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
  tenantSubdomain?: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export type UserType = 
  | 'super_admin'
  | 'hr_admin'
  | 'recruiter'
  | 'manager'
  | 'employee'
  | 'candidate'
  | 'lifetime';

export type UserStatus = 'active' | 'inactive' | 'pending';

export interface Permission {
  id: string;
  menuItemId: string;
  menuItemCode: string;
  action: PermissionAction;
}

export type PermissionAction = 'create' | 'read' | 'update' | 'delete';

export interface Role {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  isSystemRole: boolean;
  isActive: boolean;
  permissions: Permission[];
}

export interface MenuItem {
  id: string;
  name: string;
  code: string;
  module: string;
  parentId?: string;
  route?: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
  children?: MenuItem[];
}
