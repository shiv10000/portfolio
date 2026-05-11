import {ADMIN_COOKIE_NAME} from '@/lib/admin-auth';

export async function POST() {
  const response = Response.json({ok: true});
  response.headers.append(
    'Set-Cookie',
    `${ADMIN_COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`,
  );

  return response;
}
