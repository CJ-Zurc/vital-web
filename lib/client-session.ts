"use client";

type ClientSessionData = {
  access_token: string;
  role?: string;
  vitalUserId?: string;
  authId?: string;
  isOnboardingComplete?: boolean;
  isRecordAvailable?: boolean;
};

let accessToken: string | null = null;
let sessionData: ClientSessionData | null = null;

export function setClientSession(data: ClientSessionData) {
  accessToken = data.access_token;
  sessionData = data;
}

export function clearClientSession() {
  accessToken = null;
  sessionData = null;
}

export function getClientSession() {
  return sessionData;
}

export async function getAccessToken(): Promise<string | null> {
  if (accessToken) {
    return accessToken;
  }

  const response = await fetch("/api/auth/session", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });
  const payload = await response.json().catch(() => null);
  const token = payload?.data?.access_token;

  if (!response.ok || !token) {
    return null;
  }

  setClientSession({
    access_token: token,
    authId: payload.data.claims?.sub,
    role: payload.data.claims?.systemRoles?.vital?.[0] ?? "patient",
  });
  return token;
}

export async function authFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const token = await getAccessToken();
  if (!token) {
    return new Response(
      JSON.stringify({ success: false, message: "Unauthorized." }),
      { status: 401, headers: { "Content-Type": "application/json" } },
    );
  }

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(input, {
    ...init,
    headers,
    credentials: "include",
  });

  const rotatedToken = response.headers.get("X-New-Access-Token");
  if (rotatedToken) {
    accessToken = rotatedToken;
    sessionData = sessionData ? { ...sessionData, access_token: rotatedToken } : { access_token: rotatedToken };
  }

  return response;
}
