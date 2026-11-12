import {describe,it,expect} from 'vitest';
import {Script,runInNewContext} from 'node:vm';
import {mapPins,filterPins,mapPin,parseMapMessage,locationLabel} from '../../shared/demo-map';
import {mapHtml} from '../../src/features/map/html';
function renderer(){
 const messages:unknown[]=[],visible:any[]=[],calls:any[]=[],events:Record<string,Function>={};
 const map={setView:(...args:any[])=>{calls.push(['view',...args]);return map;},attributionControl:{setPrefix:()=>{}},on:(name:string,callback:Function)=>{events[name]=callback;return map;},getCenter:()=>({lat:5.4,lng:100.4}),getZoom:()=>10,fitBounds:(...args:any[])=>calls.push(['fit',...args]),invalidateSize:()=>{},removeLayer:()=>{}};
 const group={addTo:()=>group,clearLayers:()=>{visible.length=0;}};
 const L={map:()=>map,tileLayer:()=>({addTo(){return this;},on(){return this;}}),layerGroup:()=>group,circleMarker:(position:any,options:any)=>{const marker={position,options,events:{} as Record<string,Function>,addTo(target:any){if(target===group)visible.push(marker);return marker;},bindTooltip(){return marker;},on(name:string,callback:Function){marker.events[name]=callback;return marker;},openTooltip(){return marker;}};return marker;},DomEvent:{stopPropagation:()=>{}}};
 const scripts=[...mapHtml().matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
 const window:any={ReactNativeWebView:{postMessage:(raw:string)=>messages.push(JSON.parse(raw))}};
 runInNewContext(scripts[1],{L,window,document:{addEventListener:()=>{}},setTimeout:(fn:Function)=>fn()});
 return {window,visible,calls,messages,events};
}
describe('interactive map protocol and controller',()=>{
 it('accepts known selection IDs and rejects fabricated IDs or extra payloads',()=>{expect(parseMapMessage(JSON.stringify({type:'select',id:mapPins[0].id}))).toEqual({type:'select',id:mapPins[0].id});expect(parseMapMessage('{"type":"select","id":"other"}')).toBeNull();expect(parseMapMessage('{"type":"ready","url":"https://evil.invalid"}')).toBeNull();expect(parseMapMessage('null')).toBeNull();});
 it('rejects malformed, excessive and out-of-range location messages',()=>{for(const raw of ['{','x'.repeat(513),'{"type":"location","latitude":90,"longitude":100}','{"type":"location","latitude":5,"longitude":181}','{"type":"location","latitude":"5","longitude":100}'])expect(parseMapMessage(raw)).toBeNull();expect(parseMapMessage('{"type":"location","latitude":5.4,"longitude":100.4}')).toEqual({type:'location',latitude:5.4,longitude:100.4});});
 it('uses unique IDs, consistent coordinates and exact type filters',()=>{expect(new Set(mapPins.map(p=>p.id)).size).toBe(mapPins.length);for(const p of mapPins){expect(mapPin(p.id)).toEqual(p);expect(parseMapMessage(JSON.stringify({type:'location',latitude:p.latitude,longitude:p.longitude}))).not.toBeNull();}expect(filterPins('sensor')).toHaveLength(3);expect(filterPins('hotspot').every(p=>p.kind==='hotspot')).toBe(true);expect(locationLabel(5.4,100.4)).toBe('5.40000, 100.40000');});
 it('bundles syntactically valid renderer and controller scripts',()=>{for(const match of mapHtml().matchAll(/<script>([\s\S]*?)<\/script>/g))expect(()=>new Script(match[1])).not.toThrow();});
 it('filters rendered markers, ignores invalid commands and fits only visible points',()=>{const r=renderer();expect(r.visible).toHaveLength(9);r.window.ecoxeneMap({type:'filter',value:'sensor'});expect(r.visible).toHaveLength(3);r.window.ecoxeneMap({type:'filter',value:'invalid'});expect(r.visible).toHaveLength(3);r.window.ecoxeneMap({type:'fit'});expect(r.calls.at(-1)[1]).toHaveLength(3);});
 it('selects a visible point, moves the viewport and prevents selecting hidden types',()=>{const r=renderer();r.window.ecoxeneMap({type:'filter',value:'sensor'});r.window.ecoxeneMap({type:'select',id:'sensor-penang'});expect(r.calls.at(-1)).toEqual(['view',[5.372,100.273],13]);const count=r.calls.length;r.window.ecoxeneMap({type:'select',id:'fire-penang'});expect(r.calls).toHaveLength(count);});
 it('reports a tapped marker ID and map-click coordinate without accessing GPS',()=>{const r=renderer();r.visible[0].events.click({});expect(r.messages.at(-1)).toEqual({type:'select',id:'fire-pahang'});r.events.click({latlng:{lat:5.5,lng:100.5}});expect(r.messages.at(-1)).toEqual({type:'location',latitude:5.5,longitude:100.5});r.window.ecoxeneMap({type:'center'});expect(r.messages.at(-1)).toEqual({type:'location',latitude:5.4,longitude:100.4});});
 it('moves to a known area without an external geocoding request',()=>{const r=renderer();r.window.ecoxeneMap({type:'area',value:'penang'});expect(r.calls.at(-1)).toEqual(['view',[5.4,100.4],11]);});
});
