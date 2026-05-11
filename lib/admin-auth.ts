import {createHmac, timingSafeEqual} from 'node:crypto';

export const ADMIN_COOKIE_NAME = 'shivam_admin_session';

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || '';
}

export function createAdminToken() {
  const secret = getSecret();
  const issuedAt = Date.now().toString();
  const signature = createHmac('sha256', secret).update(issuedAt).digest('hex');

  return `${issuedAt}.${signature}`;
}

export function isValidAdminToken(token?: string) {
  const secret = getSecret();
  if (!secret || !token) return false;

  const [issuedAt, signature] = token.split('.');
  if (!issuedAt || !signature) return false;

  const age = Date.now() - Number(issuedAt);
  if (!Number.isFinite(age) || age < 0 || age > 1000 * 60 * 60 * 24) {
    return false;
  }

  const expected = createHmac('sha256', secret).update(issuedAt).digest('hex');

  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function isAdminPassword(password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD || '';
  if (!adminPassword || !password) return false;

  try {
    return timingSafeEqual(Buffer.from(password), Buffer.from(adminPassword));
  } catch {
    return false;
  }
}
