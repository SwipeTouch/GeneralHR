import { PrismaClient, UserRole, CandidateStatus, SalaryHeadType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.upsert({
    where: { subdomain: 'demo' },
    update: {},
    create: {
      name: 'Demo Company',
      subdomain: 'demo',
      status: 'active',
      settings: {
        create: {
          maxUploadMb: 5,
          allowedDocumentTypes: ['ID_PROOF', 'PAN', 'ADDRESS_PROOF', 'PHOTO'],
          attendanceImportFormat: {
            employeeCode: 'employee_code',
            date: 'date',
            checkIn: 'in_time',
            checkOut: 'out_time',
          },
          hrNotificationEmails: ['hr@demo.local'],
        },
      },
    },
  });

  // Placeholder password — replace with bcrypt hash when auth is implemented
  const hrUser = await prisma.user.upsert({
    where: {
      tenantId_email: { tenantId: tenant.id, email: 'hr@demo.local' },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'hr@demo.local',
      passwordHash: '$2a$12$placeholder.change.me',
      role: UserRole.hr_admin,
    },
  });

  await prisma.salaryHead.createMany({
    data: [
      { tenantId: tenant.id, code: 'BASIC', name: 'Basic Salary', type: SalaryHeadType.earning, sortOrder: 1 },
      { tenantId: tenant.id, code: 'HRA', name: 'HRA', type: SalaryHeadType.earning, sortOrder: 2 },
      { tenantId: tenant.id, code: 'PF', name: 'Provident Fund', type: SalaryHeadType.deduction, sortOrder: 3 },
    ],
    skipDuplicates: true,
  });

  const candidate = await prisma.candidate.create({
    data: {
      tenantId: tenant.id,
      fullName: 'Jane Candidate',
      email: 'jane.candidate@example.com',
      phone: '+919999999999',
      status: CandidateStatus.OFFERED,
      portalEnabled: true,
      createdById: hrUser.id,
      comments: {
        create: {
          tenantId: tenant.id,
          content: 'Initial screening completed — moving to offer stage.',
          createdById: hrUser.id,
        },
      },
    },
  });

  await prisma.user.upsert({
    where: {
      tenantId_email: { tenantId: tenant.id, email: 'jane.candidate@example.com' },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'jane.candidate@example.com',
      passwordHash: '$2a$12$placeholder.change.me',
      role: UserRole.candidate,
      candidateId: candidate.id,
    },
  });

  await prisma.employee.create({
    data: {
      tenantId: tenant.id,
      employeeCode: 'EMP001',
      fullName: 'John Staff',
      email: 'john.staff@demo.local',
      department: 'Engineering',
      status: 'active',
    },
  });

  console.log('Seed complete.');
  console.log('  Tenant:', tenant.subdomain);
  console.log('  HR login:', 'hr@demo.local (password not set — implement auth next)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
