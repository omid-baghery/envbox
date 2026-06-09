import { encrypt, decrypt } from "@/shared/lib/encryption";

export async function GET() {
  const original = "postgres://my-secret-url";
  const encrypted = encrypt(original);
  const decrypted = decrypt(encrypted);

  return Response.json({
    original,
    encrypted,
    decrypted,
    match: original === decrypted,
  });
}
