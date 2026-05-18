import { NextRequest, NextResponse } from "next/server";
import { decodeToken, getVitalRole, isTokenExpired } from "./jwt";
import { GatewayRequestError, gatewayBootstrapSessionWithHeaders } from "./gateway";

export function extractBearerToken(authorizationHeader: string | null): string | null {
  if (!authorizationHeader) {
    return null;
  }

  const match = authorizationHeader.trim().match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

export interface BffSession {
  accessToken: string;
  authId: string;
  email?: string;
  role: string;
  setCookie?: string | null;
}

function sessionFromAccessToken(accessToken: string, setCookie?: string | null): BffSession {
  const decoded = decodeToken(accessToken);
  return {
    accessToken,
    authId: decoded.sub,
    email: decoded.email,
    role: getVitalRole(accessToken),
    setCookie,
  };
}

export async function resolveBffSession(req: NextRequest): Promise<BffSession | null> {
  const accessToken = extractBearerToken(req.headers.get("authorization"));
  if (accessToken && !isTokenExpired(accessToken)) {
    return sessionFromAccessToken(accessToken);
  }

  const refreshToken = req.cookies.get("refresh_token")?.value;
  if (!refreshToken) {
    return null;
  }

  const gatewaySession = await gatewayBootstrapSessionWithHeaders(refreshToken);
  if (!gatewaySession.data.success || !gatewaySession.data.data?.access_token) {
    return null;
  }

  return sessionFromAccessToken(
    gatewaySession.data.data.access_token,
    gatewaySession.headers.get("set-cookie"),
  );
}

export async function requireBffSession(req: NextRequest): Promise<BffSession> {
  const session = await resolveBffSession(req);
  if (!session) {
    throw new GatewayRequestError(401, "Unauthorized.");
  }
  return session;
}

export function attachBffSessionHeaders(response: NextResponse, session: BffSession): NextResponse {
  response.headers.set("X-New-Access-Token", session.accessToken);
  if (session.setCookie) {
    response.headers.append("Set-Cookie", session.setCookie);
  }
  return response;
}
