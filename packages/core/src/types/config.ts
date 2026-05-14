import { AuditFields } from './common.js';

export type ConfigEntityType = 
  | 'department'
  | 'designation'
  | 'grade'
  | 'location'
  | 'document_type'
  | 'clearance_item';

export type CustomFieldType = 
  | 'text'
  | 'number'
  | 'date'
  | 'dropdown'
  | 'checkbox'
  | 'file'
  | 'textarea';

export type TemplateFormat = 'html' | 'pdf';
export type WorkflowType = 'recruitment' | 'leave_approval' | 'exit';

export interface ConfigEntity extends AuditFields {
  id: string;
  tenantId: string;
  entityType: ConfigEntityType;
  name: string;
  code: string;
  parentId?: string;
  metadata?: Record<string, unknown>;
  sortOrder: number;
  isActive: boolean;
  children?: ConfigEntity[];
}

export interface CreateConfigEntityRequest {
  entityType: ConfigEntityType;
  name: string;
  code: string;
  parentId?: string;
  metadata?: Record<string, unknown>;
  sortOrder?: number;
}

export interface UpdateConfigEntityRequest {
  name?: string;
  parentId?: string;
  metadata?: Record<string, unknown>;
  sortOrder?: number;
  isActive?: boolean;
}

export interface CustomFieldDefinition extends AuditFields {
  id: string;
  tenantId: string;
  entity: string;
  fieldName: string;
  fieldLabel: string;
  fieldType: CustomFieldType;
  options?: SelectOption[];
  isRequired: boolean;
  isVisible: boolean;
  validationRules?: ValidationRule[];
  sortOrder: number;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface ValidationRule {
  type: 'min' | 'max' | 'pattern' | 'minLength' | 'maxLength';
  value: string | number;
  message: string;
}

export interface CreateCustomFieldRequest {
  entity: string;
  fieldName: string;
  fieldLabel: string;
  fieldType: CustomFieldType;
  options?: SelectOption[];
  isRequired?: boolean;
  isVisible?: boolean;
  validationRules?: ValidationRule[];
  sortOrder?: number;
}

export interface CustomFieldValue {
  id: string;
  tenantId: string;
  entity: string;
  entityId: string;
  fieldDefinitionId: string;
  value?: string;
  fieldDefinition?: CustomFieldDefinition;
}

export interface EmailTemplate extends AuditFields {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  subject: string;
  body: string;
  variables?: TemplateVariable[];
  isActive: boolean;
}

export interface TemplateVariable {
  name: string;
  description: string;
  example?: string;
}

export interface UpdateEmailTemplateRequest {
  name?: string;
  subject?: string;
  body?: string;
  isActive?: boolean;
}

export interface DocumentTemplate extends AuditFields {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  templateContent: string;
  variables?: TemplateVariable[];
  format: TemplateFormat;
  isActive: boolean;
}

export interface UpdateDocumentTemplateRequest {
  name?: string;
  templateContent?: string;
  format?: TemplateFormat;
  isActive?: boolean;
}

export interface WorkflowConfiguration extends AuditFields {
  id: string;
  tenantId: string;
  workflowType: WorkflowType;
  stages: WorkflowStageConfig[];
  isActive: boolean;
}

export interface WorkflowStageConfig {
  code: string;
  name: string;
  sequence: number;
  isRequired: boolean;
  autoAdvance: boolean;
  nextStages: string[];
  actions: WorkflowAction[];
}

export interface WorkflowAction {
  code: string;
  name: string;
  targetStage?: string;
  requiresNote: boolean;
  sendNotification: boolean;
}

export interface UpdateWorkflowRequest {
  stages: WorkflowStageConfig[];
  isActive?: boolean;
}

export interface Notification {
  id: string;
  tenantId: string;
  userId: string;
  type: string;
  title: string;
  message?: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

export interface AuditLog {
  id: string;
  tenantId: string;
  userId?: string;
  action: string;
  entity: string;
  entityId: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface AuditLogFilters {
  userId?: string;
  action?: string;
  entity?: string;
  entityId?: string;
  dateFrom?: string;
  dateTo?: string;
}
