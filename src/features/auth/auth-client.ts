import { createAuthClient } from "better-auth/react";

// یه فایل هلپر برای کار با اث توی کلاینت ساید
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});
