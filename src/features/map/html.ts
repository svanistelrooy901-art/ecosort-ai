import {leafletScript,leafletStyles} from './leaflet-vendor';
import {mapPins,mapAreas} from '../../../shared/demo-map';
/** Renderer is bundled; only viewport tiles are fetched. No geocoder, location permission or CDN JS. */
export function mapHtml(){
 const script=leafletScript.replace(/<\/script/gi,'<\\/script');
 return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=4,user-scalable=yes"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src https://tile.openstreetmap.org data:; connect-src 'none'; base-uri 'none'; form-action 'none'; object-src 'none'"><style>${leafletStyles}html,body,#map{height:100%;width:100%;margin:0;padding:0}#map{background:#e9f1e9}.leaflet-control-attribution{font:10px/16px sans-serif!important;padding:2px 6px!important}.leaflet-control-zoom a{width:40px!important;height:40px!important;line-height:40px!important}.leaflet-tooltip{font:12px sans-serif;border-radius:6px;padding:7px;color:#075444}</style></head><body><div id="map" aria-label="Interactive OpenStreetMap with fictional environmental markers"></div><script>${script}</script><script>
(function(){
 var pins=${JSON.stringify(mapPins)},areas=${JSON.stringify(mapAreas)},filter='all',markers={},selected=null;
 var post=function(v){if(window.ReactNativeWebView)window.ReactNativeWebView.postMessage(JSON.stringify(v));};
 var map=L.map('map',{zoomControl:true,preferCanvas:true,minZoom:4,maxZoom:18,worldCopyJump:false,maxBounds:[[-85,-180],[85,180]],maxBoundsViscosity:1}).setView([areas.pahang.latitude,areas.pahang.longitude],areas.pahang.zoom);
 map.attributionControl.setPrefix(false);
 var tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',keepBuffer:1,updateWhenIdle:true,updateWhenZooming:false}).addTo(map);
 tiles.on('tileerror',function(){post({type:'tiles',available:false});});
 tiles.on('tileload',function(){post({type:'tiles',available:true});});
 var layer=L.layerGroup().addTo(map),chosen=null;
 function draw(){layer.clearLayers();markers={};pins.filter(function(p){return filter==='all'||p.kind===filter;}).forEach(function(p){var color=p.kind==='hotspot'?'#D44C40':p.kind==='sensor'?'#297FAA':'#8A62B5';var marker=L.circleMarker([p.latitude,p.longitude],{radius:p.id===selected?14:10,weight:3,color:'#fff',fillColor:color,fillOpacity:.95}).addTo(layer);marker.bindTooltip(p.name,{direction:'top'});marker.on('click',function(e){L.DomEvent.stopPropagation(e);if(chosen){map.removeLayer(chosen);chosen=null;}selected=p.id;draw();markers[p.id].openTooltip();post({type:'select',id:p.id});});markers[p.id]=marker;});}
 function locate(lat,lng){selected=null;draw();if(chosen)map.removeLayer(chosen);chosen=L.circleMarker([lat,lng],{radius:7,color:'#075444',weight:3,fillColor:'#fff',fillOpacity:1}).addTo(map);post({type:'location',latitude:lat,longitude:lng});}
 map.on('click',function(e){locate(e.latlng.lat,e.latlng.lng);});
 window.ecoxeneMap=function(command){
  if(!command||typeof command!=='object')return;
  if(command.type==='filter'&&['all','hotspot','sensor','air'].indexOf(command.value)!==-1){filter=command.value;selected=null;draw();}
  if(command.type==='area'&&areas[command.value]){selected=null;draw();if(chosen){map.removeLayer(chosen);chosen=null;}var a=areas[command.value];map.setView([a.latitude,a.longitude],a.zoom);}
  if(command.type==='fit'){var visible=pins.filter(function(p){return filter==='all'||p.kind===filter;});if(visible.length)map.fitBounds(visible.map(function(p){return [p.latitude,p.longitude];}),{padding:[28,28],maxZoom:13});}
  if(command.type==='select'){var p=pins.find(function(p){return p.id===command.id;});if(p&&(filter==='all'||filter===p.kind)){selected=p.id;draw();map.setView([p.latitude,p.longitude],Math.max(map.getZoom(),13));markers[p.id].openTooltip();}}
  if(command.type==='center'){var center=map.getCenter();locate(center.lat,center.lng);}
 };
 document.addEventListener('click',function(event){var a=event.target.closest&&event.target.closest('a');if(a){event.preventDefault();post({type:'attribution'});}});
 draw();post({type:'ready'});setTimeout(function(){map.invalidateSize();},100);
})();</script></body></html>`;
}
