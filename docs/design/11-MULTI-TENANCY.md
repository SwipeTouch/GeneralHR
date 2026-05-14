# Multi-Tenancy Design

## 1. Overview

The HRMS application supports multiple tenants (organizations) on a shared infrastructure while maintaining complete data isolation and allowing per-tenant customization.

## 2. Multi-Tenancy Strategy

### 2.1 Approach: Shared Database with Row-Level Isolation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      MULTI-TENANCY ARCHITECTURE                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           APPLICATION LAYER                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│    ┌────────────┐    ┌────────────┐    ┌────────────┐                       │
│    │  Tenant A  │    │  Tenant B  │    │  Tenant C  │                       │
│    │  acme.hrms │    │  beta.hrms │    │ gamma.hrms │                       │
│    └─────┬──────┘    └─────┬──────┘    └─────┬──────┘                       │
│          │                 │                 │                               │
│          └─────────────────┼─────────────────┘                               │
│                            │                                                 │
│                            ▼                                                 │
│                   ┌─────────────────┐                                       │
│                   │   API Server    │                                       │
│                   │  (Tenant-Aware) │                                       │
│                   └────────┬────────┘                                       │
│                            │                                                 │
└────────────────────────────┼────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│    ┌────────────────────────────────────────────────────────────────────┐   │
│    │                      SHARED DATABASE                                │   │
│    │                                                                     │   │
│    │  ┌──────────────────────────────────────────────────────────────┐  │   │
│    │  │ employees                                                     │  │   │
│    │  ├──────────────────────────────────────────────────────────────┤  │   │
│    │  │ id │ tenant_id │ name     │ email           │ ...            │  │   │
│    │  │ 1  │ tenant-a  │ John Doe │ john@acme.com   │                │  │   │
│    │  │ 2  │ tenant-b  │ Jane Doe │ jane@beta.com   │                │  │   │
│    │  │ 3  │ tenant-a  │ Bob Smith│ bob@acme.com    │                │  │   │
│    │  └──────────────────────────────────────────────────────────────┘  │   │
│    │                                                                     │   │
│    │  All tables have tenant_id column for isolation                    │   │
│    │                                                                     │   │
│    └────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Why Shared Database?

| Approach | Pros | Cons |
|----------|------|------|
| **Shared DB (chosen)** | Simple ops, cost-effective, easy updates | Query complexity, potential noisy neighbor |
| Separate Schema | Better isolation, per-tenant backup | Migration complexity, connection overhead |
| Separate DB | Maximum isolation, compliance-friendly | Highest cost, complex management |

**Our Choice: Shared Database** because:
- Simpler deployment and maintenance
- Cost-effective for SaaS model
- Easy to roll out updates to all tenants
- Sufficient isolation with proper implementation

## 3. Tenant Identification

### 3.1 Identification Methods

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       TENANT IDENTIFICATION FLOW                             │
└─────────────────────────────────────────────────────────────────────────────┘

Request arrives at API
         │
         ▼
┌─────────────────────┐
│ 1. Check JWT Token  │  If authenticated, tenant_id is in token
└────────┬────────────┘
         │ No token?
         ▼
┌─────────────────────┐
│ 2. Check Subdomain  │  acme.hrms.com → tenant = "acme"
└────────┬────────────┘
         │ No subdomain?
         ▼
┌─────────────────────┐
│ 3. Check Header     │  X-Tenant-ID: uuid
└────────┬────────────┘
         │ No header?
         ▼
┌─────────────────────┐
│   Return Error      │  400 Bad Request: Tenant not identified
└─────────────────────┘
```

### 3.2 Subdomain Resolution

```typescript
// middleware/tenant.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../shared/database';

interface TenantRequest extends Request {
  tenantId?: string;
  tenant?: Tenant;
}

