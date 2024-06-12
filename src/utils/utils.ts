export function getRandomValue(min: number, max: number): number {
  const maxValue = Math.ceil(max);
  const minValue = Math.floor(min);
  const value = Math.floor(Math.random() * (maxValue - minValue) + minValue);
  return value;
}
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
