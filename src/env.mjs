import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NEXT_PUBLIC_MY_SECRET_TOKEN: z.string(),
    NEXT_PUBLIC_PAYMENT_PAGE_UID: z.string(),
    NEXT_PUBLIC_TERMINAL_UID: z.string(),
    NEXT_PUBLIC_TAX_UID: z.string(),
    NEXT_PUBLIC_TICKETS_UID: z.string(),
    NEXT_PUBLIC_PAYPLUS_URL: z.string(),
    NEXT_PUBLIC_PAYPLUS_KEY: z.string(),
    NEXT_PUBLIC_PAYPLUS_SECRET: z.string(),
    RESEND_API_KEY: z.string(), 
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string(),
    NEXT_PUBLIC_CLOUDINARY_API_KEY: z.string(),
    CLOUDINARY_API_SECRET: z.string(),
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string().min(1)
        : z.string().min(1).optional(),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string().min(1) : z.string().url()
    ),
    // Add `.min(1) on ID and SECRET if you want to make sure they're not empty
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_PAYPLUS_URL: z.string(),
    NEXT_PUBLIC_MY_SECRET_TOKEN: z.string(),
    NEXT_PUBLIC_PAYPLUS_KEY: z.string(),
    NEXT_PUBLIC_PAYPLUS_SECRET: z.string(),
    NEXT_PUBLIC_TERMINAL_UID: z.string(),
    NEXT_PUBLIC_TAX_UID: z.string()
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NEXT_PUBLIC_PAYMENT_PAGE_UID: process.env.NEXT_PUBLIC_PAYMENT_PAGE_UID,
    NEXT_PUBLIC_TERMINAL_UID: process.env.NEXT_PUBLIC_TERMINAL_UID,
    NEXT_PUBLIC_TAX_UID: process.env.NEXT_PUBLIC_TAX_UID,
    NEXT_PUBLIC_TICKETS_UID: process.env.NEXT_PUBLIC_TICKETS_UID,
    NEXT_PUBLIC_PAYPLUS_URL: process.env.NEXT_PUBLIC_PAYPLUS_URL,
    NEXT_PUBLIC_MY_SECRET_TOKEN: process.env.NEXT_PUBLIC_MY_SECRET_TOKEN,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    NEXT_PUBLIC_CLOUDINARY_API_KEY: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXT_PUBLIC_PAYPLUS_KEY: process.env.NEXT_PUBLIC_PAYPLUS_KEY,
    NEXT_PUBLIC_PAYPLUS_SECRET: process.env.NEXT_PUBLIC_PAYPLUS_SECRET,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
