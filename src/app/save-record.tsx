import {useState} from 'react';
import {Text, TextInput} from 'react-native';
import {router} from 'expo-router';
import {Screen, Card, Button, s, colors} from '../components/ui';
import {RecordState} from '../components/record-state';
import {useLocale} from '../lib/locale';
import {useSession} from '../lib/session';
import {useRecords} from '../lib/records';
import {labels} from '../../shared/environment';
import {canSaveSelection} from '../../shared/records';
export default function SaveRecord() {
  const {t, language} = useLocale(); const {selection, result} = useSession(); const storage = useRecords();
  const [note, setNote] = useState(''), [location, setLocation] = useState(''), [busy, setBusy] = useState(false), [saved, setSaved] = useState(false), [error, setError] = useState('');
  async function save() {
    if (busy || saved || !canSaveSelection(selection)) return;
    setBusy(true); setError('');
    try {
      await storage.add({id: `rec_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`, createdAt: new Date().toISOString(), category: selection.category, source: selection.source, aiCategory: result?.category || null, aiCertainty: result?.certainty || null, note: note.trim(), location: location.trim()});
      setSaved(true);
    } catch (e) {setError(e instanceof Error && e.message === 'record_limit' ? 'limit' : 'storage');} finally {setBusy(false);}
  }
  return <Screen title={t('Simpan rekod', 'Save record')}>
    {!canSaveSelection(selection) ? <><Text style={s.body}>{t('Sahkan kategori dahulu sebelum menyimpan.', 'Confirm a category before saving.')}</Text><Button title={t('Semak kategori', 'Review category')} onPress={() => router.replace('/result')} /></> : <>
      <Text style={s.heading}>{labels[selection.category][language]}</Text>
      <Text style={s.body}>{t('Rekod peribadi pada telefon ini sahaja. Ini bukan penghantaran aduan atau pengesahan kejadian.', 'A personal record on this device only. This is not a complaint submission or incident verification.')}</Text>
      <Text style={s.small}>{t('Lokasi manual (pilihan)', 'Manual location (optional)')}</Text>
      <TextInput editable={!busy && !saved} accessibilityLabel={t('Lokasi manual', 'Manual location')} value={location} onChangeText={setLocation} maxLength={120} placeholder={t('Contoh: Taman Bertam, Pulau Pinang', 'Example: Taman Bertam, Penang')} style={s.input} />
      <Text style={s.small}>{t('Nota pemerhatian (pilihan)', 'Observation note (optional)')}</Text>
      <TextInput editable={!busy && !saved} accessibilityLabel={t('Nota pemerhatian', 'Observation note')} value={note} onChangeText={setNote} multiline maxLength={300} style={[s.input, {minHeight: 100, textAlignVertical: 'top'}]} />
      <Text style={s.small}>{t('Foto tidak disimpan dalam rekod. Elakkan maklumat peribadi. Rekod tidak disegerakkan dan boleh hilang jika aplikasi dibuang.', 'Photos are not saved with records. Avoid personal information. Records are not synced and may be lost when the app is removed.')}</Text>
      <RecordState />
      {error ? <Text accessibilityRole="alert" style={{color: colors.red}}>{error === 'limit' ? t('Had 100 rekod dicapai. Padam rekod lama dahulu.', 'The 100-record limit was reached. Delete an older record first.') : t('Rekod gagal disimpan. Cuba lagi.', 'Unable to save the record. Retry.')}</Text> : null}
      {saved ? <Card><Text accessibilityRole="alert" style={s.subheading}>{t('Rekod disimpan pada telefon', 'Record saved on device')}</Text><Button title={t('Lihat rekod & lokasi', 'View records & locations')} onPress={() => router.replace('/monitoring')} /></Card> : <Button title={t('Simpan pada telefon', 'Save on device')} icon="content-save-outline" busy={busy} disabled={!storage.ready || storage.failed} onPress={save} />}
    </>}
  </Screen>;
}
