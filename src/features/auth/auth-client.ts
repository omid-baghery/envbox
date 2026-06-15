import { createAuthClient } from "better-auth/react";

// یه فایل هلپر برای کار با اث توی کلاینت ساید
export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
});
