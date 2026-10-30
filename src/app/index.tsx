import {Pressable, Text, View} from 'react-native';
import {router} from 'expo-router';
import {Screen, Button, Card, Icon, LanguageSwitch, s, colors, type IconName} from '../components/ui';
import {useLocale} from '../lib/locale';
import {useSession} from '../lib/session';
import {useRecords} from '../lib/records';
import {recordCounts} from '../../shared/records';

export default function Home() {
  const {t} = useLocale();
  const session = useSession(); const storage = useRecords(); const counts = recordCounts(storage.records);
  const modules: {icon: IconName; title: string; description: string; route: '/camera' | '/monitoring' | '/advisor' | '/routing' | '/impact' | '/education'}[] = [
    {icon: 'camera-outline', title: t('AI Environmental Scanner', 'AI Environmental Scanner'), description: t('Imbas foto dan semak kategori isu.', 'Scan a photo and review its category.'), route: '/camera'},
    {icon: 'map-marker-radius-outline', title: t('Rekod & Lokasi', 'Records & Locations'), description: t('Rekod telefon dan lokasi manual.', 'Device records and manual locations.'), route: '/monitoring'},
    {icon: 'lightbulb-on-outline', title: t('Penasihat Tindakan', 'Solution Advisor'), description: t('Panduan mengikut kategori pilihan.', 'Guidance for your selected category.'), route: '/advisor'},
    {icon: 'routes', title: t('Saluran Tindakan', 'Action Channels'), description: t('Pautan rasmi dan pihak untuk dirujuk.', 'Official links and who to consult.'), route: '/routing'},
    {icon: 'chart-bar', title: t('Impak & Pemulihan', 'Impact & Recovery'), description: t('Ringkasan rekod pada telefon ini.', 'Summary of records on this device.'), route: '/impact'},
    {icon: 'book-open-page-variant', title: t('Pendidikan & 3R', 'Education & 3R'), description: t('Kompos, sungkupan dan pengurusan sisa.', 'Compost, mulch and waste handling.'), route: '/education'},
  ];
  return <Screen>
    <View style={[s.row, {justifyContent: 'space-between'}]}><View style={[s.row, {flexShrink: 1}]}><Icon name="leaf-circle" size={36} /><Text style={s.heading}>ECOXENE</Text></View><LanguageSwitch /></View>
    <Text style={s.eyebrow}>{t('01 / HOME DASHBOARD', '01 / HOME DASHBOARD')}</Text>
    <Text style={s.hero}>{t('Kenali isu.\nPilih tindakan.', 'Identify issues.\nChoose action.')}</Text>
    <Text style={s.body}>{t('Imbas isu alam sekitar, semak cadangan dan pelajari tindakan yang lebih bertanggungjawab.', 'Scan environmental issues, review suggestions and learn responsible next steps.')}</Text>
    <Button title={t('Mula imbas', 'Start scanning')} icon="camera" onPress={() => router.push('/camera')} />
    <Card style={{backgroundColor: colors.pale}}><Text style={s.subheading}>{t('Prototaip akademik', 'Academic prototype')}</Text><Text style={s.small}>{t('AI memerlukan internet dan backend aktif. Tanpa AI, anda masih boleh memilih kategori, membaca panduan dan menyimpan rekod sendiri.', 'AI requires internet and an enabled backend. Without AI, you can still choose a category, read guidance and save your own record.')}</Text></Card>
    {storage.ready && !storage.failed ? <Card><Text style={s.subheading}>{counts.total} {t('rekod telefon', 'device records')}</Text><Text style={s.body}>{counts.withLocation} {t('dengan lokasi manual', 'with manual locations')}</Text><Text style={s.small}>{t('Bukan statistik komuniti atau pengesahan kejadian.', 'Not community statistics or verified incidents.')}</Text></Card> : <Text style={s.small}>{storage.failed ? t('Rekod tidak dapat dibaca. Semak Tetapan.', 'Unable to read records. Check Settings.') : t('Memuatkan rekod…', 'Loading records…')}</Text>}
    <Text style={s.subheading}>{t('Modul aplikasi', 'App modules')}</Text>
    {modules.map(module => <Pressable accessibilityRole="button" key={module.route} onPress={() => router.push(module.route)}><Card><View style={s.row}><Icon name={module.icon} size={32} /><View style={{flex: 1, gap: 5}}><Text style={s.subheading}>{module.title}</Text><Text style={s.small}>{module.description}</Text></View><Icon name="chevron-right" /></View></Card></Pressable>)}
    <Card><Text style={s.subheading}>{t('Kualiti udara & laporan sekitar', 'Air quality & nearby reports')}</Text><Text style={s.body}>{t('Sumber data belum disambungkan. Tiada bacaan IPU, amaran atau kejadian langsung dipaparkan.', 'Data sources are not connected. No live air-quality readings, alerts or incidents are displayed.')}</Text></Card>
    <Button secondary icon="tune-variant" title={t('Tetapan sambungan AI', 'AI connection settings')} disabled={!session.ready} onPress={() => router.push('/settings')} />
    <Text style={s.small}>{t('AI memberi cadangan, bukan pengesahan kejadian atau keputusan penguatkuasaan.', 'AI gives suggestions, not incident verification or enforcement decisions.')}</Text>
  </Screen>;
}
