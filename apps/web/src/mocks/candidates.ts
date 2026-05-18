import type { Candidate } from '@/types';

export const mockCandidates: Candidate[] = [
  {
    id: 'cand-001',
    fullName: 'Jane Candidate',
    email: 'jane.candidate@example.com',
    phone: '+91 98765 43210',
    status: 'OFFERED',
    portalEnabled: true,
    notes: 'Strong backend profile. Offer sent 12 May.',
    lastComment: {
      preview: 'Offer letter shared. Awaiting document upload.',
      createdAt: '2026-05-14T10:30:00Z',
      authorName: 'Priya HR',
    },
    documentsSummary: { total: 4, submitted: 2, hasDraft: true },
    comments: [
      {
        id: 'cm-1',
        content: 'Initial screening completed — moving to offer stage.',
        authorName: 'Priya HR',
        createdAt: '2026-05-10T09:00:00Z',
      },
      {
        id: 'cm-2',
        content: 'Offer letter shared. Awaiting document upload.',
        authorName: 'Priya HR',
        createdAt: '2026-05-14T10:30:00Z',
      },
    ],
    documents: [
      { id: 'doc-1', documentType: 'ID Proof', fileName: 'aadhaar.pdf', status: 'submitted', isLocked: true, uploadedAt: '2026-05-15T08:00:00Z' },
      { id: 'doc-2', documentType: 'PAN', fileName: 'pan.pdf', status: 'submitted', isLocked: true, uploadedAt: '2026-05-15T08:05:00Z' },
      { id: 'doc-3', documentType: 'Address Proof', fileName: 'utility_bill.pdf', status: 'draft', isLocked: false, uploadedAt: '2026-05-16T11:00:00Z' },
      { id: 'doc-4', documentType: 'Photo', fileName: '', status: 'draft', isLocked: false, uploadedAt: '' },
    ],
  },
  {
    id: 'cand-002',
    fullName: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 91234 56789',
    status: 'TECH_ROUND_2',
    portalEnabled: false,
    lastComment: {
      preview: 'Tech round 1 cleared. Scheduled round 2 for Monday.',
      createdAt: '2026-05-13T14:00:00Z',
      authorName: 'Amit Lead',
    },
    documentsSummary: { total: 0, submitted: 0, hasDraft: false },
    comments: [
      {
        id: 'cm-3',
        content: 'Tech round 1 cleared. Scheduled round 2 for Monday.',
        authorName: 'Amit Lead',
        createdAt: '2026-05-13T14:00:00Z',
      },
    ],
    documents: [],
  },
  {
    id: 'cand-003',
    fullName: 'Sneha Patel',
    email: 'sneha.patel@example.com',
    status: 'JOINED',
    portalEnabled: false,
    lastComment: {
      preview: 'Joined on 1 May. Onboarding complete.',
      createdAt: '2026-05-01T09:00:00Z',
      authorName: 'Priya HR',
    },
    documentsSummary: { total: 4, submitted: 4, hasDraft: false },
    comments: [
      {
        id: 'cm-4',
        content: 'All documents verified and submitted.',
        authorName: 'Priya HR',
        createdAt: '2026-04-28T16:00:00Z',
      },
      {
        id: 'cm-5',
        content: 'Joined on 1 May. Onboarding complete.',
        authorName: 'Priya HR',
        createdAt: '2026-05-01T09:00:00Z',
      },
    ],
    documents: [
      { id: 'doc-5', documentType: 'ID Proof', fileName: 'passport.pdf', status: 'submitted', isLocked: true, uploadedAt: '2026-04-25T10:00:00Z' },
      { id: 'doc-6', documentType: 'PAN', fileName: 'pan_sneha.pdf', status: 'submitted', isLocked: true, uploadedAt: '2026-04-25T10:05:00Z' },
    ],
  },
  {
    id: 'cand-004',
    fullName: 'Vikram Singh',
    email: 'vikram.singh@example.com',
    status: 'NOT_RESPONDING',
    portalEnabled: false,
    lastComment: {
      preview: 'No response after 3 follow-up emails.',
      createdAt: '2026-05-08T11:00:00Z',
      authorName: 'Priya HR',
    },
    documentsSummary: { total: 0, submitted: 0, hasDraft: false },
    comments: [
      {
        id: 'cm-6',
        content: 'No response after 3 follow-up emails.',
        authorName: 'Priya HR',
        createdAt: '2026-05-08T11:00:00Z',
      },
    ],
    documents: [],
  },
  {
    id: 'cand-005',
    fullName: 'Anita Desai',
    email: 'anita.desai@example.com',
    phone: '+91 99887 76655',
    status: 'SCREENED',
    portalEnabled: false,
    documentsSummary: { total: 0, submitted: 0, hasDraft: false },
    comments: [],
    documents: [],
  },
];

export function getCandidateById(id: string): Candidate | undefined {
  return mockCandidates.find((c) => c.id === id);
}
