import { passkey } from '@better-auth/passkey';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { twoFactor } from 'better-auth/plugins';

import { db } from '@/db';
import * as schema from '@/db/auth-schema';
import { env } from '@/lib/env';

const SESSION_CACHE_MAX_AGE_MINUTES = 5;
const SECONDS_PER_MINUTE = 60;

export const auth = betterAuth({
  appName: 'pdf-editor',
  plugins: [
    passkey({
      rpID: env.NODE_ENV === 'development' ? 'localhost' : undefined,
    }),
    twoFactor({
      otpOptions: {
        sendOTP: async ({ user: _user, otp: _otp }) => {
          // OTP sending via email service not yet implemented
        },
      },
    }),
  ],
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: SESSION_CACHE_MAX_AGE_MINUTES * SECONDS_PER_MINUTE,
    },
  },
  emailVerification: {
    sendOnSignIn: true,
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user: _user, url: _url }) => {
      // Email verification sending via email service not yet implemented
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user: _user, url: _url }) => {
      // Password reset email sending via email service not yet implemented
    },
  },
  trustedOrigins:
    env.NODE_ENV === 'development'
      ? ['http://localhost:3000']
      : [`https://${process.env.VERCEL_URL ?? ''}`],
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
});

type SessionResult = Awaited<ReturnType<typeof auth.api.getSession>>;
export type Session = Extract<SessionResult, { user: object; session: object }>;
