import { AuditFields, EntityStatus } from './common.js';
import { EmploymentType } from './recruitment.js';

export type EmployeeStatus = 'active' | 'on_notice' | 'exited' | 'absconding';
export type Gender = 'male' | 'female' | 'other';
export type MaritalStatus = 'single' | 'married' | 'divorced' | 'widowed';
export type AddressType = 'current' | 'permanent';

export interface Employee extends AuditFields {
  id: string;
  tenantId: string;
  userId: string;
  employeeCode: string;
  caseId?: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: Gender;
  maritalStatus?: MaritalStatus;
  bloodGroup?: string;
  nationality?: string;
  departmentId?: string;
  designationId?: string;
  gradeId?: string;
  locationId?: string;
  reportingManagerId?: string;
  joiningDate: Date;
  confirmationDate?: Date;
  probationEndDate?: Date;
  status: EmployeeStatus;
  employmentType: EmploymentType;
  department?: ConfigEntity;
  designation?: ConfigEntity;
  grade?: ConfigEntity;
  location?: ConfigEntity;
  reportingManager?: EmployeeBasic;
  addresses?: EmployeeAddress[];
  emergencyContacts?: EmergencyContact[];
  bankDetails?: BankDetails;
}

export interface EmployeeBasic {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName?: string;
  email: string;
  designation?: string;
  department?: string;
  profilePictureUrl?: string;
}

export interface ConfigEntity {
  id: string;
  name: string;
  code: string;
}

export interface EmployeeAddress {
  id: string;
  employeeId: string;
  addressType: AddressType;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  isSameAsPermanent: boolean;
}

export interface EmergencyContact {
  id: string;
  employeeId: string;
  name: string;
  relationship: string;
  phone: string;
  alternatePhone?: string;
  isPrimary: boolean;
}

export interface BankDetails {
  id: string;
  employeeId: string;
  bankName: string;
  branchName?: string;
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  isVerified: boolean;
  verifiedBy?: string;
}

export interface CreateEmployeeRequest {
  employeeCode: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: Gender;
  maritalStatus?: MaritalStatus;
  bloodGroup?: string;
  nationality?: string;
  departmentId?: string;
  designationId?: string;
  gradeId?: string;
  locationId?: string;
  reportingManagerId?: string;
  joiningDate: string;
  employmentType?: EmploymentType;
}

export interface UpdateEmployeeRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: Gender;
  maritalStatus?: MaritalStatus;
  bloodGroup?: string;
  nationality?: string;
  departmentId?: string;
  designationId?: string;
  gradeId?: string;
  locationId?: string;
  reportingManagerId?: string;
  confirmationDate?: string;
  probationEndDate?: string;
  status?: EmployeeStatus;
  employmentType?: EmploymentType;
}

export interface UpdateAddressRequest {
  addressType: AddressType;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  isSameAsPermanent?: boolean;
}

export interface UpdateEmergencyContactRequest {
  name: string;
  relationship: string;
  phone: string;
  alternatePhone?: string;
  isPrimary?: boolean;
}

export interface UpdateBankDetailsRequest {
  bankName: string;
  branchName?: string;
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
}

export interface EmployeeListFilters {
  search?: string;
  departmentId?: string;
  designationId?: string;
  locationId?: string;
  status?: EmployeeStatus;
  employmentType?: EmploymentType;
  joiningDateFrom?: string;
  joiningDateTo?: string;
}

export interface EmployeeDocument {
  id: string;
  employeeId: string;
  documentTypeId: string;
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  uploadedAt: Date;
}

export interface OrganizationChart {
  id: string;
  name: string;
  designation: string;
  department: string;
  profilePictureUrl?: string;
  children: OrganizationChart[];
}
