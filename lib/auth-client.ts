import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";
import { inferAdditionalFields } from "better-auth/client/plugins";

// Better-auth requires an absolute base URL. In the browser we reuse the
// current origin so Next.js rewrites can proxy /api/* to the NestJS backend;
// on the server we fall back to the configured origin for SSR.
const SSR_ORIGIN = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";
const origin = typeof window !== "undefined" ? window.location.origin : SSR_ORIGIN;

export const authClient = createAuthClient({
  baseURL: `${origin}/api/v1/auth`,
  plugins: [
    organizationClient(),
    inferAdditionalFields({
      user: {
        onboardingCompleted: {
          type: "boolean",
          defaultValue: false,
        },
      },
    }),
  ],
});

export const { signUp, signIn, signOut, useSession, getSession } = authClient;
