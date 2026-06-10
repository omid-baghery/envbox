import { describe, it, expect } from "vitest";
import { encrypt, decrypt } from "./encryption";

describe("encryption", () => {
  it("encrypt returns a string", () => {
    const result = encrypt("hello");
    expect(typeof result).toBe("string");
  });

  it("encrypt returns different output for same input", () => {
    const a = encrypt("hello");
    const b = encrypt("hello");
    expect(a).not.toBe(b); // IV random باعث تفاوت میشه
  });

  it("decrypt returns original text", () => {
    const original = "postgres://user:pass@localhost:5432/db";
    const encrypted = encrypt(original);
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(original);
  });

  it("encrypt output has three parts separated by colon", () => {
    const result = encrypt("test");
    const parts = result.split(":");
    expect(parts.length).toBe(3); // iv:authTag:encrypted
  });

  it("handles special characters", () => {
    const original = "!@#$%^&*()_+{}[]|:<>?~`-=,';\"";
    const encrypted = encrypt(original);
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(original);
  });

  it("handles empty string", () => {
    const original = "";
    const encrypted = encrypt(original);
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(original);
  });
});
