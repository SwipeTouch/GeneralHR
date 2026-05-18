const STORAGE_KEY = 'ghr_portal_tokens';

export type PortalLinkTtl = '24h' | '72h' | '7d';

export interface PortalTokenRecord {
  token: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  expiresAt: string;
  createdAt: string;
  createdBy: string;
}

const TTL_HOURS: Record<PortalLinkTtl, number> = {
  '24h': 24,
  '72h': 72,
  '7d': 168,
};

function loadAll(): PortalTokenRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PortalTokenRecord[]) : [];
  } catch {
    return [];
  }
}

function saveAll(records: PortalTokenRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function createPortalLink(
  candidateId: string,
  candidateName: string,
  candidateEmail: string,
  ttl: PortalLinkTtl,
  createdBy = 'HR',
): PortalTokenRecord {
  const token = crypto.randomUUID().replace(/-/g, '');
  const now = new Date();
  const expiresAt = new Date(now.getTime() + TTL_HOURS[ttl] * 60 * 60 * 1000);

  const record: PortalTokenRecord = {
    token,
    candidateId,
    candidateName,
    candidateEmail,
    expiresAt: expiresAt.toISOString(),
    createdAt: now.toISOString(),
    createdBy,
  };

  const all = loadAll().filter((r) => r.candidateId !== candidateId || new Date(r.expiresAt) > now);
  all.push(record);
  saveAll(all);
  return record;
}

export function getPortalLinkUrl(token: string): string {
  const base = window.location.origin;
  return `${base}/upload/${token}`;
}

export function resolvePortalToken(token: string): PortalTokenRecord | null {
  const record = loadAll().find((r) => r.token === token);
  if (!record) return null;
  if (new Date(record.expiresAt) <= new Date()) return null;
  return record;
}

export function listActivePortalLinks(): PortalTokenRecord[] {
  const now = new Date();
  return loadAll()
    .filter((r) => new Date(r.expiresAt) > now)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function revokePortalToken(token: string) {
  saveAll(loadAll().filter((r) => r.token !== token));
}
