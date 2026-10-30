import {Image, Text, View} from 'react-native';
import {router} from 'expo-router';
import {Screen, Card, Button, s} from '../components/ui';
import {CategoryPicker} from '../components/category-picker';
import {useSession} from '../lib/session';
import {useLocale} from '../lib/locale';
import {labels, selectCategory} from '../../shared/environment';
export default function Result() {
  const {t, language} = useLocale();
  const {result, resultLanguage, photo, selection, setSelection} = useSession();
  const confirmed = selection.confirmed;
  return <Screen title={t('Semak kategori', 'Review category')}>
    {photo ? <Image source={{uri: photo.uri}} style={{height: 220, width: '100%', borderRadius: 24}} resizeMode="contain" /> : null}
    <Text style={s.heading}>{result ? t('Cadangan AI', 'AI suggestion') : t('Pilih kategori sendiri', 'Choose a category manually')}</Text>
    {result ? <Card><View style={s.pill}><Text style={s.pillText}>{result.certainty === 'uncertain' ? t('Tidak pasti · perlu semakan', 'Uncertain · review needed') : t('Kemungkinan · belum disahkan', 'Possible · unverified')}</Text></View><Text style={s.subheading}>{labels[result.category][language]}</Text><Text style={s.body}>{result.summary}</Text>{result.observations.map((observation, i) => <Text style={s.small} key={i}>• {observation}</Text>)}<Text style={s.small}>{t('Bahasa jawapan AI:', 'AI response language:')} {resultLanguage === 'ms' ? 'BM' : 'English'}</Text></Card> : <Text style={s.body}>{t('Tiada analisis AI dijalankan dalam mod ini. Pilih berdasarkan pemerhatian anda.', 'No AI analysis was performed in this mode. Choose based on your own observations.')}</Text>}
    <Card style={s.warning}><Text style={s.body}>{t('Foto tidak membuktikan pembakaran haram, punca pencemaran atau kerosakan habitat. Sahkan atau betulkan kategori di bawah.', 'A photo does not prove illegal burning, pollution causes or habitat damage. Confirm or correct the category below.')}</Text></Card>
    <CategoryPicker value={selection.category} onChange={category => setSelection(selectCategory(result, category))} />
    <Button title={confirmed ? t('Kategori sudah disahkan pengguna', 'Category confirmed by user') : t('Sahkan kategori pilihan', 'Confirm selected category')} icon="check-circle-outline" disabled={selection.category === 'unknown' || confirmed} onPress={() => setSelection(selectCategory(result, selection.category, true))} />
    {confirmed ? <Card><Text style={s.subheading}>{labels[selection.category][language]}</Text><Text style={s.small}>{selection.source === 'ai' ? t('Cadangan AI diterima oleh pengguna.', 'AI suggestion accepted by the user.') : t('Kategori dipilih atau dibetulkan oleh pengguna. Ini tidak meningkatkan keyakinan AI.', 'Category selected or corrected by the user. This does not increase AI confidence.')}</Text><Text style={s.small}>{t('Pengesahan kategori bukan pengesahan kejadian oleh agensi.', 'Category confirmation is not agency verification of an incident.')}</Text></Card> : null}
    <Button title={t('Lihat panduan tindakan', 'View action guidance')} disabled={!confirmed} onPress={() => router.push({pathname: '/advisor', params: {category: selection.category}})} />
    <Button secondary icon="content-save-outline" title={t('Simpan rekod & lokasi manual', 'Save record & manual location')} disabled={!confirmed} onPress={() => router.push('/save-record')} />
    <Text style={s.small}>{t('Rekod disimpan pada telefon sahaja. Tiada aduan dihantar kepada agensi.', 'Records are saved on this device only. No complaint is sent to an agency.')}</Text>
    <Button secondary title={t('Ambil foto lain', 'Take another photo')} onPress={() => router.replace('/camera')} />
  </Screen>;
}