export async function tenantMiddleware(
  req: TenantRequest,
  res: Response,
  next: NextFunction
) {
  try {
    let tenantId: string | null = null;
    
    // 1. Try JWT token (authenticated requests)
    if (req.user?.tenantId) {
      tenantId = req.user.tenantId;
    }
    
    // 2. Try subdomain
    if (!tenantId) {
      const host = req.hostname;
      const subdomain = extractSubdomain(host);
      
      if (subdomain && subdomain !== 'www' && subdomain !== 'api') {
        const tenant = await prisma.tenant.findUnique({
          where: { subdomain },
        });
        if (tenant) {
          tenantId = tenant.id;
        }
      }
    }
    
    // 3. Try header (for API clients)
    if (!tenantId) {
      tenantId = req.headers['x-tenant-id'] as string;
    }
    
    // Validate tenant
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: 'Tenant not identified',
        code: 'TENANT_NOT_FOUND',
      });
    }
    
    const tenant = await getTenantById(tenantId);
    
    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found',
        code: 'TENANT_NOT_FOUND',
      });
    }
    
    if (tenant.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Tenant is not active',
        code: 'TENANT_INACTIVE',
      });
    }
    
    // Set tenant context
    req.tenantId = tenantId;
    req.tenant = tenant;
    
    next();
  } catch (error) {
    next(error);
  }
}

function extractSubdomain(host: string): string | null {
  // acme.hrms.com → acme
  // hrms.com → null
  const parts = host.split('.');
  if (parts.length > 2) {
    return parts[0];
  }
  return null;
}
```

## 4. Data Isolation

### 4.1 Query Scoping

Every database query MUST be scoped to the tenant:

```typescript
// repositories/employee.repository.ts
import { prisma } from '../shared/database';

export class EmployeeRepository {
  constructor(private tenantId: string) {}
  
  // All queries automatically scoped to tenant
  async findAll(filters: EmployeeFilters) {
    return prisma.employee.findMany({
      where: {
        tenantId: this.tenantId, // Always include tenant filter
        ...this.buildFilters(filters),
      },
    });
  }
  
  async findById(id: string) {
    return prisma.employee.findFirst({
      where: {
        id,
        tenantId: this.tenantId, // Prevent cross-tenant access
      },
    });
  }
  
  async create(data: CreateEmployeeData) {
    return prisma.employee.create({
      data: {
        ...data,
        tenantId: this.tenantId, // Ensure tenant is set
      },
    });
  }
}
```

### 4.2 Prisma Client Extension for Tenant Scoping

```typescript
// shared/database/prisma-tenant.ts
import { PrismaClient } from '@prisma/client';

export function createTenantPrisma(tenantId: string) {
  const prisma = new PrismaClient();
  
  return prisma.$extends({
    query: {
      $allModels: {
        async findMany({ args, query }) {
          args.where = { ...args.where, tenantId };
          return query(args);
        },
        async findFirst({ args, query }) {
          args.where = { ...args.where, tenantId };
          return query(args);
        },
        async findUnique({ args, query }) {
          // Add tenant check after finding
          const result = await query(args);
          if (result && 'tenantId' in result && result.tenantId !== tenantId) {
            return null;
          }
          return result;
        },
        async create({ args, query }) {
          args.data = { ...args.data, tenantId };
          return query(args);
        },
        async update({ args, query }) {
          args.where = { ...args.where, tenantId };
          return query(args);
        },
        async delete({ args, query }) {
          args.where = { ...args.where, tenantId };
          return query(args);
        },
      },
    },
  });
}
```

### 4.3 Request Context

```typescript
// shared/context/request-context.ts
import { AsyncLocalStorage } from 'async_hooks';

interface RequestContext {
  tenantId: string;
  userId?: string;
  requestId: string;
}

const asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

export function runWithContext<T>(context: RequestContext, fn: () => T): T {
  return asyncLocalStorage.run(context, fn);
}

export function getContext(): RequestContext | undefined {
  return asyncLocalStorage.getStore();
}

export function getTenantId(): string {
  const context = getContext();
  if (!context?.tenantId) {
    throw new Error('Tenant context not available');
  }
  return context.tenantId;
}

