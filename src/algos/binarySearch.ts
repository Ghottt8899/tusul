// src/algos/binarySearch.ts
/**
 * Monotone, ascending array дээр binary search.
 * @returns target-ийн индэкс, олдохгүй бол -1
 */
export function binarySearch(arr: number[], target: number): number {
  // d1: lo, d2: hi, d3: mid, d4: guess
  let lo = 0;                 // d1
  let hi = arr.length - 1;    // d2

  while (lo <= hi) {          // u1(lo), u2(hi)
    const mid = lo + Math.floor((hi - lo) / 2); // d3 uses u1,u2
    const guess = arr[mid];   // d4 uses u3(mid)

    if (guess === target) {   // u4(guess)
      return mid;
    } else if (guess < target) { // u4(guess)
      lo = mid + 1;           // d1’ (re-define lo) uses u3(mid)
    } else {
      hi = mid - 1;           // d2’ (re-define hi) uses u3(mid)
    }
  }
  return -1;
}