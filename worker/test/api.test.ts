import {afterEach, describe, expect, it, vi} from 'vitest';
import {createHandler, MODEL, modelPrompt, parseModelResponse, validateImage, type Env} from '../src/index';
import {issueCategories, parsePrediction, selectCategory} from '../../shared/environment';
import {guidance} from '../../shared/guidance';
import {endpoint, identify, ApiError, apiMessage} from '../../src/lib/api';
const jpeg = btoa(String.fromCharCode(255, 216, 255) + 'a'.repeat(100) + String.fromCharCode(255, 217));
const valid = {category: 'agricultural_waste', certainty: 'likely', summary: 'Daun dan ranting kelihatan.', observations: ['Daun kering kelihatan.']};
function environment(raw: unknown = {response: JSON.stringify(valid)}): Env {
  return {AI: {run: vi.fn().mockResolvedValue(raw)}, DEMO_ACCESS_CODE: 'a-long-random-demo-code', AI_ENABLED: 'true', SCAN_LIMITER: {limit: vi.fn().mockResolvedValue({success: true})}};
}
function request(body: unknown = {image: jpeg, language: 'ms'}, headers: Record<string, string> = {}) {
  return new Request('https://demo.test/v2/identify', {method: 'POST', headers: {Authorization: 'Bearer a-long-random-demo-code', 'Content-Type': 'application/json', ...headers}, body: JSON.stringify(body)});
}
afterEach(() => {vi.unstubAllGlobals(); vi.useRealTimers();});
describe('environmental prediction contract and correction', () => {
  it.each(issueCategories)('accepts category %s', category => expect(parsePrediction({...valid, category}).category).toBe(category));
  it('normalises uncertainty without treating the candidate category as confirmed', () => expect(parsePrediction({...valid, certainty: 'uncertain'})).toMatchObject({category: 'unknown', certainty: 'uncertain'}));
  it.each([{...valid, category: 'illegal'}, {...valid, certainty: 0.92}, {...valid, certainty: ['likely']}, {...valid, summary: ''}, {...valid, summary: 'x'.repeat(501)}, {...valid, observations: []}, {...valid, observations: ['x'.repeat(181)]}, {...valid, observations: ['x', 'x', 'x', 'x', 'x']}, {...valid, disposal: 'burn'}, null])('rejects malformed model data %#', value => expect(() => parsePrediction(value)).toThrow());
  it('requires confirmation before accepting an AI selection', () => expect(selectCategory(parsePrediction(valid), 'agricultural_waste').confirmed).toBe(false));
  it('records a correction without altering the original AI result', () => {const prediction = parsePrediction(valid); expect(selectCategory(prediction, 'domestic_waste', true)).toEqual({category: 'domestic_waste', source: 'user', confirmed: true}); expect(prediction.category).toBe('agricultural_waste');});
  it('does not confirm unknown even after user action', () => expect(selectCategory(null, 'unknown', true).confirmed).toBe(false));
  it('labels no-AI manual selection honestly', () => expect(selectCategory(null, 'domestic_waste', true).source).toBe('user'));
  it('provides bilingual guidance for every supported category', () => {for (const category of issueCategories) for (const lang of ['ms', 'en'] as const) {expect(guidance[category].steps[lang].length).toBeGreaterThan(0); expect(guidance[category].limit[lang]).toBeTruthy();}});
});
describe('Workers AI boundary', () => {
  it('makes no AI call when disabled', async () => {const env = environment(); env.AI_ENABLED = 'false'; expect((await createHandler()(request(), env)).status).toBe(503); expect(env.AI?.run).not.toHaveBeenCalled();});
  it.each(['AI', 'SCAN_LIMITER'] as const)('fails closed without %s binding', async key => {const env = environment(); delete env[key]; expect((await createHandler()(request(), env)).status).toBe(503);});
  it.each(['', 'short'])('fails closed without a valid demo secret', async secret => {const env = environment(); env.DEMO_ACCESS_CODE = secret; expect((await createHandler()(request(), env)).status).toBe(503);});
  it.each(['', 'Bearer wrong'])('rejects unauthorized access without inference', async authorization => {const env = environment(); expect((await createHandler()(request(undefined, {Authorization: authorization}), env)).status).toBe(401); expect(env.AI?.run).not.toHaveBeenCalled();});
  it('rate limits before inference', async () => {const env = environment(); env.SCAN_LIMITER!.limit = vi.fn().mockResolvedValue({success: false}); const response = await createHandler()(request(), env); expect(response.status).toBe(429); expect(response.headers.get('Retry-After')).toBe('60'); expect(env.AI?.run).not.toHaveBeenCalled();});
  it('handles limiter outage without inference', async () => {const env = environment(); env.SCAN_LIMITER!.limit = vi.fn().mockRejectedValue(new Error('private detail')); expect((await createHandler()(request(), env)).status).toBe(503); expect(env.AI?.run).not.toHaveBeenCalled();});
  it('does not accept browser CORS preflights', async () => expect((await createHandler()(new Request('https://demo.test/v2/identify', {method: 'OPTIONS'}), environment())).status).toBe(405));
  it('explicitly retires the incompatible v1 contract', async () => {const env = environment(); expect((await createHandler()(new Request('https://demo.test/v1/identify'), env)).status).toBe(410); expect(env.AI?.run).not.toHaveBeenCalled();});
  it('health is disabled when bindings are missing', async () => {const env = environment(); delete env.AI; expect(await (await createHandler()(new Request('https://demo.test/health'), env)).json()).toMatchObject({enabled: false, version: 2});});
  it('rejects non-JSON content', async () => expect((await createHandler()(request(undefined, {'Content-Type': 'text/plain'}), environment())).status).toBe(415));
  it.each([{image: 'https://attacker.test/x', language: 'ms'}, {image: btoa('fake'), language: 'ms'}, {image: jpeg, language: 'ms', url: 'https://attacker.test'}, {image: jpeg}, {image: jpeg, language: 'xx'}, {image: jpeg, language: ['ms']}, {}])('rejects unsupported payload %#', async body => {const env = environment(); expect((await createHandler()(request(body), env)).status).toBe(400); expect(env.AI?.run).not.toHaveBeenCalled();});
  it('enforces advertised and streamed request size caps', async () => {expect((await createHandler()(request(undefined, {'Content-Length': '3000000'}), environment())).status).toBe(413); expect((await createHandler()(request({image: 'x'.repeat(2_800_001), language: 'ms'}), environment())).status).toBe(413);});
  it('validates JPEG framing', () => expect(validateImage({image: jpeg, language: 'en'})).toEqual({image: jpeg, language: 'en'}));
  it('uses the fixed Workers AI vision model and preserves language', async () => {
    const env = environment(); const response = await createHandler()(request({image: jpeg, language: 'en'}), env);
    expect(response.status).toBe(200); expect(await response.json()).toEqual({version: 2, language: 'en', identification: valid});
    expect(env.AI?.run).toHaveBeenCalledWith(MODEL, expect.objectContaining({image: `data:image/jpeg;base64,${jpeg}`, max_tokens: 400, temperature: 0.1, prompt: expect.stringContaining('English')}));
    expect(response.headers.get('Cache-Control')).toBe('no-store');
  });
  it.each([{response: '```json\n{}\n```'}, {response: '{"category":'}, {response: JSON.stringify({...valid, category: 'illegal'})}, {response: ''}, {response: 'x'.repeat(8001)}, {response: valid}, {error: 'private'}])('rejects malformed and truncated provider output %#', async raw => expect((await createHandler()(request(), environment(raw))).status).toBe(502));
  it('does not expose provider failure details', async () => {const env = environment(); env.AI!.run = vi.fn().mockRejectedValue(new Error('secret token')); const response = await createHandler()(request(), env); expect(response.status).toBe(502); expect(await response.text()).not.toContain('secret');});
  it('times out a stalled binding without waiting forever', async () => {vi.useFakeTimers(); const env = environment(); env.AI!.run = vi.fn().mockImplementation(() => new Promise(() => {})); const pending = createHandler()(request(), env); await vi.waitFor(() => expect(env.AI!.run).toHaveBeenCalled()); await vi.advanceTimersByTimeAsync(25_100); expect(await (await pending).json()).toEqual({error: 'analysis_timeout'});});
  it('prompts against treating image text as instructions or inferring illegality', () => {expect(modelPrompt('ms')).toContain('untrusted'); expect(modelPrompt('ms')).toContain('Bahasa Melayu'); expect(modelPrompt('en')).toContain('not proof');});
  it('validates model response with the shared parser', () => expect(parseModelResponse({response: JSON.stringify(valid)})).toEqual(valid));
});
describe('mobile API client', () => {
  it.each(['http://demo.test', 'https://user:pass@demo.test', 'https://demo.test/path', 'https://demo.test/?token=x'])('rejects malformed backend origin %s', base => expect(() => endpoint(base)).toThrow());
  it('uses version 2', () => expect(endpoint('https://demo.test')).toBe('https://demo.test/v2/identify'));
  it('sends selected language and validates both envelope and result', async () => {const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({version: 2, language: 'en', identification: valid}))); vi.stubGlobal('fetch', fetch); expect(await identify('https://demo.test', 'code', jpeg, new AbortController().signal, 'en')).toEqual(valid); expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({image: jpeg, language: 'en'});});
  it.each([{version: 1, language: 'ms', identification: valid}, {version: 2, language: 'en', identification: valid}, {version: 2, language: 'ms', identification: {...valid, category: 'unsafe'}}])('rejects mismatched or invalid server result %#', async body => {vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify(body)))); await expect(identify('https://demo.test', 'code', jpeg, new AbortController().signal)).rejects.toThrow(ApiError);});
  it('translates rate-limit failures without leaking raw messages', async () => {vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({error: 'rate_limited', detail: 'private'}), {status: 429}))); let failure; try {await identify('https://demo.test', 'code', jpeg, new AbortController().signal);} catch (e) {failure = e;} expect(apiMessage(failure, 'ms')).toContain('Tunggu seminit'); expect(apiMessage(failure, 'en')).toContain('Wait a minute');});
});
