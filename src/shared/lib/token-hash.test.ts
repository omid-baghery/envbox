import { describe, it, expect } from "vitest";
import { hashSecret, generateSecret, previewSecret } from "./token-hash";

describe("hashSecret", () => {
  it("returns a 64-character hex string", () => {
    const hash = hashSecret("test");
    expect(hash.length).toBe(64);
  });

  it("same input produces same output", () => {
    const a = hashSecret("hello");
    const b = hashSecret("hello");
    expect(a).toBe(b);
  });

  it("different input produces different output", () => {
    const a = hashSecret("hello");
    const b = hashSecret("world");
    expect(a).not.toBe(b);
  });
});

describe("generateSecret", () => {
  it("starts with the given prefix", () => {
    const secret = generateSecret("evb_sk");
    expect(secret.startsWith("evb_sk_")).toBe(true);
  });

  it("generates different values each time", () => {
    const a = generateSecret("evb_sk");
    const b = generateSecret("evb_sk");
    expect(a).not.toBe(b);
  });
});

describe("previewSecret", () => {
  it("shortens long secrets", () => {
    const secret = "evb_sk_a1b2c3d4e5f6g7h8i9j0";
    const preview = previewSecret(secret);
    expect(preview).toBe("evb_sk_a1b…i9j0");
    expect(preview.length).toBeLessThan(secret.length);
  });

  it("returns short secrets unchanged", () => {
    const secret = "short";
    const preview = previewSecret(secret);
    expect(preview).toBe("short");
  });
});
