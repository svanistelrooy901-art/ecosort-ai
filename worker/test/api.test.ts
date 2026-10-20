import {describe,it,expect,vi} from 'vitest';
import {createHandler,validateImage,type Env} from '../src/index';
import {catalog,kinds,parseIdentification} from '../../shared/catalog';
import {endpoint,identify} from '../../src/lib/api';
const jpeg=btoa(String.fromCharCode(255,216,255)+ 'a'.repeat(100)+String.fromCharCode(255,217));
const valid={material:'Daun kering',kind:'dry_leaves',certainty:'likely',reason:'Kelihatan daun kering.'};
function env():Env{return {OPENAI_API_KEY:'server-secret',DEMO_ACCESS_CODE:'a-long-random-demo-code',AI_ENABLED:'true',AI_MODEL:'gpt-4.1-mini',SCAN_LIMITER:{limit:vi.fn().mockResolvedValue({success:true})}};}
function req(body:unknown={image:jpeg},headers:Record<string,string>={}){return new Request('https://demo.test/v1/identify',{method:'POST',headers:{Authorization:'Bearer a-long-random-demo-code','Content-Type':'application/json',...headers},body:JSON.stringify(body)});}
function provider(value:unknown=valid){return vi.fn().mockResolvedValue(new Response(JSON.stringify({choices:[{finish_reason:'stop',message:{content:JSON.stringify(value)}}]})));}
describe('classification contract',()=>{
 it('accepts known classes',()=>expect(parseIdentification(valid).kind).toBe('dry_leaves'));
 it('forces ambiguous classifications to safe unknown',()=>expect(parseIdentification({...valid,certainty:'uncertain'})).toMatchObject({kind:'unknown',certainty:'uncertain',material:'Bahan belum dapat disahkan'}));
 it.each([{...valid,kind:'burn'}, {...valid,certainty:.92}, {...valid,reason:''}, {...valid,material:'x'.repeat(101)}, {...valid,steps:['burn']}])('rejects malformed model output %#',v=>expect(()=>parseIdentification(v)).toThrow());
 it('has curated advice for every category',()=>{for(const k of kinds){expect(catalog[k].steps.length).toBeGreaterThan(0);expect(catalog[k].warning).toBeTruthy();}});
 it('keeps uncertainty advice away from compost/recycle decisions',()=>expect(catalog.unknown.title).toContain('foto'));
});
describe('Worker boundaries',()=>{
 it('is disabled by default',async()=>{const e=env();e.AI_ENABLED='false';const f=provider();expect((await createHandler(f)(req(),e)).status).toBe(503);expect(f).not.toHaveBeenCalled();});
 it.each(['','Bearer wrong'])('rejects unauthorized caller',async auth=>{const f=provider();expect((await createHandler(f)(req(undefined,{Authorization:auth}),env())).status).toBe(401);expect(f).not.toHaveBeenCalled();});
 it('does not accept browser CORS preflights',async()=>expect((await createHandler()(new Request('https://demo.test/v1/identify',{method:'OPTIONS'}),env())).status).toBe(405));
 it('rate limits before spending',async()=>{const e=env();e.SCAN_LIMITER.limit=vi.fn().mockResolvedValue({success:false});const f=provider();expect((await createHandler(f)(req(),e)).status).toBe(429);expect(f).not.toHaveBeenCalled();});
 it('fails closed without limiter',async()=>{const e=env();e.SCAN_LIMITER=undefined as never;expect((await createHandler()(req(),e)).status).toBe(503);});
 it('rejects non-JSON',async()=>expect((await createHandler()(req(undefined,{'Content-Type':'text/plain'}),env())).status).toBe(415));
 it.each([{image:'https://attacker.test/photo.jpg'},{image:btoa('not-an-image')},{image:jpeg,url:'https://attacker.test'},{}])('rejects unsupported payload %#',async body=>{const f=provider();expect((await createHandler(f)(req(body),env())).status).toBe(400);expect(f).not.toHaveBeenCalled();});
 it('enforces advertised size limit',async()=>expect((await createHandler()(req(undefined,{'Content-Length':'3000000'}),env())).status).toBe(413));
 it('enforces actual streamed body size without Content-Length',async()=>expect((await createHandler()(req({image:'x'.repeat(2_800_001)}),env())).status).toBe(413));
 it('validates JPEG signatures',()=>expect(validateImage({image:jpeg})).toBe(jpeg));
 it('sends key only to fixed provider URL and returns parsed result',async()=>{const f=provider();const r=await createHandler(f)(req(),env());expect(r.status).toBe(200);expect(await r.json()).toEqual({identification:valid});expect(f.mock.calls[0][0]).toBe('https://api.openai.com/v1/chat/completions');const options=f.mock.calls[0][1];expect(options.headers.Authorization).toBe('Bearer server-secret');expect(JSON.parse(options.body).response_format.json_schema.strict).toBe(true);expect(r.headers.get('Cache-Control')).toBe('no-store');});
 it('sanitizes provider errors',async()=>{const f=vi.fn().mockResolvedValue(new Response('secret detail',{status:500}));const r=await createHandler(f)(req(),env());expect(r.status).toBe(502);expect(await r.text()).not.toContain('secret');});
 it('rejects invalid AI class',async()=>expect((await createHandler(provider({...valid,kind:'anything'}))(req(),env())).status).toBe(502));
 it('rejects refusal and truncated output',async()=>{for(const choice of [{finish_reason:'length',message:{content:JSON.stringify(valid)}},{finish_reason:'stop',message:{refusal:'No',content:null}}]){const f=vi.fn().mockResolvedValue(new Response(JSON.stringify({choices:[choice]})));expect((await createHandler(f)(req(),env())).status).toBe(502);}});
 it('handles upstream timeout',async()=>{const f=vi.fn().mockRejectedValue(new DOMException('timeout','TimeoutError'));expect(await (await createHandler(f)(req(),env())).json()).toEqual({error:'analysis_timeout'});});
});
describe('mobile API client',()=>{
 it.each(['http://demo.test','https://user:pass@demo.test','https://demo.test/other','https://demo.test/?secret=x'])('rejects unsafe or malformed endpoint %s',base=>expect(()=>endpoint(base)).toThrow());
 it('constructs fixed API route',()=>expect(endpoint('https://demo.test')).toBe('https://demo.test/v1/identify'));
 it('shows a specific rate-limit error',async()=>{vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response(JSON.stringify({error:'rate_limited'}),{status:429})));await expect(identify('https://demo.test','code',jpeg,new AbortController().signal)).rejects.toThrow('Tunggu seminit');vi.unstubAllGlobals();});
 it('validates server response again on device',async()=>{vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response(JSON.stringify({identification:{...valid,kind:'unsafe'}}))));await expect(identify('https://demo.test','code',jpeg,new AbortController().signal)).rejects.toThrow('tidak lengkap');vi.unstubAllGlobals();});
});
