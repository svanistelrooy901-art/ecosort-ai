import {useState} from 'react';
import {Linking, Text} from 'react-native';
import {useLocalSearchParams} from 'expo-router';
import {Screen, Card, Button, s, colors} from '../components/ui';
import {CategoryPicker} from '../components/category-picker';
import {useLocale} from '../lib/locale';
import {guidance} from '../../shared/guidance';
import {isIssueCategory, labels, type IssueCategory} from '../../shared/environment';
export default function Routing() {
  const {category} = useLocalSearchParams<{category?: string}>(); const {t, language} = useLocale();
  const [selected, setSelected] = useState<IssueCategory>(isIssueCategory(category) ? category : 'unknown'), [choosing, setChoosing] = useState(!isIssueCategory(category)), [error, setError] = useState(false);
  async function open(url: string) {try {await Linking.openURL(url); setError(false);} catch {setError(true);}}
  return <Screen title={t('Saluran Tindakan', 'Action Channels')}>
    <Text style={s.eyebrow}>05 / {t('RUJUKAN SALURAN RASMI', 'OFFICIAL CHANNEL REFERENCES')}</Text>
    <Text style={s.heading}>{labels[selected][language]}</Text>
    {choosing ? <CategoryPicker value={selected} onChange={value => {setSelected(value); setChoosing(false);}} /> : <Button secondary title={t('Tukar kategori', 'Change category')} onPress={() => setChoosing(true)} />}
    <Card><Text style={s.subheading}>{t('Cadangan pihak untuk dirujuk', 'Suggested party to consult')}</Text><Text style={s.body}>{guidance[selected].route[language]}</Text><Text style={s.small}>{t('Semak bidang kuasa dan kesesuaian saluran sebelum menghantar aduan. Untuk sisa biasa atau pembinaan, hubungi PBT kawasan kejadian.', 'Check jurisdiction and channel suitability before submitting. For ordinary or construction waste, contact the local council for the affected area.')}</Text></Card>
    <Card><Text style={s.subheading}>{t('Jabatan Alam Sekitar (JAS)', 'Department of Environment (DOE)')}</Text><Text style={s.body}>{t('Saluran aduan pencemaran rasmi. Pengguna melengkapkan penghantaran sendiri dalam portal.', 'Official pollution complaint channel. You complete the submission yourself on the portal.')}</Text><Button title={t('Buka portal eAduan JAS', 'Open DOE eAduan portal')} onPress={() => void open('https://eaduan.doe.gov.my/')} /></Card>
    <Card><Text style={s.subheading}>Sahabat Alam Malaysia (SAM)</Text><Text style={s.body}>{t('Maklumat advokasi dan kesedaran alam sekitar; bukan saluran kecemasan atau penguatkuasaan.', 'Environmental advocacy and awareness information; not an emergency or enforcement service.')}</Text><Button secondary title={t('Laman rasmi SAM', 'Official SAM website')} onPress={() => void open('https://foe-malaysia.org/')} /></Card>
    <Card><Text style={s.subheading}>Malaysian Nature Society (MNS)</Text><Text style={s.body}>{t('Maklumat pemuliharaan dan aktiviti alam semula jadi; bukan pengesahan bahawa laporan diterima.', 'Conservation information and nature activities; not confirmation that a report has been received.')}</Text><Button secondary title={t('Laman rasmi MNS', 'Official MNS website')} onPress={() => void open('https://mns.my/')} /></Card>
    {error ? <Text accessibilityRole="alert" style={{color: colors.red}}>{t('Pautan gagal dibuka. Semak internet dan cuba lagi.', 'Unable to open the link. Check your connection and retry.')}</Text> : null}
    <Card style={s.warning}><Text style={s.body}>{t('Tiada penghantaran automatik, perkongsian rekod atau kerjasama rasmi didakwa. Membuka pautan bukan bukti aduan telah dihantar. Gunakan saluran kecemasan bagi bahaya segera.', 'No automatic submission, record sharing or official partnership is claimed. Opening a link does not prove a complaint was submitted. Use emergency services for immediate danger.')}</Text></Card>
  </Screen>;
}
