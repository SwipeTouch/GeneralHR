# Authentication & RBAC Design

## 1. Overview

The HRMS application uses JWT-based authentication with a granular Role-Based Access Control (RBAC) system. This document details the security architecture, authentication flow, and permission model.

**Hosting note:** Refresh tokens and rate-limit stores may use **Redis** when available; on Plesk-only stacks they can be stored in **MySQL** instead. Diagrams that mention Redis assume the optional component.

## 2. Authentication Architecture

### 2.1 Token Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                      TOKEN ARCHITECTURE                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       ACCESS TOKEN                               │
├─────────────────────────────────────────────────────────────────┤
│  • Short-lived (15 minutes)                                     │
│  • Contains: userId, tenantId, userType, email                  │
│  • Sent in Authorization header                                  │
│  • Stateless verification (no DB lookup)                        │
│  • Used for API authorization                                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      REFRESH TOKEN                               │
├─────────────────────────────────────────────────────────────────┤
│  • Long-lived (7 days)                                          │
│  • Contains: userId, tokenId (for revocation)                   │
│  • Stored in Redis **or** MySQL for validation (see system architecture)      │
│  • Sent as HttpOnly cookie or in request body                   │
│  • Used only for obtaining new access tokens                    │
│  • Token rotation on each refresh                               │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Token Payload Structure

**Access Token:**
```typescript
interface AccessTokenPayload {
  userId: string;
  tenantId: string;
  userType: UserType;
  email: string;
  iat: number;  // Issued at
  exp: number;  // Expiration
}
```

**Refresh Token:**
```typescript
interface RefreshTokenPayload {
  userId: string;
  tokenId: string;  // Unique ID for this refresh token
  iat: number;
  exp: number;
}
```

### 2.3 Authentication Flow

```
┌──────────┐     ┌───────────┐     ┌───────────┐     ┌───────────┐
│  Client  │     │    API    │     │   Redis   │     │   MySQL   │
└────┬─────┘     └─────┬─────┘     └─────┬─────┘     └─────┬─────┘
     │                 │                 │                 │
     │ 1. POST /login  │                 │                 │
     │ (email, pass)   │                 │                 │
     │────────────────>│                 │                 │
     │                 │                 │                 │
     │                 │ 2. Fetch user   │                 │
     │                 │─────────────────────────────────>│
     │                 │                 │                 │
     │                 │ 3. User data    │                 │
     │                 │<─────────────────────────────────│
     │                 │                 │                 │
     │                 │ 4. Verify password (bcrypt)      │
     │                 │────────┐        │                 │
     │                 │        │        │                 │
     │                 │<───────┘        │                 │
     │                 │                 │                 │
     │                 │ 5. Generate tokens               │
     │                 │────────┐        │                 │
     │                 │        │        │                 │
     │                 │<───────┘        │                 │
     │                 │                 │                 │
     │                 │ 6. Store refresh token           │
     │                 │ (key: refresh:{userId}:{tokenId})│
     │                 │────────────────>│                 │
     │                 │                 │                 │
     │ 7. Return tokens│                 │                 │
     │ + user data     │                 │                 │
     │<────────────────│                 │                 │
     │                 │                 │                 │

     --- Later: Token Refresh ---

     │                 │                 │                 │
     │ 8. POST /refresh│                 │                 │
     │ (refreshToken)  │                 │                 │
     │────────────────>│                 │                 │
     │                 │                 │                 │
     │                 │ 9. Verify refresh token exists   │
     │                 │────────────────>│                 │
     │                 │                 │                 │
     │                 │ 10. Token valid │                 │
     │                 │<────────────────│                 │
     │                 │                 │                 │
     │                 │ 11. Delete old, create new       │
     │                 │────────────────>│                 │
     │                 │                 │                 │
     │ 12. New tokens  │                 │                 │
     │<────────────────│                 │                 │
```

### 2.4 Token Refresh Flow

