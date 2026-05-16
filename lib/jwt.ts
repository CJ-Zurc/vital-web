import { jwtDecode } from "jwt-decode";

export interface UHSETokenPayload {
  sub: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  extensionName?: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  systemRoles: Record<string, string[]>; // array not string
  systems: string[];
  adminSystems: string[];
  profilePictureUrl?: string;
  jti: string;
  iat: number;
  exp: number;
}

export function decodeToken(token: string): UHSETokenPayload {
  return jwtDecode<UHSETokenPayload>(token);
}

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = decodeToken(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function getVitalRole(token: string): string {
  const decoded = decodeToken(token);
  // Check isAdmin flag first
  if (decoded.isAdmin) return "admin";
  // Then check systemRoles array
  const roles = decoded.systemRoles?.["vital"] ?? [];
  return roles[0] ?? "patient";
}