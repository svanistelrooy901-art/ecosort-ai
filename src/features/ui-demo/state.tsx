import {createContext, useContext, useState, type ReactNode} from 'react';
import type {IssueCategory} from '../../../shared/environment';
export type DemoReport = {id: string; title: string; location: string; status: 'submitted'|'reviewed'|'investigating'|'resolved'; category: IssueCategory; note: string; personal?: boolean};
export const initialReports: DemoReport[] = [
  {id:'DEMO-001',title:'Haze · Sector 5',location:'Sector 5, residential area',status:'investigating',category:'suspected_smoke',note:'Sample smoke observation. This is a fictional report for interface review.'},
  {id:'DEMO-002',title:'Trash removal · Area A',location:'Area A, community park',status:'resolved',category:'improper_disposal',note:'Sample cleanup report. No authority action has taken place.'},
  {id:'DEMO-003',title:'Garden waste · Sector 2',location:'Sector 2, community garden',status:'reviewed',category:'agricultural_waste',note:'Sample garden-waste report for the demonstration.'},
];
type DemoState = {photo: string|null; setPhoto:(uri:string|null)=>void; category:IssueCategory; setCategory:(category:IssueCategory)=>void; uncertain:boolean; setUncertain:(value:boolean)=>void; reason:string; setReason:(value:string)=>void; location:string; setLocation:(value:string)=>void; reports:DemoReport[]; addReport:(report:DemoReport)=>void; reset:()=>void; joined:boolean; setJoined:(value:boolean)=>void; pickup:string; setPickup:(value:string)=>void};
const Context=createContext<DemoState|null>(null);
export function UiDemoProvider({children}:{children:ReactNode}) {
 const [photo,setPhoto]=useState<string|null>(null),[category,setCategory]=useState<IssueCategory>('suspected_smoke'),[uncertain,setUncertain]=useState(false),[reason,setReason]=useState('prediction'),[location,setLocation]=useState('Seremban 2, Negeri Sembilan'),[reports,setReports]=useState(initialReports),[joined,setJoined]=useState(false),[pickup,setPickup]=useState('');
 function reset(){setPhoto(null);setCategory('suspected_smoke');setUncertain(false);setReason('prediction');setLocation('Seremban 2, Negeri Sembilan');setReports(initialReports);setJoined(false);setPickup('');}
 return <Context.Provider value={{photo,setPhoto,category,setCategory,uncertain,setUncertain,reason,setReason,location,setLocation,reports,addReport:r=>setReports(current=>[r,...current]),reset,joined,setJoined,pickup,setPickup}}>{children}</Context.Provider>;
}
export function useUiDemo(){const context=useContext(Context);if(!context)throw new Error('UI demo provider missing');return context;}