```typescript
// Refresh token key pattern in Redis
const refreshTokenKey = `refresh:${userId}:${tokenId}`;

// Token rotation: on each refresh
// 1. Validate current refresh token exists in Redis
// 2. Delete current refresh token
// 3. Generate new refresh token with new tokenId
// 4. Store new refresh token in Redis
// 5. Return new access + refresh tokens
```

### 2.5 Logout Flow

```typescript
// On logout
// 1. Delete refresh token from Redis
// 2. Optionally: add access token to blacklist (short TTL)

// Logout from all devices
// Delete all refresh tokens for user
const pattern = `refresh:${userId}:*`;
```

## 3. Multi-Tenant Authentication

### 3.1 Tenant Resolution

```
┌─────────────────────────────────────────────────────────────────┐
│                    TENANT RESOLUTION                             │
└─────────────────────────────────────────────────────────────────┘

Request arrives → Extract tenant identifier → Validate tenant → Set context

Tenant can be identified by:
1. Subdomain: acme.hrms.com → tenant = "acme"
2. Header: X-Tenant-ID: uuid
3. JWT: tenantId in access token payload

Resolution order:
1. JWT token (if authenticated)
2. Subdomain
3. X-Tenant-ID header (fallback)
```

### 3.2 Tenant Middleware

```typescript
// Pseudo-code for tenant middleware
async function tenantMiddleware(req, res, next) {
  let tenantId = null;
  
  // 1. Try to get from authenticated user
  if (req.user?.tenantId) {
    tenantId = req.user.tenantId;
  }
  
  // 2. Try subdomain
  if (!tenantId) {
    const subdomain = extractSubdomain(req.hostname);
    if (subdomain) {
      const tenant = await getTenantBySubdomain(subdomain);
      tenantId = tenant?.id;
    }
  }
  
  // 3. Try header (for API clients)
  if (!tenantId) {
    tenantId = req.headers['x-tenant-id'];
  }
  
  if (!tenantId) {
    return res.status(400).json({ error: 'Tenant not identified' });
  }
  
  // Validate tenant exists and is active
  const tenant = await validateTenant(tenantId);
  if (!tenant) {
    return res.status(404).json({ error: 'Tenant not found' });
  }
  
  // Set tenant context
  req.tenantId = tenantId;
  req.tenant = tenant;
  
  next();
}
```

## 4. RBAC Model

### 4.1 Permission Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                       RBAC HIERARCHY                             │
└─────────────────────────────────────────────────────────────────┘

    TENANT
       │
       ├── ROLE 1
       │      │
       │      ├── PERMISSION (MenuItem + Action)
       │      │      ├── EMPLOYEES:create
       │      │      ├── EMPLOYEES:read
       │      │      ├── EMPLOYEES:update
       │      │      └── EMPLOYEES:delete
       │      │
       │      └── PERMISSION
       │             ├── LEAVE_REQUESTS:read
       │             └── LEAVE_REQUESTS:update
       │
       └── ROLE 2
              │
              └── PERMISSION
                     └── MY_PROFILE:read,update

    USER
       │
       ├── ROLE 1
       └── ROLE 2

    Effective Permissions = Union of all Role Permissions
```

### 4.2 Permission Format

```
{MENU_ITEM_CODE}:{action}

