import { parseIdentification, type Identification } from '../../shared/catalog';
export const errors:Record<string,string>={
 unauthorized:'Kod demo tidak sah. Semak kod dalam Tetapan demo.',
 service_unavailable:'Analisis AI belum diaktifkan. Cuba lagi selepas backend disediakan.',
 rate_limited:'Had demo sementara dicapai. Tunggu seminit sebelum cuba lagi.',
 invalid_image:'Foto tidak dapat dibaca. Ambil semula foto.',
 image_too_large:'Foto terlalu besar. Cuba ambil semula foto yang lebih kecil.',
 analysis_timeout:'Analisis mengambil masa terlalu lama. Cuba lagi.',
 provider_busy:'Perkhidmatan AI sibuk. Cuba semula sebentar lagi.'
};
export function endpoint(base:string):string {
 const url=new URL(base.trim());
 if(url.protocol!=='https:' || url.username || url.password || url.search || url.hash || url.pathname!=='/')throw new Error('Gunakan alamat HTTPS backend sahaja, tanpa path atau query.');
 return url.origin+'/v1/identify';
}
export async function identify(base:string,code:string,image:string,signal:AbortSignal):Promise<Identification>{
 const response=await fetch(endpoint(base),{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${code}`},body:JSON.stringify({image}),signal});
 let body;try{body=await response.json();}catch{throw new Error('Respons server tidak sah. Cuba lagi.');}
 if(!response.ok)throw new Error(errors[body.error] || 'Analisis gagal. Semak sambungan internet dan cuba lagi.');
 try{return parseIdentification(body.identification);}catch{throw new Error('Hasil AI tidak lengkap. Cuba semula dengan foto lebih jelas.');}
}
