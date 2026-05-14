import { AuditFields } from './common.js';

export type LeaveRequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';
export type LeaveApprovalStatus = 'pending' | 'approved' | 'rejected';
export type AccrualType = 'annual' | 'monthly' | 'pro_rata';
export type ApplicableTo = 'all' | 'department' | 'designation' | 'grade';
export type HolidayType = 'mandatory' | 'optional' | 'restricted';

export interface LeaveType extends AuditFields {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  description?: string;
  isPaid: boolean;
  requiresApproval: boolean;
  requiresDocument: boolean;
  minDaysNotice: number;
  maxConsecutiveDays?: number;
  isActive: boolean;
}

export interface CreateLeaveTypeRequest {
  name: string;
  code: string;
  description?: string;
  isPaid?: boolean;
  requiresApproval?: boolean;
  requiresDocument?: boolean;
  minDaysNotice?: number;
  maxConsecutiveDays?: number;
}

export interface LeavePolicy extends AuditFields {
  id: string;
  tenantId: string;
  leaveTypeId: string;
  name: string;
  applicableTo: ApplicableTo;
  applicableEntityId?: string;
  entitlement: number;
  accrualType: AccrualType;
  carryForwardEnabled: boolean;
  carryForwardLimit?: number;
  carryForwardExpiryMonths?: number;
  encashmentEnabled: boolean;
  encashmentLimit?: number;
  minServiceDays: number;
  effectiveFrom: Date;
  effectiveTo?: Date;
  isActive: boolean;
  leaveType?: LeaveType;
}

export interface CreateLeavePolicyRequest {
  leaveTypeId: string;
  name: string;
  applicableTo?: ApplicableTo;
  applicableEntityId?: string;
  entitlement: number;
  accrualType?: AccrualType;
  carryForwardEnabled?: boolean;
  carryForwardLimit?: number;
  carryForwardExpiryMonths?: number;
  encashmentEnabled?: boolean;
  encashmentLimit?: number;
  minServiceDays?: number;
  effectiveFrom: string;
  effectiveTo?: string;
}

export interface LeaveBalance {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  year: number;
  openingBalance: number;
  accrued: number;
  used: number;
  adjusted: number;
  carriedForward: number;
  currentBalance: number;
  leaveType?: LeaveType;
}

export interface LeaveRequest extends AuditFields {
  id: string;
  tenantId: string;
  employeeId: string;
  leaveTypeId: string;
  fromDate: Date;
  toDate: Date;
  days: number;
  reason?: string;
  status: LeaveRequestStatus;
  documentUrl?: string;
  leaveType?: LeaveType;
  approvals?: LeaveApproval[];
}

export interface CreateLeaveRequestRequest {
  leaveTypeId: string;
  fromDate: string;
  toDate: string;
  reason?: string;
  documentUrl?: string;
}

export interface LeaveApproval {
  id: string;
  leaveRequestId: string;
  approverId: string;
  level: number;
  status: LeaveApprovalStatus;
  comments?: string;
  actedAt?: Date;
  createdAt: Date;
  approver?: {
    id: string;
    firstName: string;
    lastName?: string;
  };
}

export interface ApproveLeaveRequest {
  status: 'approved' | 'rejected';
  comments?: string;
}

export interface Holiday {
  id: string;
  tenantId: string;
  name: string;
  date: Date;
  type: HolidayType;
  applicableLocations?: string[];
  description?: string;
  year: number;
}

export interface CreateHolidayRequest {
  name: string;
  date: string;
  type?: HolidayType;
  applicableLocations?: string[];
  description?: string;
}

export interface LeaveBalanceSummary {
  leaveTypeId: string;
  leaveTypeName: string;
  leaveTypeCode: string;
  entitlement: number;
  used: number;
  pending: number;
  available: number;
}

export interface TeamLeaveCalendar {
  date: string;
  employees: {
    employeeId: string;
    employeeName: string;
    leaveType: string;
    status: LeaveRequestStatus;
  }[];
}

export interface LeaveRequestListFilters {
  employeeId?: string;
  leaveTypeId?: string;
  status?: LeaveRequestStatus;
  fromDate?: string;
  toDate?: string;
  departmentId?: string;
}
