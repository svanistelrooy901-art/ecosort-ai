import {useState} from 'react';
import {Image, ImageBackground, Linking, Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import {router} from 'expo-router';
import {Screen, Button, Card, Icon, LanguageSwitch, s, colors} from '../components/ui';
import {DashboardHeading, DashboardNav, DashboardShortcut, DashboardStat, d} from '../components/dashboard-ui';
import {RecordState} from '../components/record-state';
import {useLocale} from '../lib/locale';
import {useRecords} from '../lib/records';
import {labels} from '../../shared/environment';
import {mapSearchUrl, recordCounts} from '../../shared/records';

export default function Home() {
  const {t, language} = useLocale(); const storage = useRecords(); const counts = recordCounts(storage.records);
  const [location, setLocation] = useState(''), [linkError, setLinkError] = useState(false);
  const hasRecords = storage.ready && !storage.failed;
  async function open(url: string) {try {await Linking.openURL(url); setLinkError(false);} catch {setLinkError(true);}}
  function maps(query: string) {try {void open(mapSearchUrl(query));} catch {setLinkError(true);}}
  const shortcuts = [
    {icon: 'lightbulb-on-outline' as const, title: t('Penasihat Tindakan', 'Solution Advisor'), route: '/advisor' as const},
    {icon: 'routes' as const, title: t('Saluran Tindakan', 'Action Channels'), route: '/routing' as const},
    {icon: 'map-marker-radius-outline' as const, title: t('Rekod & Lokasi', 'Records & Locations'), route: '/monitoring' as const},
    {icon: 'chart-bar' as const, title: t('Impak & Aktiviti', 'Impact & Activity'), route: '/impact' as const},
  ];
  return <Screen footer={<DashboardNav />} contentStyle={{padding: 16, gap: 16, paddingBottom: 28}}>
    <View style={h.header}>
      <Image accessibilityLabel="ECOXENE" source={require('../../assets/branding/ecoxene-client-logo.jpeg')} style={h.brand} resizeMode="contain" />
      <View style={{alignItems: 'flex-end', gap: 7}}><LanguageSwitch /><Text style={d.caption}>{t('Dashboard alam sekitar', 'Environmental dashboard')}</Text></View>
    </View>

    <ImageBackground source={require('../../assets/dashboard/valley-header.webp')} resizeMode="cover" style={h.hero} imageStyle={{borderRadius: 22}}>
      <View style={h.heroCopy}><Text style={h.greeting}>{t('Selamat datang!', 'Good day!')}</Text><Text style={h.heroText}>{t('Bersama menjaga alam,\nuntuk hari esok yang lebih hijau.', 'Together for a cleaner,\ngreener tomorrow.')}</Text></View>
      <Pressable accessibilityRole="button" onPress={() => router.push('/camera')} style={({pressed}) => [h.scanner, pressed && {opacity: .85}]}>
        <Icon name="camera-outline" size={34} color="white" /><View style={{flex: 1, gap: 3}}><Text style={h.scannerTitle}>AI Environmental Scanner</Text><Text style={h.scannerBody}>{t('Kenali isu melalui foto anda', 'Identify issues from your photo')}</Text></View><Icon name="chevron-right" color="white" />
      </Pressable>
    </ImageBackground>

    <Card style={h.card}>
      <DashboardHeading icon="weather-hazy" title={t('Amaran Alam Sekitar', 'Environmental Alerts')} />
      <View style={h.airPanel}><Icon name="weather-windy" size={34} /><View style={{flex: 1, gap: 5}}><Text style={s.subheading}>{t('Jerebu & kualiti udara', 'Haze & air quality')}</Text><Text style={s.small}>{t('Tiada bacaan IPU langsung dalam aplikasi. Semak keadaan semasa melalui portal rasmi JAS.', 'No live API reading is available in the app. Check current conditions on the official DOE portal.')}</Text></View></View>
      <Button secondary icon="open-in-new" title={t('Semak IPU rasmi', 'Check official air quality')} onPress={() => void open('https://eqms.doe.gov.my/apims/main')} />
      <Pressable accessibilityRole="button" onPress={() => router.push({pathname: '/education', params: {topic: 'burning'}})} style={h.inlineAction}><Icon name="fire-off" size={21} /><Text style={h.inlineCopy}>{t('Elakkan pembakaran. Lihat panduan jerebu dan alternatif mengurus sisa taman.', 'Avoid burning. Read haze guidance and alternatives for garden waste.')}</Text><Icon name="chevron-right" size={20} /></Pressable>
    </Card>

    <Card style={h.card}>
      <DashboardHeading icon="map-marker-outline" title={t('Paparan Peta & Lokasi', 'Map View & Location')} detail={t('Lokasi pilihan dan rekod peribadi', 'Selected location and personal records')} />
      <ImageBackground source={require('../../assets/dashboard/neighbourhood-illustration.webp')} resizeMode="cover" style={h.map} imageStyle={{borderRadius: 16}}><View style={h.mapCaption}><Icon name="information-outline" size={16} /><Text style={h.mapCaptionText}>{t('Ilustrasi peta · bukan lokasi sebenar', 'Map illustration · not a real location')}</Text></View></ImageBackground>
      <Text style={s.small}>{t('Pilih lokasi secara manual', 'Select a location manually')}</Text>
      <TextInput accessibilityLabel={t('Lokasi pilihan', 'Selected location')} placeholder={t('Contoh: Bertam, Pulau Pinang', 'Example: Bertam, Penang')} value={location} onChangeText={setLocation} maxLength={120} returnKeyType="search" onSubmitEditing={() => {if (location.trim()) maps(location);}} style={s.input} />
      <Button secondary icon="map-search-outline" title={t('Buka lokasi dalam Maps', 'Open location in Maps')} disabled={!location.trim()} onPress={() => maps(location)} />
      <Text style={s.small}>{t('Lokasi manual dihantar ke Google Maps apabila ditekan. Semak padanan carian sebelum digunakan.', 'Manual location text is sent to Google Maps when tapped. Check the search match before using it.')}</Text>
      {hasRecords ? <Pressable accessibilityRole="button" style={h.inlineAction} onPress={() => router.push('/monitoring')}><Icon name="map-marker-multiple-outline" size={23} /><Text style={h.inlineCopy}>{counts.withLocation} {t('rekod anda mempunyai lokasi manual', 'of your records have manual locations')}</Text><Icon name="chevron-right" size={20} /></Pressable> : null}
    </Card>

    <View style={{gap: 7}}>
      <Button title={t('Laporkan Isu', 'Report an Issue')} icon="camera-plus-outline" onPress={() => router.push('/camera')} />
      <Text style={[s.small, {textAlign: 'center'}]}>{t('Ambil foto dan simpan pemerhatian pada telefon. Aduan rasmi dibuat sendiri melalui Saluran Tindakan.', 'Take a photo and save an observation on your device. Submit official complaints yourself through Action Channels.')}</Text>
    </View>

    <Card style={h.card}>
      <DashboardHeading icon="clipboard-text-outline" title={t('Ringkasan Laporan Saya', 'My Reports Summary')} action={t('Lihat semua', 'View all')} onPress={() => router.push('/monitoring')} />
      <Text style={s.small}>{t('Rekod telefon sahaja · belum dihantar kepada agensi', 'Device records only · not submitted to an agency')}</Text>
      <RecordState />
      {hasRecords ? <>
        <View style={h.stats}><DashboardStat value={counts.total} label={t('Disimpan', 'Saved')} /><DashboardStat value={counts.withLocation} label={t('Dengan lokasi', 'With location')} /><DashboardStat value={counts.manual} label={t('Pilihan pengguna', 'User-selected')} /></View>
        {storage.records.length ? storage.records.slice(0, 2).map(record => <Pressable accessibilityRole="button" key={record.id} onPress={() => router.push('/monitoring')} style={h.record}><View style={h.recordIcon}><Icon name={record.category === 'suspected_smoke' ? 'fire-alert' : record.category === 'vegetation_damage' ? 'leaf' : 'recycle'} size={24} /></View><View style={{flex: 1, gap: 4}}><Text style={h.recordTitle}>{labels[record.category][language]}</Text><Text style={d.caption}>{record.location || t('Lokasi belum dimasukkan', 'Location not entered')}</Text><Text style={d.caption}>{new Date(record.createdAt).toLocaleDateString(language === 'ms' ? 'ms-MY' : 'en-MY')} · {t('Disimpan pada telefon', 'Saved on device')}</Text></View><Icon name="chevron-right" size={19} /></Pressable>) : <View style={h.empty}><Icon name="clipboard-text-outline" size={34} /><Text style={[s.small, {textAlign: 'center'}]}>{t('Belum ada rekod. Mulakan dengan satu pemerhatian.', 'No records yet. Start with an observation.')}</Text></View>}
      </> : null}
      <Pressable accessibilityRole="button" onPress={() => router.push('/advisor')} style={h.inlineAction}><Icon name="lightbulb-on-outline" /><Text style={h.inlineCopy}>{t('Cadangan tindakan mengikut kategori isu', 'Suggested actions by issue category')}</Text><Icon name="chevron-right" size={20} /></Pressable>
    </Card>

    <Card style={h.card}>
      <DashboardHeading icon="recycle" title={t('Hab 3R', '3R Hub')} detail="Reduce · Reuse · Recycle" />
      <View style={h.materials}>{[t('Plastik', 'Plastic'), t('Kaca', 'Glass'), t('Kertas', 'Paper')].map(material => <Pressable accessibilityRole="button" key={material} onPress={() => router.push({pathname: '/education', params: {topic: 'recycle'}})} style={h.material}><Icon name="recycle" size={22} /><Text style={h.materialText}>{material}</Text></Pressable>)}</View>
      <DashboardShortcut icon="sprout" title={t('Kompos & sungkupan: alternatif pembakaran', 'Compost & mulch: alternatives to burning')} onPress={() => router.push({pathname: '/education', params: {topic: 'compost'}})} />
      <Button secondary icon="map-search-outline" title={t('Cari pusat kitar semula', 'Find recycling centres')} onPress={() => maps(location.trim() ? `recycling centre ${location.trim()}`.slice(0, 120) : 'recycling centres Malaysia')} />
      <Text style={s.small}>{t('Carian Maps bukan pengesahan pusat atau penerimaan bahan. Semak dengan pengumpul dahulu.', 'Maps search does not verify centres or material acceptance. Check with the collector first.')}</Text>
    </Card>

    <Card style={h.card}>
      <DashboardHeading icon="account-group-outline" title={t('Kerajaan & NGO', 'Government & NGOs')} detail={t('Sumber rujukan dan saluran tindakan', 'Reference sources and action channels')} />
      <View style={h.organisations}>{['JAS', 'SAM', 'MNS'].map(name => <Pressable accessibilityRole="button" accessibilityLabel={t(`Lihat saluran ${name}`, `View ${name} channel`)} key={name} onPress={() => router.push('/routing')} style={h.organisation}><Icon name={name === 'JAS' ? 'office-building-outline' : 'leaf-circle-outline'} size={28} /><Text style={h.organisationName}>{name}</Text></Pressable>)}</View>
      <Text style={s.small}>{t('Pautan rujukan untuk aduan, kesedaran dan maklumat pemuliharaan.', 'Reference links for complaints, awareness and conservation information.')}</Text>
      <Button secondary title={t('Lihat saluran tindakan', 'View action channels')} onPress={() => router.push('/routing')} />
    </Card>

    <Card style={{...h.card, backgroundColor: '#E7F0E3'}}>
      <DashboardHeading icon="leaf-circle-outline" title={t('Impak & Aktiviti Saya', 'My Impact & Activity')} detail={t('Ringkasan peranti ini', 'This device only')} />
      <Text style={s.body}>{hasRecords ? t(`${counts.total} pemerhatian direkodkan. Teruskan belajar dan pilih tindakan yang sesuai.`, `${counts.total} observations recorded. Keep learning and choose suitable actions.`) : t('Ringkasan tersedia selepas rekod telefon dimuatkan.', 'The summary is available once device records are loaded.')}</Text>
      <Text style={s.small}>{t('Ringkasan dikira daripada rekod yang disimpan pada peranti ini sahaja.', 'The summary is calculated from records saved on this device only.')}</Text>
      <Button secondary icon="chart-bar" title={t('Lihat ringkasan aktiviti', 'View activity summary')} onPress={() => router.push('/impact')} />
    </Card>

    <Text style={h.sectionLabel}>{t('AKSES PANTAS', 'QUICK ACCESS')}</Text>
    <View style={h.grid}>{shortcuts.map(item => <View key={item.route} style={h.gridItem}><DashboardShortcut icon={item.icon} title={item.title} onPress={() => router.push(item.route)} /></View>)}</View>
    {linkError ? <Text accessibilityRole="alert" style={{color: colors.red}}>{t('Pautan gagal dibuka. Semak internet dan cuba lagi.', 'Unable to open the link. Check your connection and retry.')}</Text> : null}
    <Text style={[s.small, {textAlign: 'center'}]}>{t('AI memberi cadangan. Pengesahan pengguna bukan pengesahan kejadian oleh agensi.', 'AI gives suggestions. User confirmation is not agency verification of an incident.')}</Text>
  </Screen>;
}

const h = StyleSheet.create({
  header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12, paddingHorizontal: 4},
  brand: {width: 102, height: 92, backgroundColor: 'white', borderRadius: 12},
  hero: {minHeight: 210, padding: 14, borderRadius: 22, gap: 14, justifyContent: 'space-between'},
  heroCopy: {alignSelf: 'flex-start', maxWidth: '94%', paddingHorizontal: 12, paddingVertical: 10, backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 14, gap: 5},
  greeting: {fontSize: 24, lineHeight: 30, fontWeight: '800', color: colors.dark},
  heroText: {fontSize: 13, lineHeight: 19, color: colors.dark},
  scanner: {flexDirection: 'row', alignItems: 'center', gap: 12, padding: 15, borderRadius: 17, minHeight: 74, backgroundColor: '#0C6048', borderWidth: 2, borderColor: 'rgba(255,255,255,0.85)'},
  scannerTitle: {fontSize: 16, lineHeight: 21, fontWeight: '800', color: 'white'},
  scannerBody: {fontSize: 12, lineHeight: 18, color: '#E1F0DF'},
  card: {padding: 17, gap: 14, borderRadius: 20},
  airPanel: {flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: colors.pale, padding: 14, borderRadius: 16},
  inlineAction: {flexDirection: 'row', gap: 8, alignItems: 'center', minHeight: 46},
  inlineCopy: {flex: 1, fontSize: 13, lineHeight: 19, color: colors.green, fontWeight: '600'},
  map: {height: 150, borderRadius: 16, justifyContent: 'flex-end', padding: 8},
  mapCaption: {alignSelf: 'flex-start', flexDirection: 'row', gap: 4, alignItems: 'center', borderRadius: 9, padding: 7, maxWidth: '100%', backgroundColor: 'rgba(255,255,255,0.96)'},
  mapCaptionText: {fontSize: 10, lineHeight: 15, color: colors.dark, flexShrink: 1},
  stats: {flexDirection: 'row', flexWrap: 'wrap', gap: 7},
  empty: {alignItems: 'center', padding: 18, gap: 8, borderRadius: 16, backgroundColor: '#F5F8F3'},
  record: {flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.line},
  recordIcon: {padding: 9, borderRadius: 12, backgroundColor: colors.pale},
  recordTitle: {fontSize: 14, lineHeight: 20, color: colors.dark, fontWeight: '700'},
  materials: {flexDirection: 'row', gap: 8},
  material: {flex: 1, gap: 6, alignItems: 'center', paddingHorizontal: 4, paddingVertical: 13, backgroundColor: colors.pale, borderRadius: 14},
  materialText: {fontSize: 12, lineHeight: 18, color: colors.green, fontWeight: '700'},
  organisations: {flexDirection: 'row', gap: 10},
  organisation: {flex: 1, paddingVertical: 14, gap: 7, alignItems: 'center', borderRadius: 16, backgroundColor: '#EEF4EC'},
  organisationName: {fontSize: 14, color: colors.green, fontWeight: '800'},
  sectionLabel: {fontSize: 11, lineHeight: 17, fontWeight: '800', letterSpacing: 1.5, color: colors.muted},
  grid: {flexDirection: 'row', flexWrap: 'wrap', gap: 10},
  gridItem: {width: '48%', flexGrow: 1},
});
