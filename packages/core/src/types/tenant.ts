import { AuditFields } from './common.js';

export interface Tenant extends AuditFields {
  id: string;
  name: string;
  subdomain: string;
  status: TenantStatus;
  config?: TenantConfig;
}

export type TenantStatus = 'active' | 'inactive' | 'suspended';

export interface TenantConfig {
  branding: TenantBranding;
  features: TenantFeatures;
  workflows: TenantWorkflows;
  settings: TenantSettings;
}

export interface TenantBranding {
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  companyName: string;
}

export interface TenantFeatures {
  recruitmentEnabled: boolean;
  exitManagementEnabled: boolean;
  payrollIntegrationEnabled: boolean;
  lifetimePortalEnabled: boolean;
  customFieldsEnabled: boolean;
}

export interface TenantWorkflows {
  recruitmentStages: WorkflowStage[];
  leaveApprovalLevels: number;
  exitClearanceItems: ClearanceItem[];
}

export interface WorkflowStage {
  code: string;
  name: string;
  sequence: number;
  isRequired: boolean;
  autoAdvance?: boolean;
  actions: string[];
}

export interface ClearanceItem {
  code: string;
  name: string;
  department: string;
  isMandatory: boolean;
}

export interface TenantSettings {
  timezone: string;
  dateFormat: string;
  currency: string;
  noticePeriodDays: number;
  probationPeriodMonths: number;
  passwordPolicy: PasswordPolicy;
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumber: boolean;
  requireSpecialChar: boolean;
  expiryDays?: number;
}

export interface CreateTenantRequest {
  name: string;
  subdomain: string;
  adminEmail: string;
  adminPassword: string;
  config?: Partial<TenantConfig>;
}

export interface UpdateTenantRequest {
  name?: string;
  status?: TenantStatus;
  config?: Partial<TenantConfig>;
}
