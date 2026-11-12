import {useCallback,useEffect,useRef,useState} from 'react';
import {ActivityIndicator,Image,Linking,View} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {ImageManipulator,SaveFormat} from 'expo-image-manipulator';
import {router,useFocusEffect} from 'expo-router';
import {useSession} from '../../lib/session';
import {useLocale} from '../../lib/locale';
import {identify,apiMessage} from '../../lib/api';
import {Icon} from '../../components/ui';
import {issueCategories,labels,selectCategory} from '../../../shared/environment';
import {Action,c,Copy,DemoScreen,go,Notice,Panel,Row,Title,u} from '../ui-demo/ui';
export function Scanner(){
 const session=useSession(),{t,language}=useLocale();const [busy,setBusy]=useState(false),[analyzing,setAnalyzing]=useState(false),[error,setError]=useState('');
 const lock=useRef(false),active=useRef(true),epoch=useRef(0),request=useRef<AbortController|null>(null),timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 useFocusEffect(useCallback(()=>{active.current=true;epoch.current++;if(request.current?.signal.aborted)setAnalyzing(false);return()=>{active.current=false;epoch.current++;request.current?.abort();};},[]));
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
 async function choose(camera:boolean){if(lock.current)return;lock.current=true;const token=epoch.current;setBusy(true);setError('');try{
  if(camera){const permission=await ImagePicker.requestCameraPermissionsAsync();if(!permission.granted){if(active.current)setError(permission.canAskAgain?'permission':'settings');return;}}
  const options={mediaTypes:['images'] as ['images'],quality:.8,exif:false,allowsMultipleSelection:false};
  const result=camera?await ImagePicker.launchCameraAsync(options):await ImagePicker.launchImageLibraryAsync(options);if(result.canceled||!active.current||token!==epoch.current)return;
  const image=ImageManipulator.manipulate(result.assets[0].uri);const width=result.assets[0].width;image.resize({width:Math.min(width||1024,1024)});
  const rendered=await image.renderAsync();const photo=await rendered.saveAsync({compress:.7,format:SaveFormat.JPEG,base64:true});
  if(!photo.base64||photo.base64.length>2_666_668)throw new Error('image');
  if(active.current&&token===epoch.current)session.startResult(null,language,{uri:photo.uri,base64:photo.base64});
 }catch{if(active.current)setError('photo');}finally{lock.current=false;if(active.current)setBusy(false);}}
 async function analyze(){if(lock.current||!session.photo)return;if(!session.ready||!session.base||!session.code){setError('setup');return;}
  lock.current=true;setAnalyzing(true);setError('');const controller=new AbortController();request.current=controller;const photo=session.photo;const requestedLanguage=language;
  timer.current=setTimeout(()=>controller.abort(),35000);
  try{const result=await identify(session.base,session.code,photo.base64,controller.signal,requestedLanguage);if(active.current&&!controller.signal.aborted){setAnalyzing(false);session.startResult(result,requestedLanguage,photo);router.push('/scan-result');}}
  catch(e){if(active.current)setError(controller.signal.aborted?t('Analisis dibatalkan atau tamat masa. Cuba lagi.','Analysis cancelled or timed out. Retry.'):apiMessage(e,requestedLanguage));}
  finally{if(timer.current)clearTimeout(timer.current);lock.current=false;if(active.current){setAnalyzing(false);setBusy(false);}}
 }
 return <DemoScreen sample={false} title="AI Environmental Scanner" tab="scan">
 {session.photo?<Image source={{uri:session.photo.uri}} style={[u.photo,{height:250}]} resizeMode="contain"/>:<View style={{height:180,backgroundColor:c.mint,borderRadius:16,alignItems:'center',justifyContent:'center'}}><Icon name="camera" size={72}/></View>}
 {analyzing?<Panel><ActivityIndicator color={c.green}/><Copy>{t('AI sedang menganalisis foto…','AI is analysing your photo…')}</Copy><Action outline title={t('Batalkan','Cancel')} onPress={()=>request.current?.abort()}/></Panel>:<>
 <Action icon="camera" title={busy?t('Menyediakan foto…','Preparing photo…'):session.photo?t('Ambil semula','Retake Photo'):t('Ambil Foto','Take Photo')} disabled={busy} onPress={()=>void choose(true)}/>
 <Action outline icon="image-outline" title={t('Muat Naik Gambar','Upload Image')} disabled={busy} onPress={()=>void choose(false)}/>
 {session.photo?<><Notice>{t('Menekan Analisis menghantar foto ke backend projek dan Workers AI. Elakkan wajah, dokumen atau maklumat peribadi.','Tapping Analyse sends your photo to the project backend and Workers AI. Avoid faces, documents or personal information.')}</Notice><Action title={t('Analisis dengan AI','Analyse with AI')} icon="creation" disabled={busy} onPress={()=>void analyze()}/></>:null}
 <Action outline title={t('Pilih kategori tanpa AI','Choose category without AI')} disabled={busy} onPress={()=>{session.startResult(null,language,session.photo);go('/scan-result');}}/>
 </>}
 {error?<Notice warn>{error==='setup'?t('Sambungan AI belum tersedia. Masukkan URL backend dan kod akses dalam Tetapan AI.','AI connection is not ready. Enter the backend URL and access code in AI settings.'):error==='photo'?t('Foto gagal disediakan. Cuba foto lain.','Unable to prepare photo. Try another image.'):error==='permission'||error==='settings'?t('Kamera memerlukan kebenaran. Benarkan dalam tetapan telefon atau gunakan galeri.','Camera permission is required. Allow it in phone settings or use the gallery.'):error}</Notice>:null}
 {error==='settings'?<Action outline title={t('Buka tetapan telefon','Open phone settings')} onPress={()=>void Linking.openSettings().catch(()=>setError('permission'))}/>:null}
 <Action outline title={t('Tetapan sambungan AI','AI connection settings')} disabled={analyzing||busy} onPress={()=>go('/settings')}/>
 <Panel><Title>{t('Tip foto','Photo tips')}</Title><Copy>{t('Gunakan foto jelas dan terang. Tangkap keseluruhan situasi dari tempat yang selamat. Jangan dekati api atau asap.','Use a clear, well-lit photo. Capture the full scene from a safe place. Do not approach fire or smoke.')}</Copy></Panel>
 <Action outline title={t('Cuba aliran scanner contoh','Try sample scanner flow')} disabled={analyzing||busy} onPress={()=>go('/demo-scanner')}/>
 </DemoScreen>;
}
export function ScanResult(){const {t,language}=useLocale();const session=useSession();const {result,selection,photo}=session;const [edit,setEdit]=useState(!result||result.certainty==='uncertain');
 const choose=(category:typeof selection.category)=>session.setSelection(selectCategory(result,category));
 return <DemoScreen sample={false} title={t('Hasil & Pengesahan','Result & Confirmation')} tab="scan">
 {photo?<Image source={{uri:photo.uri}} style={u.photo} resizeMode="contain"/>:null}
 {result?<Panel style={{backgroundColor:result.certainty==='uncertain'?'#FFF3D6':c.mint}}><Title>{labels[result.category][language]}</Title><Copy>{result.summary}</Copy><Copy small>{result.certainty==='uncertain'?t('Tidak pasti · semakan diperlukan','Uncertain · review needed'):t('Kemungkinan · belum disahkan','Possible · unverified')}</Copy>{result.observations.map((text,i)=><Copy small key={i}>• {text}</Copy>)}<Copy small>{t('Bahasa jawapan AI: ','AI response language: ')}{session.resultLanguage==='ms'?'BM':'English'}</Copy></Panel>:<Notice>{t('Mod manual: tiada analisis AI dijalankan.','Manual mode: no AI analysis has been performed.')}</Notice>}
 <Notice>{t('Foto dan pengesahan pengguna tidak membuktikan kesalahan undang-undang, punca asap atau kejadian yang disahkan agensi.','A photo and user confirmation do not establish a legal violation, the source of smoke or an agency-verified incident.')}</Notice>
 {edit?<Panel><Title>{t('Pilih kategori yang betul','Choose the correct category')}</Title>{issueCategories.map(category=><Row key={category} icon={selection.category===category?'radiobox-marked':'radiobox-blank'} title={labels[category][language]} onPress={()=>choose(category)}/>)}</Panel>:<Action outline title={t('Betulkan kategori','Correct category')} onPress={()=>setEdit(true)}/>}
 {selection.confirmed?<Panel><Row icon="check-circle" title={t('Kategori disahkan pengguna','Category confirmed by user')} detail={labels[selection.category][language]}/><Copy small>{selection.source==='ai'?t('Cadangan AI diterima.','AI suggestion accepted.'):t('Kategori dipilih/dibetulkan pengguna.','Category chosen/corrected by user.')}</Copy></Panel>:<Action title={t('Sahkan kategori','Confirm category')} disabled={selection.category==='unknown'} onPress={()=>session.setSelection(selectCategory(result,selection.category,true))}/>}
 <Action title={t('Teruskan ke penyelesaian','Continue to Solutions')} disabled={!selection.confirmed} onPress={()=>go({pathname:'/solutions',params:{category:selection.category}})}/>
 <Action outline icon="content-save-outline" title={t('Simpan rekod & lokasi','Save record & location')} disabled={!selection.confirmed} onPress={()=>go('/observation-form')}/>
 <Action outline title={t('Imbas foto lain','Scan another photo')} onPress={()=>{session.startResult(null,language,null);router.replace('/scan');}}/>
 </DemoScreen>;
}
