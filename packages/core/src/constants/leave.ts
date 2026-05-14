export const DEFAULT_LEAVE_TYPES = [
  {
    code: 'CL',
    name: 'Casual Leave',
    isPaid: true,
    requiresApproval: true,
    requiresDocument: false,
    minDaysNotice: 1,
    maxConsecutiveDays: 3,
  },
  {
    code: 'SL',
    name: 'Sick Leave',
    isPaid: true,
    requiresApproval: true,
    requiresDocument: true,
    minDaysNotice: 0,
    maxConsecutiveDays: 7,
  },
  {
    code: 'EL',
    name: 'Earned Leave',
    isPaid: true,
    requiresApproval: true,
    requiresDocument: false,
    minDaysNotice: 7,
    maxConsecutiveDays: 15,
  },
  {
    code: 'CO',
    name: 'Compensatory Off',
    isPaid: true,
    requiresApproval: true,
    requiresDocument: false,
    minDaysNotice: 1,
    maxConsecutiveDays: 1,
  },
  {
    code: 'ML',
    name: 'Maternity Leave',
    isPaid: true,
    requiresApproval: true,
    requiresDocument: true,
    minDaysNotice: 30,
    maxConsecutiveDays: 182,
  },
  {
    code: 'PL',
    name: 'Paternity Leave',
    isPaid: true,
    requiresApproval: true,
    requiresDocument: true,
    minDaysNotice: 7,
    maxConsecutiveDays: 15,
  },
  {
    code: 'LOP',
    name: 'Loss of Pay',
    isPaid: false,
    requiresApproval: true,
    requiresDocument: false,
    minDaysNotice: 1,
    maxConsecutiveDays: null,
  },
];

export const LEAVE_REQUEST_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'processing' },
  { value: 'approved', label: 'Approved', color: 'success' },
  { value: 'rejected', label: 'Rejected', color: 'error' },
  { value: 'cancelled', label: 'Cancelled', color: 'default' },
];

export const ACCRUAL_TYPES = [
  { value: 'annual', label: 'Annual' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'pro_rata', label: 'Pro-rata' },
];

export const APPLICABLE_TO_OPTIONS = [
  { value: 'all', label: 'All Employees' },
  { value: 'department', label: 'Specific Department' },
  { value: 'designation', label: 'Specific Designation' },
  { value: 'grade', label: 'Specific Grade' },
];

export const HOLIDAY_TYPES = [
  { value: 'mandatory', label: 'Mandatory Holiday', color: 'red' },
  { value: 'optional', label: 'Optional Holiday', color: 'blue' },
  { value: 'restricted', label: 'Restricted Holiday', color: 'orange' },
];
