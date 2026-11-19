export const MIN_SIZE = 3;
export const MAX_SIZE = 24;
export const MIN_VALUE = 1;
export const MAX_VALUE = 99;

/** Parse a user-entered array. Returns null when the input is invalid. */
export function parseInput(raw: string): number[] | null {
  const tokens = raw
    .trim()
    .split(/[\s,，;；]+/)
    .filter(Boolean);
  if (tokens.length < MIN_SIZE || tokens.length > MAX_SIZE) return null;

  const values: number[] = [];
  for (const token of tokens) {
    if (!/^\d{1,3}$/.test(token)) return null;
    const value = Number(token);
    if (!Number.isInteger(value) || value < MIN_VALUE || value > MAX_VALUE) return null;
    values.push(value);
  }
  return values;
}

export function randomArray(size: number): number[] {
  const n = Math.max(MIN_SIZE, Math.min(MAX_SIZE, size));
  return Array.from(
    { length: n },
    () => Math.floor(Math.random() * (MAX_VALUE - MIN_VALUE + 1)) + MIN_VALUE,
  );
}

export function toInputString(values: number[]): string {
  return values.join(', ');
}

/** Searching algorithms require ascending input. */
export function effectiveInput(values: number[], category: '排序' | '查找'): number[] {
  return category === '查找' ? [...values].sort((a, b) => a - b) : values;
}