Examples:
- EMPLOYEES:read
- EMPLOYEES:create
- LEAVE_REQUESTS:update
- RECRUITMENT_CASES:delete
```

### 4.3 Default System Roles

| Role | Description | Key Permissions |
|------|-------------|-----------------|
| Super Admin | Full system access | All permissions |
| HR Admin | Full HR module access | RECRUITMENT:*, HR:*, EXIT:* |
| Recruiter | Recruitment only | JOB_POSTINGS:*, CANDIDATES:*, RECRUITMENT_CASES:* |
| Manager | Team management | EMPLOYEES:read, LEAVE_REQUESTS:read,update |
| Employee | Self-service | MY_PROFILE:*, MY_LEAVES:*, MY_DOCUMENTS:read |
| Candidate | Pre-onboarding | MY_PROFILE:read,update, MY_DOCUMENTS:create |
| Lifetime | Ex-employee | MY_PROFILE:read, MY_DOCUMENTS:read |

### 4.4 Permission Check Logic

```typescript
// Check if user has permission
function hasPermission(
  userPermissions: string[],
  requiredPermission: string
): boolean {
  const [resource, action] = requiredPermission.split(':');
  
  // Check for exact match
  if (userPermissions.includes(requiredPermission)) {
    return true;
  }
  
  // Check for wildcard (all actions on resource)
  if (userPermissions.includes(`${resource}:*`)) {
    return true;
  }
  
  // Check for super admin (all permissions)
  if (userPermissions.includes('*')) {
    return true;
  }
  
  return false;
}

// Example usage in middleware
function requirePermission(permission: string) {
  return (req, res, next) => {
    if (!hasPermission(req.user.permissions, permission)) {
      return res.status(403).json({
        success: false,
        message: 'Permission denied',
        code: 'FORBIDDEN'
      });
    }
    next();
  };
}

// Route usage
router.get('/employees', 
  requirePermission('EMPLOYEES:read'),
  employeeController.list
);
```

### 4.5 Loading User Permissions

```typescript
// On login or token refresh, load user's effective permissions
async function loadUserPermissions(userId: string): Promise<string[]> {
  const userRoles = await prisma.userRole.findMany({
    where: { userId },
    include: {
      role: {
        include: {
          rolePermissions: {
            where: { isGranted: true },
            include: {
              permission: {
                include: {
                  menuItem: true
                }
              }
            }
          }
        }
      }
    }
  });
  
  const permissions = new Set<string>();
  
  for (const userRole of userRoles) {
    for (const rolePermission of userRole.role.rolePermissions) {
      const permission = rolePermission.permission;
      const menuCode = permission.menuItem.code;
      const action = permission.action;
      permissions.add(`${menuCode}:${action}`);
    }
  }
  
  return Array.from(permissions);
}
```

## 5. Permission Matrix UI

### 5.1 Role Permission Editor

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Role: Team Lead                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Module: HR                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Menu Item          │ Create │ Read │ Update │ Delete │               │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │ Employees          │   ☐    │  ☑   │   ☐    │   ☐   │               │   │
│  │ Departments        │   ☐    │  ☑   │   ☐    │   ☐   │               │   │
│  │ Leave Requests     │   ☐    │  ☑   │   ☑    │   ☐   │               │   │
│  │ Leave Types        │   ☐    │  ☑   │   ☐    │   ☐   │               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Module: Recruitment                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Menu Item          │ Create │ Read │ Update │ Delete │               │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │ Job Postings       │   ☐    │  ☑   │   ☐    │   ☐   │               │   │
│  │ Candidates         │   ☐    │  ☑   │   ☐    │   ☐   │               │   │
│  │ Cases              │   ☐    │  ☑   │   ☐    │   ☐   │               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  [Save Permissions]                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 API for Permission Matrix

```typescript
// GET /api/v1/admin/roles/:id/permissions
{
  "roleId": "uuid",
  "roleName": "Team Lead",
  "modules": [
    {
      "name": "HR",
      "code": "hr",
      "menuItems": [
        {
          "id": "uuid",
          "name": "Employees",
          "code": "EMPLOYEES",
          "permissions": {
            "create": false,
            "read": true,
            "update": false,
            "delete": false
          }
        }
      ]
    }
  ]
}

// PUT /api/v1/admin/roles/:id/permissions
{
  "permissions": [
    { "menuItemId": "uuid", "create": false, "read": true, "update": true, "delete": false },
    { "menuItemId": "uuid", "create": false, "read": true, "update": false, "delete": false }
  ]
}
```

## 6. Security Measures

### 6.1 Password Security

```typescript
// Password hashing configuration
const BCRYPT_ROUNDS = 12;

