import { env } from "./env";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UHSEUser {
  id: string;
  email: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  extension_name?: string;
  is_verified: boolean;
  is_active: boolean;
  is_admin: boolean;
  is_super_admin: boolean;
  profile_picture_url?: string;
  systems: string[];
  admin_systems: string[];
  system_roles: Record<string, string[]>;
  created_at: string;
  updated_at: string;
}
export interface UHSELoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: UHSEUser;
}

export interface UHSERegisterResponse {
  id: string;
  email: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  extension_name?: string;
  is_verified: boolean;
  created_at: string;
}

export interface UHSEApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// ─── Base fetcher ─────────────────────────────────────────────────────────────

async function uhseFetch<T>(
  path: string,
  options: RequestInit = {},
  accessToken?: string,
  refreshToken?: string,
): Promise<UHSEApiResponse<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  if (refreshToken) {
    headers["Cookie"] = `refresh_token=${refreshToken}`;
  }

  const res = await fetch(`${env.UHSE_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.message ?? json?.detail ?? "UHSE request failed");
  }

  return json;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function uhseRegister(data: {
  email: string;
  password: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  extension_name?: string;
}) {
  return uhseFetch<UHSERegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      ...data,
      client_id: env.VITAL_CLIENT_ID,
    }),
  });
}

export async function uhseVerifyEmail(data: {
  email: string;
  code: string;
}) {
  return uhseFetch<UHSELoginResponse>("/auth/verify/confirm", {
    method: "POST",
    body: JSON.stringify({
      ...data,
      client_id: env.VITAL_CLIENT_ID,
      client_secret: env.VITAL_CLIENT_SECRET,
    }),
  });
}

export async function uhseResendVerification(email: string) {
  return uhseFetch("/auth/verify/resend", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function uhseLogin(data: {
  email: string;
  password: string;
}) {
  return uhseFetch<UHSELoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      ...data,
      client_id: env.VITAL_CLIENT_ID,
      client_secret: env.VITAL_CLIENT_SECRET,
    }),
  });
}

export async function uhseRefresh(refreshToken: string) {
  return uhseFetch<{
    access_token: string;
    expires_in: number;
    user: UHSEUser;
  }>("/auth/refresh", {
    method: "POST",
  }, undefined, refreshToken);
}

export async function uhseLogout(
  accessToken: string,
  refreshToken: string,
) {
  return uhseFetch("/auth/logout", {
    method: "POST",
  }, accessToken, refreshToken);
}

export async function uhseGetMe(accessToken: string) {
  return uhseFetch<UHSEUser>("/auth/users/me", {
    method: "GET",
  }, accessToken);
}

export async function uhseForgotPassword(email: string) {
  return uhseFetch("/auth/password/forgot", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function uhseResetPassword(data: {
  email: string;
  code: string;
  new_password: string;
}) {
  return uhseFetch("/auth/password/reset", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ─── SSO ──────────────────────────────────────────────────────────────────────

export async function uhseSSOExchange(
  accessToken: string,
  targetClientId: string,
) {
  return uhseFetch<{ exchange_token: string; expires_in: number }>(
    "/auth/sso/exchange",  // fixed path
    {
      method: "POST",
      body: JSON.stringify({ target_client_id: targetClientId }),
    },
    accessToken,
  );
}

export async function uhseSSOCallback(exchangeToken: string) {
  return uhseFetch<UHSELoginResponse>("/auth/sso/callback", {  // fixed path
    method: "POST",
    body: JSON.stringify({
      exchange_token: exchangeToken,
      client_id: env.VITAL_CLIENT_ID,
      client_secret: env.VITAL_CLIENT_SECRET,
    }),
  });
}

// ─── EHR Patient Integration ──────────────────────────────────────────────────

export interface PatientRecordOut {
  patient_id: string;
  auth_id: string | null;
  user_id: string | null;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  extension_name: string | null;
  date_of_birth: string;
  sex: string;
  religion: string | null;
  address_street: string;
  address_barangay: string;
  address_city_municipality: string;
  address_province_region: string;
  address_postal_code: string | null;
  address_country: string;
  contact_number: string | null;
  email: string | null;
  patient_type: string;
  blood_type: string | null;
  philhealth_identification_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface EhrApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// Base fetcher for EHR
async function ehrFetch<T>(
  path: string,
  options: RequestInit = {},
  accessToken?: string,
): Promise<EhrApiResponse<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${env.EHR_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.message ?? json?.detail ?? "EHR request failed");
  }

  return json;
}

// Get patient record by auth_id (for logged-in user)
export async function ehrGetPatientByAuthId(accessToken: string) {
  return ehrFetch<PatientRecordOut>("/patients/me", {
    method: "GET",
  }, accessToken);
}

// Create patient record
export async function ehrCreatePatient(
  data: {
    first_name: string;
    middle_name?: string;
    last_name: string;
    extension_name?: string;
    date_of_birth: string; // YYYY-MM-DD
    sex: string;
    religion?: string;
    address_street: string;
    address_barangay: string;
    address_city_municipality: string;
    address_province_region: string;
    address_postal_code?: string;
    address_country?: string;
    contact_number?: string;
    email?: string;
    patient_type: string;
    blood_type?: string;
    philhealth_identification_number?: string;
  },
  accessToken: string,
) {
  return ehrFetch<PatientRecordOut>("/patients", {
    method: "POST",
    body: JSON.stringify(data),
  }, accessToken);
}

// Update patient record
export async function ehrUpdatePatient(
  patientId: string,
  data: Partial<{
    first_name: string;
    middle_name: string;
    last_name: string;
    extension_name: string;
    date_of_birth: string;
    sex: string;
    religion: string;
    address_street: string;
    address_barangay: string;
    address_city_municipality: string;
    address_province_region: string;
    address_postal_code: string;
    address_country: string;
    contact_number: string;
    email: string;
    patient_type: string;
    blood_type: string;
    philhealth_identification_number: string;
  }>,
  accessToken: string,
) {
  return ehrFetch<PatientRecordOut>(`/patients/${patientId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  }, accessToken);
}