// Middleware to set context
export function contextMiddleware(req: TenantRequest, res: Response, next: NextFunction) {
  const context: RequestContext = {
    tenantId: req.tenantId!,
    userId: req.user?.userId,
    requestId: req.headers['x-request-id'] as string || generateRequestId(),
  };
  
  runWithContext(context, () => next());
}
```

## 5. Tenant Configuration

### 5.1 Configuration Storage

```typescript
// Stored in tenants.config JSON column
interface TenantConfig {
  branding: {
    logoUrl: string;
    primaryColor: string;
    secondaryColor: string;
    companyName: string;
  };
  features: {
    recruitment: { enabled: boolean };
    exit: { enabled: boolean };
    payrollIntegration: { enabled: boolean };
  };
  settings: {
    timezone: string;
    dateFormat: string;
    noticePeriodDays: number;
  };
}
```

### 5.2 Configuration Caching

```typescript
// shared/services/tenant-config.service.ts
import { Redis } from 'ioredis';
import { prisma } from '../database';

const CACHE_TTL = 300; // 5 minutes
const CACHE_PREFIX = 'tenant:config:';

export class TenantConfigService {
  constructor(private redis: Redis) {}
  
  async getConfig(tenantId: string): Promise<TenantConfig> {
    // Try cache first
    const cached = await this.redis.get(`${CACHE_PREFIX}${tenantId}`);
    if (cached) {
      return JSON.parse(cached);
    }
    
    // Fetch from database
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { config: true },
    });
    
    if (!tenant) {
      throw new Error('Tenant not found');
    }
    
    // Merge with defaults
    const config = this.mergeWithDefaults(tenant.config as TenantConfig);
    
    // Cache the result
    await this.redis.setex(
      `${CACHE_PREFIX}${tenantId}`,
      CACHE_TTL,
      JSON.stringify(config)
    );
    
    return config;
  }
  
  async updateConfig(tenantId: string, updates: Partial<TenantConfig>): Promise<void> {
    await prisma.tenant.update({
      where: { id: tenantId },
      data: { config: updates },
    });
    
    // Invalidate cache
    await this.redis.del(`${CACHE_PREFIX}${tenantId}`);
  }
  
  async invalidateCache(tenantId: string): Promise<void> {
    await this.redis.del(`${CACHE_PREFIX}${tenantId}`);
  }
  
  private mergeWithDefaults(config: Partial<TenantConfig>): TenantConfig {
    return {
      branding: {
        logoUrl: '/default-logo.png',
        primaryColor: '#1890ff',
        secondaryColor: '#52c41a',
        companyName: 'Company',
        ...config?.branding,
      },
      features: {
        recruitment: { enabled: true },
        exit: { enabled: true },
        payrollIntegration: { enabled: false },
        ...config?.features,
      },
      settings: {
        timezone: 'Asia/Kolkata',
        dateFormat: 'DD/MM/YYYY',
        noticePeriodDays: 30,
        ...config?.settings,
      },
    };
  }
}
```

## 6. Tenant Onboarding

### 6.1 Tenant Creation Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        TENANT ONBOARDING FLOW                                │
└─────────────────────────────────────────────────────────────────────────────┘

1. Create Tenant
       │
       ▼
┌─────────────────────────────────────────┐
│ • Validate subdomain availability       │
│ • Create tenant record                  │
│ • Set default configuration             │
└─────────────────────────────────────────┘
       │
       ▼
2. Create Admin User
       │
       ▼
┌─────────────────────────────────────────┐
│ • Create user with hr_admin type        │
│ • Assign Super Admin role               │
│ • Send welcome email with credentials   │
└─────────────────────────────────────────┘
       │
       ▼
3. Initialize Seed Data
       │
       ▼
┌─────────────────────────────────────────┐
│ • Create default roles                  │
│ • Create default menu items             │
│ • Create default email templates        │
│ • Create default document templates     │
│ • Create default workflow configurations│
│ • Create default leave types            │
└─────────────────────────────────────────┘
       │
       ▼
4. Tenant Ready
```

### 6.2 Tenant Seeding Service

