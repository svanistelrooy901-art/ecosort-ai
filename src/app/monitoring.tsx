import {useState} from 'react';
import {Linking, Pressable, Text, View} from 'react-native';
import {router} from 'expo-router';
import {Screen, Card, Button, s, colors} from '../components/ui';
import {RecordState} from '../components/record-state';
import {useLocale} from '../lib/locale';
import {useRecords} from '../lib/records';
import {issueCategories, labels, type IssueCategory} from '../../shared/environment';
import {mapSearchUrl} from '../../shared/records';
export default function Monitoring() {
  const {t, language} = useLocale(); const {records, ready, failed, remove} = useRecords();
  const [filter, setFilter] = useState<IssueCategory | 'all'>('all'), [deleting, setDeleting] = useState<string | null>(null), [busy, setBusy] = useState(false), [error, setError] = useState(false);
  async function openMap(location: string) {try {await Linking.openURL(mapSearchUrl(location)); setError(false);} catch {setError(true);}}
  async function deleteRecord(id: string) {setBusy(true); try {await remove(id); setDeleting(null); setError(false);} catch {setError(true);} finally {setBusy(false);}}
  return <Screen title={t('Rekod & Lokasi', 'Records & Locations')}>
    <Text style={s.eyebrow}>03 / {t('PEMANTAUAN PERIBADI', 'PERSONAL MONITORING')}</Text>
    <Text style={s.heading}>{t('Pemerhatian pada telefon ini', 'Observations on this device')}</Text>
    <Text style={s.body}>{t('Senarai lokasi manual dengan pautan Maps. Tiada GPS automatik, peta komuniti atau hotspot satelit.', 'Manual location records with Maps links. No automatic GPS, community map or satellite hotspots.')}</Text>
    <RecordState />
    {ready && !failed ? <>
      <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8}}>{(['all', ...issueCategories.filter(k => k !== 'unknown')] as const).map(category => <Pressable accessibilityRole="button" accessibilityState={{selected: category === filter}} key={category} onPress={() => setFilter(category)} style={[s.pill, {paddingVertical: 12}, category === filter && {backgroundColor: colors.green}]}><Text style={[s.pillText, category === filter && {color: 'white'}]}>{category === 'all' ? t('Semua', 'All') : labels[category][language]}</Text></Pressable>)}</View>
      {records.filter(record => filter === 'all' || record.category === filter).map(record => <Card key={record.id}>
        <Text style={s.subheading}>{labels[record.category][language]}</Text>
        <Text style={s.small}>{new Date(record.createdAt).toLocaleString(language === 'ms' ? 'ms-MY' : 'en-MY')}</Text>
        <Text style={s.small}>{record.source === 'ai' ? t('Cadangan AI diterima pengguna', 'AI suggestion accepted by user') : t('Kategori dipilih pengguna', 'User-selected category')} · {t('Belum disahkan agensi', 'Not agency verified')}</Text>
        {record.note ? <Text style={s.body}>{record.note}</Text> : null}
        <Text style={s.body}>{record.location || t('Tiada lokasi dimasukkan', 'No location entered')}</Text>
        {record.location ? <Button secondary icon="map-marker-outline" title={t('Buka dalam Maps', 'Open in Maps')} onPress={() => void openMap(record.location)} /> : null}
        <Button secondary title={t('Panduan kategori ini', 'Guidance for this category')} onPress={() => router.push({pathname: '/advisor', params: {category: record.category}})} />
        {deleting === record.id ? <><Text style={s.small}>{t('Padam rekod ini daripada telefon?', 'Delete this record from the device?')}</Text><Button title={t('Ya, padam rekod', 'Yes, delete record')} busy={busy} onPress={() => void deleteRecord(record.id)} /><Button secondary title={t('Batal', 'Cancel')} disabled={busy} onPress={() => setDeleting(null)} /></> : <Button secondary title={t('Padam rekod', 'Delete record')} onPress={() => setDeleting(record.id)} />}
      </Card>)}
      {!records.some(record => filter === 'all' || record.category === filter) ? <Card><Text style={s.body}>{t('Tiada rekod untuk pilihan ini. Imbas atau pilih kategori, sahkan dan simpan rekod.', 'No records for this selection. Scan or choose a category, confirm it and save a record.')}</Text></Card> : null}
    </> : null}
    {error ? <Text accessibilityRole="alert" style={{color: colors.red}}>{t('Tindakan gagal. Semak sambungan atau cuba lagi.', 'Action failed. Check your connection or retry.')}</Text> : null}
    <Text style={s.small}>{t('Menekan Maps menghantar teks lokasi kepada Google Maps untuk carian. Padanan carian mungkin tidak tepat.', 'Tapping Maps sends the location text to Google Maps for search. The match may be imprecise.')}</Text>
    <Button title={t('Tambah pemerhatian', 'Add observation')} icon="camera" onPress={() => router.push('/camera')} />
  </Screen>;
}
