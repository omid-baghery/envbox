import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    env: {
      ENCRYPTION_KEY:
        "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    },
  },
});