```typescript
// services/tenant-seeding.service.ts
export class TenantSeedingService {
  async seedTenant(tenantId: string): Promise<void> {
    // Seed in transaction
    await prisma.$transaction(async (tx) => {
      // Create default roles
      await this.createDefaultRoles(tx, tenantId);
      
      // Create permissions for roles
      await this.createDefaultPermissions(tx, tenantId);
      
      // Create email templates
      await this.createEmailTemplates(tx, tenantId);
      
      // Create document templates
      await this.createDocumentTemplates(tx, tenantId);
      
      // Create workflow configurations
      await this.createWorkflowConfigs(tx, tenantId);
      
      // Create default leave types
      await this.createLeaveTypes(tx, tenantId);
      
      // Create default clearance items
      await this.createClearanceItems(tx, tenantId);
    });
  }
  
  private async createDefaultRoles(tx: PrismaClient, tenantId: string) {
    const roles = [
      { name: 'Super Admin', isSystem: true },
      { name: 'HR Admin', isSystem: true },
      { name: 'Recruiter', isSystem: true },
      { name: 'Manager', isSystem: true },
      { name: 'Employee', isSystem: true },
      { name: 'Candidate', isSystem: true },
      { name: 'Lifetime', isSystem: true },
    ];
    
    for (const role of roles) {
      await tx.role.create({
        data: {
          tenantId,
          name: role.name,
          isSystemRole: role.isSystem,
        },
      });
    }
  }
  
  // ... other seeding methods
}
```

## 7. Frontend Tenant Handling

### 7.1 Tenant Context

```typescript
// contexts/TenantContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { TenantConfig } from '@hrms/core';
import { api } from '../services/api';

interface TenantContextType {
  tenantId: string | null;
  config: TenantConfig | null;
  loading: boolean;
  error: Error | null;
}

const TenantContext = createContext<TenantContextType | null>(null);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<TenantContextType>({
    tenantId: null,
    config: null,
    loading: true,
    error: null,
  });
  
  useEffect(() => {
    loadTenantConfig();
  }, []);
  
  const loadTenantConfig = async () => {
    try {
      // Tenant ID is determined by subdomain on the server
      const { data } = await api.get('/config/tenant');
      setState({
        tenantId: data.tenantId,
        config: data.config,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        tenantId: null,
        config: null,
        loading: false,
        error: error as Error,
      });
    }
  };
  
  return (
    <TenantContext.Provider value={state}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  return context;
}
```

### 7.2 Dynamic Theming Based on Tenant

```typescript
// App.tsx
import { ConfigProvider } from 'antd';
import { useTenant } from './contexts/TenantContext';
import { createTheme } from './config/theme';
import { LoadingScreen } from './shared/components';

function App() {
  const { config, loading, error } = useTenant();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (error) {
    return <TenantErrorScreen error={error} />;
  }
  
  const theme = createTheme(config?.branding);
  
  // Set favicon dynamically
  useEffect(() => {
    if (config?.branding?.faviconUrl) {
      const link = document.querySelector("link[rel='icon']") as HTMLLinkElement;
      if (link) {
        link.href = config.branding.faviconUrl;
      }
    }
    
    // Set page title
    if (config?.branding?.companyName) {
      document.title = `${config.branding.companyName} - HRMS`;
    }
  }, [config]);
  
  return (
    <ConfigProvider theme={theme}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}
```

## 8. Client-Specific Customizations

### 8.1 Customization Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CUSTOMIZATION LEVELS                                      │
└─────────────────────────────────────────────────────────────────────────────┘

Level 1: Configuration (All Tenants)
┌─────────────────────────────────────────────────────────────────────────────┐
│ • Branding (logo, colors)                                                   │
│ • Feature flags                                                             │
│ • Workflow stages                                                           │
│ • Email/document templates                                                  │
│ • Custom fields                                                             │
│                                                                              │
│ Implementation: Stored in database, managed via Admin UI                    │
└─────────────────────────────────────────────────────────────────────────────┘

Level 2: CSS Customization (Enterprise Tier)
┌─────────────────────────────────────────────────────────────────────────────┐
│ • Custom CSS overrides                                                      │
│ • Additional styling beyond color themes                                    │
│                                                                              │
│ Implementation: CSS file stored in tenant config, loaded dynamically        │
└─────────────────────────────────────────────────────────────────────────────┘

