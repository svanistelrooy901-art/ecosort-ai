import React,{createContext,useContext,useState,useEffect} from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import type {Identification} from '../../shared/catalog';
export type Photo={uri:string;base64:string};
type State={photo:Photo|null;setPhoto:(p:Photo|null)=>void;result:Identification|null;setResult:(r:Identification|null)=>void;base:string;code:string;ready:boolean;save:(base:string,code:string)=>Promise<void>};
const Context=createContext<State|null>(null);
export function SessionProvider({children}:{children:React.ReactNode}){
 const [photo,setPhoto]=useState<Photo|null>(null),[result,setResult]=useState<Identification|null>(null);
 const [base,setBase]=useState(process.env.EXPO_PUBLIC_API_URL || ''),[code,setCode]=useState(''),[ready,setReady]=useState(false);
 useEffect(()=>{let active=true;(async()=>{try{if(Platform.OS!=='web'){const saved=await SecureStore.getItemAsync('ecosort-config');if(saved&&active){const value=JSON.parse(saved);setBase(value.base||'');setCode(value.code||'');}}}catch{}finally{if(active)setReady(true);}})();return()=>{active=false;};},[]);
 async function save(b:string,c:string){if(Platform.OS!=='web')await SecureStore.setItemAsync('ecosort-config',JSON.stringify({base:b,code:c}));setBase(b);setCode(c);}
 return <Context.Provider value={{photo,setPhoto,result,setResult,base,code,ready,save}}>{children}</Context.Provider>;
}
export function useSession(){const s=useContext(Context);if(!s)throw new Error('Session unavailable');return s;}
