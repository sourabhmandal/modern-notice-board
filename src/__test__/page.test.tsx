import sum from "@/server/utils/hash";
import { describe, expect, it } from "vitest";

describe("#sum", () => {
  it("Returns zero with no numbers", () => {
    expect(sum()).toBe(0);
  });

  it("Returns same number with one number", () => {
    expect(sum(5)).toBe(5);
  });

  it("Returns sum with multiple number", () => {
    expect(sum(5, 3, 2)).toBe(10);
  });
});
