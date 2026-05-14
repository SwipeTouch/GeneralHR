export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^\+?[\d\s-]{10,15}$/;
export const EMPLOYEE_CODE_REGEX = /^[A-Z0-9]{3,10}$/;

export const FILE_SIZE_LIMITS = {
  resume: 5 * 1024 * 1024, // 5MB
  document: 10 * 1024 * 1024, // 10MB
  profilePicture: 2 * 1024 * 1024, // 2MB
};

export const ALLOWED_FILE_TYPES = {
  resume: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  document: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'],
  profilePicture: ['image/jpeg', 'image/png', 'image/jpg'],
};

export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 20,
  maxLimit: 100,
};

export const DATE_FORMATS = {
  display: 'DD/MM/YYYY',
  input: 'YYYY-MM-DD',
  datetime: 'DD/MM/YYYY HH:mm',
  iso: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
};

export const VALIDATION_MESSAGES = {
  required: (field: string) => `${field} is required`,
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  password: 'Password must be at least 8 characters with uppercase, lowercase, number and special character',
  minLength: (field: string, length: number) => `${field} must be at least ${length} characters`,
  maxLength: (field: string, length: number) => `${field} must not exceed ${length} characters`,
  fileSize: (limit: number) => `File size must not exceed ${limit / (1024 * 1024)}MB`,
  fileType: (types: string[]) => `Allowed file types: ${types.join(', ')}`,
  dateRange: 'End date must be after start date',
  futureDate: 'Date must be in the future',
  pastDate: 'Date must be in the past',
};