Level 3: Component Overrides (Enterprise Tier - Rare)
┌─────────────────────────────────────────────────────────────────────────────┐
│ • Custom React components for specific UI elements                          │
│ • Custom form fields                                                        │
│                                                                              │
│ Implementation: Plugin architecture with tenant-specific bundles            │
└─────────────────────────────────────────────────────────────────────────────┘

Level 4: Full Customization (Dedicated Deployment)
┌─────────────────────────────────────────────────────────────────────────────┐
│ • Forked codebase                                                           │
│ • Custom features                                                           │
│ • Separate deployment                                                       │
│                                                                              │
│ Implementation: Separate Git branch, independent deployment                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.2 Recommendation: Configuration-First

For most cases, **avoid code-level customizations**. Instead:

1. **Build configurable features** - Design features to be flexible via configuration
2. **Use feature flags** - Enable/disable features per tenant
3. **Template system** - Allow customization of emails and documents
4. **Custom fields** - Let tenants add their own data fields
5. **Workflow configuration** - Allow customization of process flows

Only resort to code-level customizations for:
- Enterprise tier with dedicated support
- Features that truly cannot be made configurable
- Compliance requirements specific to certain industries

### 8.3 If Code Customization is Required

```
hrms/
├── packages/
│   └── core/                         # Shared core (never customized)
│
├── apps/
│   ├── api/                          # Core API (base for all)
│   └── web/                          # Core Web (base for all)
│
├── tenant-extensions/                # Tenant-specific extensions
│   └── tenant-enterprise-a/
│       ├── api/
│       │   └── custom-module/        # Custom API endpoints
│       └── web/
│           └── components/           # Custom UI components
│
└── deployments/
    ├── standard/                     # Standard multi-tenant deployment
    └── tenant-enterprise-a/          # Dedicated deployment with extensions
```

## 9. Performance Considerations

### 9.1 Tenant-Scoped Caching

```typescript
// Cache keys always include tenant ID
const cacheKey = `tenant:${tenantId}:employees:list:${JSON.stringify(filters)}`;
```

### 9.2 Database Indexes

```sql
-- All tables with tenant_id should have composite indexes
CREATE INDEX idx_employees_tenant_status ON employees(tenant_id, status);
CREATE INDEX idx_leave_requests_tenant_status ON leave_requests(tenant_id, status);
CREATE INDEX idx_recruitment_cases_tenant_stage ON recruitment_cases(tenant_id, current_stage);
```

### 9.3 Rate Limiting Per Tenant

```typescript
// Rate limiter configuration
const rateLimiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 100, // 100 requests per minute per tenant
  keyGenerator: (req) => `${req.tenantId}:${req.ip}`,
});
```

## 10. Security Considerations

### 10.1 Tenant Isolation Checklist

- [ ] All database queries include tenant_id filter
- [ ] JWT tokens include tenant_id
- [ ] File storage paths include tenant_id
- [ ] Cache keys include tenant_id
- [ ] Audit logs are tenant-scoped
- [ ] API responses don't leak cross-tenant data
- [ ] Bulk operations validate tenant for each item

### 10.2 Cross-Tenant Access Prevention

```typescript
// Service-level validation
class EmployeeService {
  async getEmployee(id: string): Promise<Employee | null> {
    const employee = await this.repository.findById(id);
    
    // Double-check tenant even though repository should handle it
    if (employee && employee.tenantId !== this.tenantId) {
      // Log potential security issue
      logger.warn('Cross-tenant access attempt', {
        requestedEmployeeId: id,
        requestedTenant: employee.tenantId,
        currentTenant: this.tenantId,
      });
      return null;
    }
    
    return employee;
  }
}
```

---

## Summary

The multi-tenancy design follows these key principles:

1. **Shared database** with row-level tenant isolation
2. **Subdomain-based** tenant identification
3. **Configuration-driven** customization (not code)
4. **Caching** with tenant-scoped keys
5. **Security** through consistent tenant filtering

This approach balances:
- **Simplicity** - Single codebase, single deployment
- **Flexibility** - Per-tenant configuration
- **Security** - Strict data isolation
- **Performance** - Efficient caching and indexing
- **Scalability** - Horizontal scaling capability
