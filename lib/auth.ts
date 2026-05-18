import { cookies } from "next/headers";
import { decodeToken, getVitalRole, isTokenExpired } from "./jwt";

export function extractBearerToken(authorizationHeader: string | null): string | null {
  if (!authorizationHeader) {
    return null;
  }

  const match = authorizationHeader.trim().match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

export async function getSession() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken || isTokenExpired(accessToken)) {
    return null;
  }

  try {
    const role = getVitalRole(accessToken);
    return { accessToken, role };
  } catch {
    return null;
  }
}

export async function requireSession() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}