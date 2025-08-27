import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    SUPABASE_SERVICE_KEY: z.string().min(1),
    BUILDING: z.enum(["true", "false"]).default("false"),
    MODE: z.string().optional(),
    WHATSAPP_LINK: z.url().optional(),
    DISCORD_LINK: z.url().optional(),
    SUPABASE_ANON_KEY: z.string().min(1),
    SUPABASE_URL: z.url().default("http://127.0.0.1:54321"),
  },

  /**
   * The prefix that client-side variables must have. This is enforced both at
   * a type-level and at runtime.
   */
  clientPrefix: "NEXT_PUBLIC_",

  client: {
    NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
    NEXT_PUBLIC_NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_URL: process.env.SUPABASE_URL,
    BUILDING: process.env.BUILDING,
    MODE: process.env.MODE,
    NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV,
    WHATSAPP_LINK: process.env.WHATSAPP_LINK,
    DISCORD_LINK: process.env.DISCORD_LINK,
  },

  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined: true,
});
