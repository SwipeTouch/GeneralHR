import type { AttendanceRecord, Employee } from '@/types';

export const mockEmployees: Employee[] = [
  {
    id: 'emp-001',
    employeeCode: 'EMP001',
    fullName: 'John Staff',
    email: 'john.staff@demo.local',
    phone: '+91 90000 11111',
    department: 'Engineering',
    joiningDate: '2024-01-15',
    status: 'active',
  },
  {
    id: 'emp-002',
    employeeCode: 'EMP002',
    fullName: 'Meera Nair',
    email: 'meera.nair@demo.local',
    department: 'HR',
    joiningDate: '2023-06-01',
    status: 'active',
  },
  {
    id: 'emp-003',
    employeeCode: 'EMP003',
    fullName: 'Raj Kumar',
    email: 'raj.kumar@demo.local',
    department: 'Finance',
    joiningDate: '2025-02-10',
    status: 'active',
  },
  {
    id: 'emp-004',
    employeeCode: 'EMP004',
    fullName: 'Former Employee',
    department: 'Operations',
    joiningDate: '2020-03-01',
    status: 'inactive',
  },
];

export const mockAttendance: AttendanceRecord[] = [
  {
    id: 'att-1',
    employeeCode: 'EMP001',
    employeeName: 'John Staff',
    date: '2026-05-16',
    checkIn: '09:02',
    checkOut: '18:15',
    source: 'biometric',
  },
  {
    id: 'att-2',
    employeeCode: 'EMP002',
    employeeName: 'Meera Nair',
    date: '2026-05-16',
    checkIn: '09:45',
    checkOut: '18:00',
    source: 'manual',
  },
  {
    id: 'att-3',
    employeeCode: 'EMP001',
    employeeName: 'John Staff',
    date: '2026-05-15',
    checkIn: '09:00',
    checkOut: '17:50',
    source: 'file_import',
  },
];
