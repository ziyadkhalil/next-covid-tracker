export const config = {
  auth0Id: process.env.AUTH0_CLIENT_ID!,
  auth0Secret: process.env.AUTH0_CLIENT_SECRET!,
  auth0Issuer: process.env.AUTH0_ISSUER!,
  auth0PubCert: process.env.AUTH0_PUB_CERT!,
  auth0MgmtToken: process.env.MGMT_API_TOKEN!,
  dbURL: process.env.DATABASE_URL!,
  mapAccessToken: process.env.NEXT_PUBLIC_MapboxAccessToken!,
};
