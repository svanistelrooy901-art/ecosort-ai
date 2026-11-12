import {forwardRef,useEffect,useImperativeHandle,useMemo,useRef,useState} from 'react';
import {ActivityIndicator,Linking,Text,View} from 'react-native';
import WebView from 'react-native-webview';
import {parseMapMessage,type MapFilter,type MapArea,type MapMessage} from '../../../shared/demo-map';
import {useLocale} from '../../lib/locale';
import {Action,c,Copy,u} from '../ui-demo/ui';
import {mapHtml} from './html';
export type MapHandle={command:(command:{type:'filter';value:MapFilter}|{type:'area';value:MapArea}|{type:'select';id:string}|{type:'fit'|'center'})=>void};
export const InteractiveMap=forwardRef<MapHandle,{onMessage:(value:MapMessage)=>void}>(function InteractiveMap({onMessage},ref){
 const {t}=useLocale(),web=useRef<WebView>(null);const [loading,setLoading]=useState(true),[failed,setFailed]=useState(false),[tileError,setTileError]=useState(false);const source=useMemo(()=>({html:mapHtml()}),[]);
 useEffect(()=>{if(!loading)return;const timeout=setTimeout(()=>{setLoading(false);setFailed(true);},10000);return()=>clearTimeout(timeout);},[loading]);
 useImperativeHandle(ref,()=>({command(command){web.current?.injectJavaScript(`window.ecoxeneMap && window.ecoxeneMap(${JSON.stringify(command)}); true;`);}}),[]);
 return <View style={{flex:1,minHeight:250,backgroundColor:'#E9F1E9'}}>
 <WebView ref={web} source={source} style={{flex:1,backgroundColor:'#E9F1E9'}} originWhitelist={['*']} javaScriptEnabled domStorageEnabled={false} geolocationEnabled={false} cacheEnabled incognito={false} mixedContentMode="never" allowFileAccess={false} allowFileAccessFromFileURLs={false} allowUniversalAccessFromFileURLs={false} setSupportMultipleWindows={false} javaScriptCanOpenWindowsAutomatically={false} userAgent="ECOXENE-StudentPrototype/1.3.1 (+https://github.com/svanistelrooy901-art/ecosort-ai)" onShouldStartLoadWithRequest={r=>r.url==='about:blank'||r.url.startsWith('about:blank#')} onError={()=>{setLoading(false);setFailed(true);}} onRenderProcessGone={()=>{setLoading(false);setFailed(true);}} onMessage={event=>{const value=parseMapMessage(event.nativeEvent.data);if(!value)return;if(value.type==='ready'){setLoading(false);setFailed(false);}if(value.type==='tiles')setTileError(!value.available);if(value.type==='attribution'){void Linking.openURL('https://www.openstreetmap.org/copyright').catch(()=>{});return;}onMessage(value);}}/>
 {loading?<View pointerEvents="none" style={{position:'absolute',top:10,left:10,backgroundColor:'white',padding:10,borderRadius:10,flexDirection:'row',gap:9}}><ActivityIndicator color={c.green}/><Text style={u.small}>{t('Membuka peta…','Opening map…')}</Text></View>:null}
 {failed?<View style={{position:'absolute',inset:0,padding:20,gap:12,justifyContent:'center',backgroundColor:'#E9F1E9'}}><Copy>{t('Paparan peta gagal dibuka. Cuba muat semula.','Map renderer could not open. Retry loading.')}</Copy><Action title={t('Muat semula peta','Reload map')} onPress={()=>{setLoading(true);setFailed(false);web.current?.reload();}}/></View>:null}
 {tileError&&!failed?<View style={{position:'absolute',top:12,left:62,right:12,backgroundColor:'#FFF3D6',padding:8,borderRadius:9}}><Text style={u.small}>{t('Sebahagian peta tidak dimuatkan. Semak internet; gerakkan peta untuk mencuba kawasan lain.','Some tiles did not load. Check your connection; move the map to try another area.')}</Text><Action outline title={t('Cuba semula','Retry')} onPress={()=>{setTileError(false);setLoading(true);web.current?.reload();}}/></View>:null}
 </View>;
});