// Password validation rules
const passwordPolicy = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true,
  specialChars: '@$!%*?&',
  maxLength: 128
};

// Password validation regex
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
```

### 6.2 Rate Limiting

```typescript
// Rate limit configurations
const rateLimits = {
  login: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts
    message: 'Too many login attempts, please try again later'
  },
  passwordReset: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    message: 'Too many password reset requests'
  },
  api: {
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
    message: 'Rate limit exceeded'
  }
};
```

### 6.3 Account Lockout

```typescript
// Account lockout after failed attempts
const lockoutPolicy = {
  maxFailedAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
  trackingWindow: 15 * 60 * 1000 // 15 minutes
};

// Track failed attempts in Redis
const failedAttemptsKey = `failed_login:${tenantId}:${email}`;
```

### 6.4 Session Management

```typescript
// Session configuration
const sessionConfig = {
  accessTokenExpiry: '15m',
  refreshTokenExpiry: '7d',
  maxActiveSessions: 5, // per user
  sessionIdleTimeout: 30 * 60 * 1000 // 30 minutes
};
```

### 6.5 Security Headers

```typescript
// Security headers middleware
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'",
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};
```

## 7. Frontend Integration

### 7.1 Auth Context

```typescript
// React auth context structure
interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  refreshToken: () => Promise<void>;
}
```

### 7.2 Permission-based Rendering

```tsx
// Permission check hook
function usePermission(permission: string): boolean {
  const { user } = useAuth();
  return user?.permissions.some(p => 
    p === permission || 
    p === `${permission.split(':')[0]}:*` ||
    p === '*'
  ) ?? false;
}

// Permission gate component
function PermissionGate({ 
  permission, 
  children, 
  fallback = null 
}: {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const hasPermission = usePermission(permission);
  return hasPermission ? <>{children}</> : <>{fallback}</>;
}

// Usage
<PermissionGate permission="EMPLOYEES:create">
  <Button onClick={handleCreate}>Add Employee</Button>
</PermissionGate>
```

### 7.3 Route Protection

```tsx
// Protected route component
function ProtectedRoute({ 
  permission, 
  children 
}: {
  permission?: string;
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const hasPermission = permission ? usePermission(permission) : true;
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!hasPermission) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
}

// Route configuration
<Route 
  path="/hr/employees" 
  element={
    <ProtectedRoute permission="EMPLOYEES:read">
      <EmployeesPage />
    </ProtectedRoute>
  } 
/>
```

### 7.4 Dynamic Navigation

```tsx
// Generate navigation based on permissions
function useNavigationItems() {
  const { user } = useAuth();
  const hasPermission = usePermission;
  
  const navigationItems = useMemo(() => {
    return allNavigationItems.filter(item => {
      if (!item.permission) return true;
      return hasPermission(item.permission);
    });
  }, [user?.permissions]);
  
  return navigationItems;
}
```

## 8. Audit Logging

### 8.1 Security Events to Log

| Event | Data Logged |
|-------|-------------|
| Login Success | userId, ip, userAgent, timestamp |
| Login Failure | email, ip, userAgent, reason |
| Logout | userId, ip, timestamp |
| Password Change | userId, ip, timestamp |
| Password Reset Request | email, ip, timestamp |
| Permission Denied | userId, permission, endpoint, ip |
| Token Refresh | userId, ip, timestamp |
| Role Change | userId, oldRoles, newRoles, changedBy |

### 8.2 Audit Log Entry

```typescript
interface SecurityAuditLog {
  id: string;
  tenantId: string;
  userId?: string;
  event: string;
  eventType: 'auth' | 'permission' | 'admin';
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}
```

---

## Next Steps

1. Review and approve this authentication & RBAC design
2. Proceed to [Recruitment Module Design](./05-RECRUITMENT-MODULE.md)
