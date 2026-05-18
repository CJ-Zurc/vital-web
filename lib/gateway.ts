import { env } from "./env";

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface GatewayUser {
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

export interface GatewayApiResponse<T = null> {
  success: boolean;
  message: string;
  data?: T;
}

export class GatewayRequestError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "GatewayRequestError";
    this.status = status;
  }
}

export interface GatewayLoginData {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: GatewayUser;
}

export interface GatewayRegisterData {
  id: string;
  email: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  extension_name?: string;
  is_verified: boolean;
  created_system_slug: string;
  created_at: string;
}

export interface GatewayRefreshData {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: GatewayUser;
}

export interface EHRPatient {
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
  address_street: string | null;
  address_barangay: string | null;
  address_city_municipality: string | null;
  address_province_region: string | null;
  address_postal_code: string | null;
  address_country: string | null;
  contact_number: string | null;
  email: string | null;
  patient_type: string | null;
  blood_type: string | null;
  philhealth_identification_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface GatewaySSOExchangeData {
  exchange_token: string;
  expires_in: number;
  target_client_id: string;
}

// â”€â”€â”€ Base fetcher â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

async function gatewayFetch<T>(
  path: string,
  options: RequestInit = {},
  accessToken?: string,
  refreshToken?: string,
): Promise<T> {
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

  const res = await fetch(`${env.GATEWAY_URL}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 404) {
    return { success: false, message: "Not found" } as T;
  }

  const json = await res.json();

  if (!res.ok) {
    throw new GatewayRequestError(
      res.status,
      json?.message ?? json?.detail ?? "Gateway request failed",
    );
  }

  return json as T;
}

// â”€â”€â”€ Auth â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function gatewayRegister(data: {
  email: string;
  password: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  extension_name?: string;
}): Promise<GatewayApiResponse<GatewayRegisterData>> {
  return gatewayFetch<GatewayApiResponse<GatewayRegisterData>>(
    "/auth/register",
    {
      method: "POST",
      body: JSON.stringify({
        ...data,
        client_id: env.VITAL_CLIENT_ID,
      }),
    },
  );
}

export async function gatewayLogin(data: {
  email: string;
  password: string;
}): Promise<GatewayApiResponse<GatewayLoginData>> {
  return gatewayFetch<GatewayApiResponse<GatewayLoginData>>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify({
        ...data,
        client_id: env.VITAL_CLIENT_ID,
        client_secret: env.VITAL_CLIENT_SECRET,
      }),
    },
  );
}

export async function gatewayVerifyEmail(data: {
  email: string;
  code: string;
}): Promise<GatewayApiResponse<GatewayLoginData>> {
  return gatewayFetch<GatewayApiResponse<GatewayLoginData>>(
    "/auth/verify/confirm",
    {
      method: "POST",
      body: JSON.stringify({
        ...data,
        client_id: env.VITAL_CLIENT_ID,
        client_secret: env.VITAL_CLIENT_SECRET,
      }),
    },
  );
}

export async function gatewayVerify2FA(data: {
  email: string;
  code: string;
}): Promise<GatewayApiResponse<GatewayLoginData>> {
  return gatewayFetch<GatewayApiResponse<GatewayLoginData>>(
    "/auth/login/verify",
    {
      method: "POST",
      body: JSON.stringify({
        ...data,
        client_id: env.VITAL_CLIENT_ID,
        client_secret: env.VITAL_CLIENT_SECRET,
      }),
    },
  );
}

export async function gatewayResendVerification(
  email: string,
): Promise<GatewayApiResponse> {
  return gatewayFetch<GatewayApiResponse>("/auth/verify/resend", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function gatewayForgotPassword(
  email: string,
): Promise<GatewayApiResponse> {
  return gatewayFetch<GatewayApiResponse>("/auth/password/forgot", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function gatewayResetPassword(data: {
  email: string;
  code: string;
  new_password: string;
}): Promise<GatewayApiResponse> {
  return gatewayFetch<GatewayApiResponse>("/auth/password/reset", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function gatewayRefresh(
  refreshToken: string,
): Promise<GatewayApiResponse<GatewayRefreshData>> {
  return gatewayFetch<GatewayApiResponse<GatewayRefreshData>>(
    "/auth/refresh",
    { method: "POST" },
    undefined,
    refreshToken,
  );
}

export async function gatewayLogout(
  accessToken: string,
  refreshToken: string,
): Promise<GatewayApiResponse> {
  return gatewayFetch<GatewayApiResponse>(
    "/auth/logout",
    { method: "POST" },
    accessToken,
    refreshToken,
  );
}

export async function gatewayGetMe(
  accessToken: string,
): Promise<GatewayApiResponse<GatewayUser>> {
  return gatewayFetch<GatewayApiResponse<GatewayUser>>(
    "/auth/users/me",
    { method: "GET" },
    accessToken,
  );
}

export async function gatewaySSOExchange(
  accessToken: string,
  targetClientId: string,
): Promise<GatewayApiResponse<GatewaySSOExchangeData>> {
  return gatewayFetch<GatewayApiResponse<GatewaySSOExchangeData>>(
    "/auth/sso/exchange",
    {
      method: "POST",
      body: JSON.stringify({ target_client_id: targetClientId }),
    },
    accessToken,
  );
}

export async function gatewaySSOCallback(
  exchangeToken: string,
): Promise<GatewayApiResponse<GatewayLoginData>> {
  return gatewayFetch<GatewayApiResponse<GatewayLoginData>>(
    "/auth/sso/callback",
    {
      method: "POST",
      body: JSON.stringify({
        exchange_token: exchangeToken,
        client_id: env.VITAL_CLIENT_ID,
        client_secret: env.VITAL_CLIENT_SECRET,
      }),
    },
  );
}

// â”€â”€â”€ EHR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function gatewayGetEHRPatientMe(
  accessToken: string,
): Promise<GatewayApiResponse<EHRPatient>> {
  return gatewayFetch<GatewayApiResponse<EHRPatient>>(
    "/ehr/patients/me",
    { method: "GET" },
    accessToken,
  );
}

export async function gatewayGetEHRPatientByAuthId(
  authId: string,
  accessToken: string,
): Promise<GatewayApiResponse<EHRPatient>> {
  return gatewayFetch<GatewayApiResponse<EHRPatient>>(
    `/ehr/patients/by-auth-id/${authId}`,
    { method: "GET" },
    accessToken,
  );
}

export async function gatewayCreateEHRPatient(
  data: {
    first_name: string;
    middle_name?: string;
    last_name: string;
    extension_name?: string;
    date_of_birth: string;
    sex: string;
    religion?: string;
    address_street?: string;
    address_barangay?: string;
    address_city_municipality?: string;
    address_province_region?: string;
    address_postal_code?: string;
    address_country?: string;
    contact_number?: string;
    email: string;
    patient_type?: string;
    blood_type?: string;
    philhealth_identification_number?: string;
  },
  accessToken: string,
): Promise<GatewayApiResponse<EHRPatient>> {
  return gatewayFetch<GatewayApiResponse<EHRPatient>>(
    "/ehr/patients",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    accessToken,
  );
}

export async function gatewayCreatePatientSelf(
  data: {
    first_name: string;
    middle_name?: string;
    last_name: string;
    extension_name?: string;
    date_of_birth: string;
    sex: string;
    religion?: string;
    address_street?: string;
    address_barangay?: string;
    address_city_municipality?: string;
    address_province_region?: string;
    address_postal_code?: string;
    address_country?: string;
    contact_number?: string;
    email: string;
    patient_type?: string;
    blood_type?: string;
    philhealth_identification_number?: string;
  },
  accessToken: string,
): Promise<GatewayApiResponse<EHRPatient>> {
  return gatewayFetch<GatewayApiResponse<EHRPatient>>(
    "/ehr/patients/me",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    accessToken,
  );
}

export async function gatewayClaimEHRPatient(
  patientId: string,
  secretKey: string,
  accessToken: string,
): Promise<GatewayApiResponse<EHRPatient>> {
  return gatewayFetch<GatewayApiResponse<EHRPatient>>(
    `/ehr/patients/${patientId}/claim`,
    {
      method: "POST",
      body: JSON.stringify({ secret_key: secretKey }),
    },
    accessToken,
  );
}

export async function gatewaySearchEHRPatients(
  query: string,
  accessToken: string,
): Promise<GatewayApiResponse<EHRPatient[]>> {
  return gatewayFetch<GatewayApiResponse<EHRPatient[]>>(
    `/ehr/patients?search=${encodeURIComponent(query)}&limit=10`,
    { method: "GET" },
    accessToken,
  );
}
export async function gatewayUpdateEHRPatient(
  patientId: string,
  data: {
    contact_number?: string;
    email?: string;
    religion?: string;
    address_street?: string;
    address_barangay?: string;
    address_city_municipality?: string;
    address_province_region?: string;
    address_postal_code?: string;
    address_country?: string;
    blood_type?: string;
    philhealth_identification_number?: string;
    patient_type?: string;
  },
  accessToken: string,
): Promise<GatewayApiResponse<EHRPatient>> {
  return gatewayFetch<GatewayApiResponse<EHRPatient>>(
    `/ehr/patients/${patientId}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
    accessToken,
  );
}