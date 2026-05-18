import type { SalaryHead } from '@/types';

export const mockSalaryHeads: SalaryHead[] = [
  { id: 'sh-1', code: 'BASIC', name: 'Basic Salary', type: 'earning', isTaxable: true, sortOrder: 1, isActive: true },
  { id: 'sh-2', code: 'HRA', name: 'House Rent Allowance', type: 'earning', isTaxable: true, sortOrder: 2, isActive: true },
  { id: 'sh-3', code: 'SPECIAL', name: 'Special Allowance', type: 'earning', isTaxable: true, sortOrder: 3, isActive: true },
  { id: 'sh-4', code: 'PF', name: 'Provident Fund', type: 'deduction', isTaxable: false, sortOrder: 4, isActive: true },
  { id: 'sh-5', code: 'PT', name: 'Professional Tax', type: 'deduction', isTaxable: false, sortOrder: 5, isActive: true },
];

export const mockEmployeeSalary: Record<string, { headCode: string; headName: string; type: 'earning' | 'deduction'; amount: number }[]> = {
  'emp-001': [
    { headCode: 'BASIC', headName: 'Basic Salary', type: 'earning', amount: 50000 },
    { headCode: 'HRA', headName: 'House Rent Allowance', type: 'earning', amount: 20000 },
    { headCode: 'SPECIAL', headName: 'Special Allowance', type: 'earning', amount: 10000 },
    { headCode: 'PF', headName: 'Provident Fund', type: 'deduction', amount: 1800 },
    { headCode: 'PT', headName: 'Professional Tax', type: 'deduction', amount: 200 },
  ],
};
