import { checkRateLimit } from '../lib/rateLimit';

describe('checkRateLimit', () => {
  it('allows the first request from an IP', () => {
    const store = new Map();
    const result = checkRateLimit('1.2.3.4', 5, 60_000, Date.now(), store);
    expect(result.allowed).toBe(true);
  });

  it('allows requests up to the limit', () => {
    const store = new Map();
    const now = Date.now();
    for (let i = 0; i < 5; i++) {
      const result = checkRateLimit('1.2.3.4', 5, 60_000, now, store);
      expect(result.allowed).toBe(true);
    }
  });

  it('blocks the request that exceeds the limit', () => {
    const store = new Map();
    const now = Date.now();
    for (let i = 0; i < 5; i++) {
      checkRateLimit('1.2.3.4', 5, 60_000, now, store);
    }
    const result = checkRateLimit('1.2.3.4', 5, 60_000, now, store);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('resets the count after the window expires', () => {
    const store = new Map();
    const now = Date.now();
    for (let i = 0; i < 5; i++) {
      checkRateLimit('1.2.3.4', 5, 60_000, now, store);
    }
    // expired window
    const later = now + 60_001;
    const result = checkRateLimit('1.2.3.4', 5, 60_000, later, store);
    expect(result.allowed).toBe(true);
  });

  it('tracks IPs independently', () => {
    const store = new Map();
    const now = Date.now();
    for (let i = 0; i < 5; i++) {
      checkRateLimit('1.2.3.4', 5, 60_000, now, store);
    }
    const result = checkRateLimit('9.9.9.9', 5, 60_000, now, store);
    expect(result.allowed).toBe(true);
  });

  it('reports remaining slots correctly', () => {
    const store = new Map();
    const now = Date.now();
    checkRateLimit('1.2.3.4', 5, 60_000, now, store);
    checkRateLimit('1.2.3.4', 5, 60_000, now, store);
    const result = checkRateLimit('1.2.3.4', 5, 60_000, now, store);
    expect(result.remaining).toBe(2);
  });
});
