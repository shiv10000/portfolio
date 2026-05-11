import {
  ADMIN_COOKIE_NAME,
  createAdminToken,
  isAdminPassword,
} from '@/lib/admin-auth';

export async function POST(request: Request) {
  const {password} = (await request.json().catch(() => ({}))) as {
    password?: string;
  };

  if (!isAdminPassword(password ?? '')) {
    return Response.json({message: 'Invalid password'}, {status: 401});
  }

  const response = Response.json({ok: true});
  response.headers.append(
    'Set-Cookie',
    `${ADMIN_COOKIE_NAME}=${createAdminToken()}; HttpOnly; Path=/; SameSite=Lax; Max-Age=86400`,
  );

  return response;
}
