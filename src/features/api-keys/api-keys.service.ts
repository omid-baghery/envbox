import { randomBytes } from "crypto";

export function generateApiKey(): string {
  return `envbox_sk_${randomBytes(32).toString("hex")}`;
}
