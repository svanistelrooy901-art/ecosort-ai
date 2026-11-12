export type MapKind='hotspot'|'sensor'|'air';
export type MapFilter='all'|MapKind;
export type MapArea='pahang'|'penang'|'seremban';
export type MapPin={id:string;name:string;area:MapArea;kind:MapKind;latitude:number;longitude:number;summary:{ms:string;en:string};value:string};
export const mapAreas:Record<MapArea,{name:string;latitude:number;longitude:number;zoom:number}>={pahang:{name:'Pahang',latitude:4.10,longitude:102.38,zoom:9},penang:{name:'Penang',latitude:5.40,longitude:100.40,zoom:11},seremban:{name:'Seremban',latitude:2.70,longitude:101.94,zoom:12}};
export const mapPins:MapPin[]=[
 {id:'fire-pahang',name:'Kuala Tahan',area:'pahang',kind:'hotspot',latitude:4.384,longitude:102.401,summary:{ms:'Petunjuk haba contoh · perlu pengesahan',en:'Sample heat indicator · verification needed'},value:'Unverified'},
 {id:'sensor-pahang',name:'Forest Sensor 01',area:'pahang',kind:'sensor',latitude:3.825,longitude:102.310,summary:{ms:'Sensor hutan simulasi',en:'Simulated forest sensor'},value:'32.4 °C'},
 {id:'air-pahang',name:'Air Station · Pahang',area:'pahang',kind:'air',latitude:3.790,longitude:102.430,summary:{ms:'Bacaan kualiti udara contoh',en:'Sample air-quality reading'},value:'API 154'},
 {id:'fire-penang',name:'Garden smoke · Bertam',area:'penang',kind:'hotspot',latitude:5.509,longitude:100.435,summary:{ms:'Laporan asap rekaan untuk demo',en:'Fictional smoke report for demo'},value:'Unverified'},
 {id:'sensor-penang',name:'Community Sensor 02',area:'penang',kind:'sensor',latitude:5.372,longitude:100.273,summary:{ms:'Sensor komuniti simulasi',en:'Simulated community sensor'},value:'29.8 °C'},
 {id:'air-penang',name:'Air Station · George Town',area:'penang',kind:'air',latitude:5.416,longitude:100.332,summary:{ms:'Bacaan udara simulasi',en:'Simulated air-quality reading'},value:'API 82'},
 {id:'fire-seremban',name:'Waste smoke · Sector 5',area:'seremban',kind:'hotspot',latitude:2.688,longitude:101.912,summary:{ms:'Laporan pembakaran disyaki contoh',en:'Sample suspected-burning report'},value:'Unverified'},
 {id:'sensor-seremban',name:'Park Sensor 03',area:'seremban',kind:'sensor',latitude:2.706,longitude:101.959,summary:{ms:'Sensor taman simulasi',en:'Simulated park sensor'},value:'31.2 °C'},
 {id:'air-seremban',name:'Air Station · Seremban 2',area:'seremban',kind:'air',latitude:2.698,longitude:101.931,summary:{ms:'Bacaan udara simulasi',en:'Simulated air-quality reading'},value:'API 110'},
];
export function filterPins(filter:MapFilter){return mapPins.filter(p=>filter==='all'||p.kind===filter);}
export function mapPin(id:unknown){return mapPins.find(p=>p.id===id);}
export function isCoordinate(latitude:unknown,longitude:unknown):latitude is number{return typeof latitude==='number'&&typeof longitude==='number'&&Number.isFinite(latitude)&&Number.isFinite(longitude)&&Math.abs(latitude)<=85&&Math.abs(longitude)<=180;}
export type MapMessage={type:'ready'}|{type:'select';id:string}|{type:'location';latitude:number;longitude:number}|{type:'tiles';available:boolean}|{type:'attribution'};
export function parseMapMessage(raw:string):MapMessage|null{
 if(raw.length>512)return null;
 try{const v=JSON.parse(raw);if(!v||typeof v!=='object'||Array.isArray(v))return null;
 const keys=Object.keys(v).sort().join(',');
 if((v.type==='ready'||v.type==='attribution')&&keys==='type')return v;
 if(v.type==='select'&&keys==='id,type'&&mapPin(v.id))return v;
 if(v.type==='location'&&keys==='latitude,longitude,type'&&isCoordinate(v.latitude,v.longitude))return v;
 if(v.type==='tiles'&&keys==='available,type'&&typeof v.available==='boolean')return v;
 }catch{}return null;
}
export function locationLabel(latitude:number,longitude:number){if(!isCoordinate(latitude,longitude))throw new Error('invalid_coordinates');return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;}
