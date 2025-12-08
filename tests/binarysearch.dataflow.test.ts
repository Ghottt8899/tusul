// tests/binarysearch.dataflow.test.ts
import { binarySearch } from "../src/algos/binarySearch";

describe("Lab10 — Dataflow (DU pairs) for binarySearch", () => {
  // T1: Happy path — exact hit center (covers d1→u1, d2→u2, d3→u3, d4→u4)
  it("hit center", () => {
    const arr = [1, 3, 5, 7, 9];
    expect(binarySearch(arr, 5)).toBe(2);
  });

  // T2: Left branch — guess > target → hi redefined (d2' covers new def → next while u2)
  it("go left (redefine hi)", () => {
    const arr = [2, 4, 6, 8, 10];
    expect(binarySearch(arr, 4)).toBe(1);
  });

  // T3: Right branch — guess < target → lo redefined (d1' covers new def → next while u1)
  it("go right (redefine lo)", () => {
    const arr = [2, 4, 6, 8, 10];
    expect(binarySearch(arr, 8)).toBe(3);
  });

  // T4: Not found — exhaust loop (exposes u1/u2 in condition multiple times)
  it("not found returns -1", () => {
    const arr = [2, 4, 6, 8, 10];
    expect(binarySearch(arr, 7)).toBe(-1);
  });

  // Edge: empty array (while condition false; still exercises initial defs d1,d2)
  it("empty array → -1", () => {
    expect(binarySearch([], 1)).toBe(-1);
  });

  // Edge: single element — both branches possible
  it("single element found", () => {
    expect(binarySearch([42], 42)).toBe(0);
  });
  it("single element not found", () => {
    expect(binarySearch([42], 7)).toBe(-1);
  });

  // Edge: duplicates — any valid index OK (binary search returns *an* index)
  it("duplicates — returns any matching index", () => {
    const arr = [1, 3, 3, 3, 5];
    const idx = binarySearch(arr, 3);
    expect([1,2,3]).toContain(idx);
  });
});