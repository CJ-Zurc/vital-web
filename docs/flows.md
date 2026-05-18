# Flows

## Login

1. Browser posts credentials to `POST /api/auth/login`.
2. VITAL_WEB forwards credentials and VITAL client credentials to Gateway `/auth/login`.
3. Gateway forwards to UHSE_AUTH and passes back the access token plus refresh cookie.
4. VITAL_WEB creates or finds the local `VitalUser` record.
5. Browser stores the access token in memory and routes by VITAL role and onboarding state.

## Session Bootstrap

1. Browser calls `GET /api/auth/session` after reload.
2. VITAL_WEB sends the refresh cookie to Gateway `GET /auth/session`.
3. Gateway refreshes through UHSE_AUTH and returns a fresh access token and sanitized claims.
4. Browser stores the access token in memory for later `/api/*` calls.

## Patient Onboarding

1. Browser calls local patient BFF routes with the in-memory bearer token.
2. VITAL_WEB resolves the session from Authorization or Gateway session bootstrap.
3. If an EHR record exists, VITAL_WEB reads it through `GET /ehr/patients/me` and updates editable fields through the patient-owned flow.
4. If no EHR record exists, VITAL_WEB creates it through `POST /ehr/patients/me`.
5. EHR marks the Auth profile stale after self-registration or claim.
6. VITAL_WEB refreshes the session so future tokens include the new EHR patient role.
