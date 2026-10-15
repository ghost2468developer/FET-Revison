import { OAuth2Client } from "google-auth-library";

export interface GoogleIdentity {
  googleId: string;
  email: string;
  name: string;
  picture: string | null;
}

/**
 * Verify the ID token returned by Google Identity Services
 * (the modern "Sign in with Google" button).
 */
export async function verifyGoogleToken(credential: string): Promise<GoogleIdentity> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    const e = new Error(
      "Google sign-in is not configured yet. Set GOOGLE_CLIENT_ID on the server (see README → Google setup)."
    );
    (e as any).extensions = { code: "BAD_USER_INPUT" };
    throw e;
  }
  const client = new OAuth2Client(clientId);
  const ticket = await client.verifyIdToken({ idToken: credential, audience: clientId });
  const payload = ticket.getPayload();
  if (!payload || !payload.email) {
    throw new Error("The Google token is missing an email address.");
  }
  return {
    googleId: String(payload.sub),
    email: String(payload.email).toLowerCase(),
    name: payload.name || String(payload.email).split("@")[0],
    picture: payload.picture || null,
  };
}
