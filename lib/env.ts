export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  VITAL_CLIENT_ID: process.env.VITAL_CLIENT_ID ?? process.env.VITAL_AUTH_CLIENT_ID!,
  VITAL_CLIENT_SECRET: process.env.VITAL_CLIENT_SECRET ?? process.env.VITAL_AUTH_CLIENT_SECRET!,
  GATEWAY_URL: process.env.GATEWAY_URL ?? "http://localhost:8080",
}
