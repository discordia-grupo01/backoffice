/** Número pseudoaleatorio estable en [0, 1) para una semilla de texto. Lo usan los mocks para que los datos no cambien entre renders. */
export function seeded(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return ((hash >>> 0) % 10000) / 10000;
}
