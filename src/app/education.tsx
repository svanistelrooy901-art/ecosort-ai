import {useState} from 'react';
import {Linking, Pressable, Text, View} from 'react-native';
import {useLocalSearchParams} from 'expo-router';
import {Screen, Card, Icon, s, colors, Button, type IconName} from '../components/ui';
import {useLocale} from '../lib/locale';
import {lessons} from '../../shared/education';
import {englishLessons} from '../../shared/education-en';
export default function Education() {
  const {topic} = useLocalSearchParams<{topic?: string}>(); const {t, language} = useLocale();
  const [selected, setSelected] = useState<string | null>(topic || null), [linkError, setLinkError] = useState(false);
  const lesson = lessons.find(x => x.id === selected);
  const content = lesson ? language === 'en' ? englishLessons[lesson.id] : lesson : null;
  async function open(url: string) {try {await Linking.openURL(url); setLinkError(false);} catch {setLinkError(true);}}
  return <Screen title={t('Pendidikan & 3R', 'Education & 3R')}>
    {lesson && content ? <>
      <View style={{height: 110, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.pale}}><Icon name={lesson.icon as IconName} size={64} /></View>
      <Text style={s.heading}>{content.title}</Text>{content.paragraphs.map(paragraph => <Text key={paragraph} style={s.body}>{paragraph}</Text>)}
      <Card><Text style={s.small}>{t('Rujukan pendidikan', 'Educational source')}</Text><Pressable accessibilityRole="link" onPress={() => void open(lesson.source.url)}><Text style={s.link}>{lesson.source.name}</Text></Pressable></Card>
      {linkError ? <Text accessibilityRole="alert" style={{color: colors.red}}>{t('Pautan gagal dibuka. Semak internet.', 'Unable to open the link. Check your connection.')}</Text> : null}
      <Button secondary title={t('Semua panduan', 'All guides')} onPress={() => setSelected(null)} />
    </> : <>
      <Text style={s.eyebrow}>{t('BELAJAR. ASINGKAN. AMALKAN.', 'LEARN. SORT. ACT.')}</Text><Text style={s.heading}>{t('Langkah kecil untuk alam sekitar', 'Small steps for the environment')}</Text>
      {lessons.map(item => {const copy = language === 'en' ? englishLessons[item.id] : item; return <Pressable accessibilityRole="button" key={item.id} onPress={() => setSelected(item.id)}><Card><View style={s.row}><Icon name={item.icon as IconName} size={32} /><View style={{flex: 1, gap: 5}}><Text style={s.subheading}>{copy.title}</Text><Text style={s.small}>{copy.summary}</Text></View><Icon name="chevron-right" /></View></Card></Pressable>;})}
    </>}
  </Screen>;
}
