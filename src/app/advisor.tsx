import {useState} from 'react';
import {Text} from 'react-native';
import {useLocalSearchParams, router} from 'expo-router';
import {Screen, Card, Button, s} from '../components/ui';
import {CategoryPicker} from '../components/category-picker';
import {useLocale} from '../lib/locale';
import {isIssueCategory, labels, type IssueCategory} from '../../shared/environment';
import {guidance} from '../../shared/guidance';
export default function Advisor() {
  const {category} = useLocalSearchParams<{category?: string}>(); const {language, t} = useLocale();
  const [selected, setSelected] = useState<IssueCategory>(isIssueCategory(category) ? category : 'unknown');
  const [choosing, setChoosing] = useState(!isIssueCategory(category)); const advice = guidance[selected];
  return <Screen title={t('Penasihat Tindakan', 'Solution Advisor')}>
    <Text style={s.eyebrow}>{t('04 / PANDUAN MENGIKUT KATEGORI', '04 / CATEGORY GUIDANCE')}</Text>
    <Text style={s.heading}>{labels[selected][language]}</Text>
    <Text style={s.body}>{t('Panduan ini datang daripada katalog yang disediakan, bukan diagnosis atau cadangan AI berdasarkan lokasi langsung.', 'This guidance comes from a prepared catalog, not a diagnosis or AI advice based on live location data.')}</Text>
    {choosing ? <CategoryPicker value={selected} onChange={value => {setSelected(value); setChoosing(false);}} /> : <Button secondary title={t('Tukar kategori panduan', 'Change guidance category')} onPress={() => setChoosing(true)} />}
    <Card><Text style={s.subheading}>{advice.title[language]}</Text>{advice.steps[language].map((step, i) => <Text style={s.body} key={step}>{i + 1}. {step}</Text>)}</Card>
    <Card style={s.warning}><Text style={s.subheading}>{t('Batasan pemerhatian', 'Observation limits')}</Text><Text style={s.body}>{advice.limit[language]}</Text></Card>
    <Card><Text style={s.subheading}>{t('Pihak yang boleh dirujuk', 'Who to consult')}</Text><Text style={s.body}>{advice.route[language]}</Text><Text style={s.small}>{t('Tiada laporan dihantar secara automatik.', 'No report is forwarded automatically.')}</Text></Card>
    <Button title={t('Lihat saluran rasmi', 'View official channels')} onPress={() => router.push({pathname: '/routing', params: {category: selected}})} />
    <Button secondary title={t('Baca panduan 3R', 'Read 3R guidance')} onPress={() => router.push('/education')} />
  </Screen>;
}
