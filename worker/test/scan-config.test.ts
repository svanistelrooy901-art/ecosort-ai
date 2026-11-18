import {describe, expect, it} from 'vitest';
import {photoResize, MODEL_TIMEOUT_MS, SCAN_TIMEOUT_MS} from '../../shared/scan-config';
describe('scan request preparation', () => {
  it.each([[4000,3000], [3000,4000], [8000,1000], [1000,8000], [900,900]])('bounds both image dimensions without changing the aspect ratio: %sx%s', (width, height) => {
    const resize = photoResize(width, height)!;
    const scale = 'width' in resize ? resize.width / width : resize.height / height;
    expect(Math.max(width * scale, height * scale)).toBeCloseTo(768);
    expect(scale).toBeLessThan(1);
  });
  it.each([[320,240], [240,320], [768,768]])('does not enlarge a small image: %sx%s', (width, height) => expect(photoResize(width, height)).toBeNull());
  it.each([[0,100], [100,0], [-1,100], [NaN,100], [100,Infinity]])('rejects invalid dimensions: %sx%s', (width, height) => expect(() => photoResize(width, height)).toThrow());
  it('leaves transport time after the backend deadline', () => expect(SCAN_TIMEOUT_MS - MODEL_TIMEOUT_MS).toBeGreaterThanOrEqual(15_000));
});
