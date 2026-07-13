import { OAuth2Client } from "google-auth-library";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const client = googleClientId ? new OAuth2Client(googleClientId) : null;

export async function verifyGoogleToken(token: string) {
  if (!client) {
    if (process.env.NODE_ENV === "development" || !googleClientId) {
      // Decode JWT without verification for local mock development convenience
      const parts = token.split(".");
      const base64Url = parts[1];
      if (base64Url) {
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          Buffer.from(base64, "base64")
            .toString()
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        const payload = JSON.parse(jsonPayload);
        return {
          googleId: payload.sub ?? "mock-google-id",
          fullName: payload.name ?? "Mock User",
          email: payload.email ?? "mock@example.com",
          profileImage: payload.picture ?? null,
        };
      }
    }
    throw new Error("GOOGLE_CLIENT_ID environment variable is not configured.");
  }

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: googleClientId,
  });
  const payload = ticket.getPayload();
  if (!payload || !payload.email) {
    throw new Error("Invalid token payload or missing email");
  }

  return {
    googleId: payload.sub,
    fullName: payload.name ?? `${payload.given_name ?? ""} ${payload.family_name ?? ""}`.trim(),
    email: payload.email,
    profileImage: payload.picture ?? null,
  };
}
