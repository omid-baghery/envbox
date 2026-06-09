import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

// AES-256-GCM: industry standard encryption
// 256-bit key = practically unbreakable
// GCM mode = encryption + tamper detection
const ALGORITHM = "aes-256-gcm";
const ENCODING = "hex"; // output format: 0-9 and a-f characters only

// Reads the encryption key from environment variables
// Key is 64 hex characters = 32 bytes = 256 bits
// This key lives on Vercel, NEVER in the database
function getKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) throw new Error("ENCRYPTION_KEY is not set");
  // Convert hex string to raw bytes that crypto can use
  return Buffer.from(key, "hex");
}

/**
 * Encrypts plaintext into a secure string.
 *
 * Process:
 * 1. Generate random IV (Initialization Vector)
 * 2. Create cipher using key + IV
 * 3. Encrypt the data
 * 4. Get auth tag (tamper-proof seal)
 * 5. Bundle everything: iv:authTag:encryptedData
 *
 * @param plaintext - The secret value to encrypt (e.g. "postgres://...")
 * @returns Encrypted string like "abc123:def456:789xyz..."
 *
 * Example:
 *   encrypt("hello") → "a1b2c3:d4e5f6:7g8h9i..."
 *   encrypt("hello") → "x9y8z7:w6v5u4:t3s2r1..."
 *   Same input, different output each time (thanks to random IV)
 */
export function encrypt(plaintext: string): string {
  const key = getKey();

  // IV (Initialization Vector): 12 random bytes = 96 bits
  // Like salt on food — changes the output even for same input
  // Prevents attackers from spotting patterns
  const iv = randomBytes(12);

  // Create the encryption engine
  // Needs: algorithm type, secret key, and the IV
  const cipher = createCipheriv(ALGORITHM, key, iv);

  // Feed data through the cipher
  // "utf8" = input is normal text
  // "hex" = output as hex characters
  let encrypted = cipher.update(plaintext, "utf8", ENCODING);

  // Finalize encryption — close the lock
  encrypted += cipher.final(ENCODING);

  // Auth Tag: cryptographic seal that proves data wasn't tampered with
  // If someone changes even one character of encrypted data, decryption will fail
  const authTag = cipher.getAuthTag();

  // Store all 3 pieces separated by ":"
  // IV and AuthTag are public info (like a car's license plate)
  // The actual secret is the KEY, which is stored separately on Vercel
  return `${iv.toString(ENCODING)}:${authTag.toString(ENCODING)}:${encrypted}`;
}

/**
 * Decrypts an encrypted string back to original plaintext.
 *
 * Process:
 * 1. Split the bundle into IV, authTag, and encrypted data
 * 2. Recreate the decryption engine with same key + IV
 * 3. Set the auth tag (checks for tampering)
 * 4. Decrypt back to original text
 *
 * @param cipherText - The encrypted string (iv:authTag:data)
 * @returns Original plaintext string
 *
 * Example:
 *   decrypt("a1b2c3:d4e5f6:7g8h9i...") → "hello"
 *
 * Throws error if:
 *   - Data was tampered with (auth tag mismatch)
 *   - Wrong encryption key
 *   - Invalid format
 */
export function decrypt(cipherText: string): string {
  const key = getKey();

  // Unpack the 3 parts we stored during encryption
  const [ivHex, authTagHex, encrypted] = cipherText.split(":");

  // Convert hex strings back to raw bytes
  const iv = Buffer.from(ivHex, ENCODING);
  const authTag = Buffer.from(authTagHex, ENCODING);

  // Create the decryption engine
  // Must use the SAME key and SAME IV that were used during encryption
  const decipher = createDecipheriv(ALGORITHM, key, iv);

  // Apply the auth tag — this is the tamper check
  // If someone modified the data, this line will throw an error
  decipher.setAuthTag(authTag);

  // Feed encrypted data through the decipher
  // "hex" = input is hex characters
  // "utf8" = output as normal text
  let decrypted = decipher.update(encrypted, ENCODING, "utf8");

  // Finalize decryption
  decrypted += decipher.final("utf8");

  return decrypted;
}
