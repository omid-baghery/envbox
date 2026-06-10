import { describe, it, expect } from "vitest";
import { generateApiKey } from "./api-keys.service";

describe("generateApiKey", () => {
  it("returns a string", () => {
    const key = generateApiKey();
    expect(typeof key).toBe("string");
  });

  it("starts with envbox_sk_", () => {
    const key = generateApiKey();
    expect(key.startsWith("envbox_sk_")).toBe(true);
  });

  it("is longer than the prefix", () => {
    const key = generateApiKey();
    expect(key.length).toBeGreaterThan("envbox_sk_".length);
  });

  it("generates different keys each time", () => {
    const a = generateApiKey();
    const b = generateApiKey();
    expect(a).not.toBe(b);
  });
});
