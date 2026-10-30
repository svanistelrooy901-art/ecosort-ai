import {useCallback, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, AppState, Image, Linking, Text, View} from 'react-native';
import {CameraView, useCameraPermissions} from 'expo-camera';
import {ImageManipulator, SaveFormat} from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import {router, useFocusEffect} from 'expo-router';
import {Screen, Button, Card, Icon, s, colors} from '../components/ui';
import {useSession, type Photo} from '../lib/session';
import {useLocale} from '../lib/locale';
import {identify, apiMessage} from '../lib/api';

export default function Camera() {
  const session = useSession(); const {t, language} = useLocale();
  const [permission, requestPermission, getPermission] = useCameraPermissions();
  const [ready, setReady] = useState(false), [focused, setFocused] = useState(false), [foreground, setForeground] = useState(AppState.currentState === 'active');
  const [photo, setPhoto] = useState<Photo | null>(null), [busy, setBusy] = useState(false), [analyzing, setAnalyzing] = useState(false), [permissionBusy, setPermissionBusy] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const camera = useRef<CameraView>(null), lock = useRef(false), abort = useRef<AbortController | null>(null), mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    const sub = AppState.addEventListener('change', state => {
      setForeground(state === 'active');
      if (state !== 'active') setReady(false);
      else void getPermission().catch(() => {if (mounted.current) setError('permission');});
    });
    return () => {mounted.current = false; abort.current?.abort(); sub.remove();};
  }, [getPermission]);
  useFocusEffect(useCallback(() => {setFocused(true); return () => {setFocused(false); setReady(false); abort.current?.abort();};}, []));
  async function allowCamera() {
    if (permissionBusy || !permission) return;
    setPermissionBusy(true); setError(null);
    try {
      if (!permission.canAskAgain) {await Linking.openSettings(); return;}
      const response = await requestPermission();
      if (mounted.current && !response.granted) setError('permission');
    } catch {if (mounted.current) setError('permission');} finally {if (mounted.current) setPermissionBusy(false);}
  }
  async function prepare(uri: string) {
    const context = ImageManipulator.manipulate(uri); context.resize({width: 1024});
    const rendered = await context.renderAsync();
    const output = await rendered.saveAsync({compress: .7, format: SaveFormat.JPEG, base64: true});
    if (!output.base64 || output.base64.length > 2_666_668) throw new Error('Photo preparation failed');
    if (mounted.current) setPhoto({uri: output.uri, base64: output.base64});
  }
  async function capture() {
    if (lock.current || !ready) return; lock.current = true; setBusy(true); setError(null);
    try {const pic = await camera.current?.takePictureAsync({quality: .8}); if (!pic) throw new Error('Not ready'); await prepare(pic.uri);}
    catch {if (mounted.current) setError('photo');} finally {lock.current = false; if (mounted.current) setBusy(false);}
  }
  async function gallery() {
    if (lock.current) return; lock.current = true; setBusy(true); setError(null);
    try {const result = await ImagePicker.launchImageLibraryAsync({mediaTypes: ['images'], quality: .8, allowsMultipleSelection: false, exif: false}); if (!result.canceled) await prepare(result.assets[0].uri);}
    catch {if (mounted.current) setError('photo');} finally {lock.current = false; if (mounted.current) setBusy(false);}
  }
  async function analyze() {
    if (!photo || lock.current) return;
    if (!session.base || !session.code) {setError('setup'); return;}
    lock.current = true; setAnalyzing(true); setError(null);
    const requestedLanguage = language, controller = new AbortController(); abort.current = controller;
    const timer = setTimeout(() => controller.abort(), 35_000);
    try {
      const result = await identify(session.base, session.code, photo.base64, controller.signal, requestedLanguage);
      if (!mounted.current || controller.signal.aborted) return;
      session.startResult(result, requestedLanguage, photo); router.replace('/result');
    } catch (e) {if (mounted.current) setError(controller.signal.aborted ? 'cancelled' : e);}
    finally {clearTimeout(timer); lock.current = false; if (mounted.current) setAnalyzing(false);}
  }
  const errorText = error === 'permission' ? t('Benarkan Camera dalam Settings > Apps > ECOXENE > Permissions, atau gunakan galeri.', 'Allow Camera in Settings > Apps > ECOXENE > Permissions, or use the gallery.')
    : error === 'photo' ? t('Foto gagal disediakan. Cuba lagi atau pilih gambar lain.', 'Unable to prepare the photo. Retry or choose another image.')
    : error === 'setup' ? t('Sediakan backend dan kod akses dalam Tetapan AI dahulu.', 'Configure the backend and access code in AI settings first.')
    : error === 'cancelled' ? t('Analisis dibatalkan atau tamat masa. Anda boleh cuba lagi.', 'Analysis cancelled or timed out. You can retry.') : apiMessage(error, language);
  return <Screen title={t('Imbas isu', 'Scan an issue')}>
    <Text style={s.eyebrow}>02 / AI ENVIRONMENTAL SCANNER</Text>
    <Text style={s.heading}>{photo ? t('Semak foto anda', 'Review your photo') : t('Ambil foto dari tempat selamat', 'Photograph from a safe place')}</Text>
    <View style={{height: 340, borderRadius: 26, overflow: 'hidden', backgroundColor: '#16251C', justifyContent: 'center'}}>
      {photo ? <Image source={{uri: photo.uri}} style={{width: '100%', height: '100%'}} resizeMode="contain" />
        : permission?.granted && focused && foreground ? <CameraView ref={camera} style={{flex: 1}} facing="back" onCameraReady={() => setReady(true)} onMountError={() => {setReady(false); setError('permission');}}><View pointerEvents="none" style={{flex: 1, margin: 38, borderRadius: 28, borderWidth: 2, borderColor: 'white'}} /></CameraView>
          : <View style={{padding: 24, gap: 18, alignItems: 'center'}}><Icon name="camera-outline" size={56} color="white" /><Text style={[s.body, {color: 'white', textAlign: 'center'}]}>{!permission ? t('Menyemak kebenaran…', 'Checking permissions…') : t('Benarkan kamera atau pilih foto daripada galeri.', 'Allow the camera or choose a photo from the gallery.')}</Text>{permission ? <Button title={permission.canAskAgain ? t('Benarkan kamera', 'Allow camera') : t('Buka tetapan telefon', 'Open phone settings')} busy={permissionBusy} onPress={allowCamera} /> : <ActivityIndicator color="white" />}</View>}
    </View>
    {error ? <Card style={s.warning}><Text accessibilityRole="alert" style={[s.body, {color: colors.red}]}>{errorText}</Text>{error === 'setup' ? <Button secondary title={t('Buka Tetapan AI', 'Open AI settings')} onPress={() => router.push('/settings')} /> : null}</Card> : null}
    {photo ? <>
      <Text style={s.small}>{t('Analisis menghantar foto ke backend dan Workers AI. Elakkan wajah, dokumen dan maklumat peribadi.', 'Analysis sends this photo to the backend and Workers AI. Avoid faces, documents and personal details.')}</Text>
      <Button title={t('Analisis dengan AI', 'Analyse with AI')} icon="creation" busy={analyzing} disabled={busy} onPress={analyze} />
      {analyzing ? <Button title={t('Batalkan analisis', 'Cancel analysis')} secondary onPress={() => abort.current?.abort()} /> : <Button title={t('Ambil semula', 'Retake photo')} secondary icon="camera-retake" onPress={() => {setPhoto(null); setReady(false); setError(null);}} />}
    </> : <>
      <Button title={t('Ambil foto', 'Take photo')} icon="camera" busy={busy} disabled={!ready} onPress={capture} />
      <Button title={t('Pilih dari galeri', 'Choose from gallery')} secondary icon="image-outline" disabled={busy} onPress={gallery} />
    </>}
    <Button secondary title={t('Pilih kategori tanpa AI', 'Choose a category without AI')} disabled={busy || analyzing} onPress={() => {session.startResult(null, language, photo); router.push('/result');}} />
    <Text style={s.small}>{t('Jangan mendekati api, asap tebal atau bahan berbahaya untuk mengambil gambar. Mod manual tidak menjalankan AI.', 'Do not approach flames, dense smoke or hazardous material to take a photo. Manual mode does not run AI.')}</Text>
  </Screen>;
}
