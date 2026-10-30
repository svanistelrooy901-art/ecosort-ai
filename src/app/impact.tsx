import {Text, View} from 'react-native';
import {Screen, Card, s, colors} from '../components/ui';
import {RecordState} from '../components/record-state';
import {useLocale} from '../lib/locale';
import {useRecords} from '../lib/records';
import {recordCounts} from '../../shared/records';
import {issueCategories, labels} from '../../shared/environment';
export default function Impact() {
  const {t, language} = useLocale(); const {records, ready, failed} = useRecords(); const counts = recordCounts(records);
  return <Screen title={t('Ringkasan Aktiviti', 'Activity Summary')}>
    <Text style={s.eyebrow}>06 / {t('IMPAK & PEMULIHAN · VERSI RINGKAS', 'IMPACT & RECOVERY · SIMPLIFIED')}</Text>
    <Text style={s.heading}>{t('Rekod anda, bukan skor pemulihan', 'Your records, not a recovery score')}</Text>
    <RecordState />
    {ready && !failed ? <>
      <Card><Text style={s.hero}>{counts.total}</Text><Text style={s.body}>{t('Rekod disimpan pada telefon ini', 'Records saved on this device')}</Text></Card>
      <Card><Text style={s.body}>{t('Dengan lokasi manual', 'With manual locations')}: {counts.withLocation}</Text><Text style={s.body}>{t('Cadangan AI diterima pengguna', 'AI suggestions accepted by user')}: {counts.aiAccepted}</Text><Text style={s.body}>{t('Dipilih / dibetulkan pengguna', 'Selected / corrected by user')}: {counts.manual}</Text></Card>
      <Card><Text style={s.subheading}>{t('Mengikut kategori', 'By category')}</Text>{issueCategories.filter(k => k !== 'unknown').map(category => {const count = counts.categories[category] || 0; return <View key={category} style={{gap: 7}}><Text style={s.small}>{labels[category][language]} · {count}</Text><View style={{height: 8, borderRadius: 4, backgroundColor: colors.pale}}><View style={{height: 8, borderRadius: 4, backgroundColor: colors.green, width: `${counts.total ? count / counts.total * 100 : 0}%`}} /></View></View>;})}</Card>
    </> : null}
    <Card style={s.warning}><Text style={s.body}>{t('Angka ini hanya mengira rekod yang disimpan. Ia bukan jumlah scan keseluruhan, kejadian yang disahkan, karbon dijimatkan atau habitat dipulihkan.', 'These figures count saved records only. They are not total scans, verified incidents, carbon savings or restored habitats.')}</Text></Card>
    <Text style={s.small}>{t('Memadam rekod akan mengubah ringkasan ini. Tiada data komuniti atau penyelarasan antara telefon.', 'Deleting records changes this summary. No community data or cross-device synchronisation.')}</Text>
  </Screen>;
}
