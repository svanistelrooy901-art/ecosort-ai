// The phone's deadline includes upload, model processing, and the return trip.
export const MODEL_TIMEOUT_MS = 75_000;
export const SCAN_TIMEOUT_MS = 90_000;
export const PHOTO_MAX_EDGE = 768;

export function photoResize(width: number, height: number): {width: number} | {height: number} | null {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) throw new Error('Invalid photo dimensions');
  if (Math.max(width, height) <= PHOTO_MAX_EDGE) return null;
  return width >= height ? {width: PHOTO_MAX_EDGE} : {height: PHOTO_MAX_EDGE};
}
