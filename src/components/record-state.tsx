import {Text} from 'react-native';
import {useLocale} from '../lib/locale';
import {useRecords} from '../lib/records';
import {Button, Card, s} from './ui';
export function RecordState() {
  const {t} = useLocale(); const {ready, failed, reload} = useRecords();
  if (!ready) return <Text style={s.body}>{t('Memuatkan rekod telefon…', 'Loading device records…')}</Text>;
  if (!failed) return null;
  return <Card style={s.warning}><Text accessibilityRole="alert" style={s.body}>{t('Rekod tidak dapat dibaca. Tiada rekod ditulis ganti. Cuba lagi atau tetapkan semula rekod melalui Tetapan.', 'Records could not be read. Existing data has not been overwritten. Retry or reset records in Settings.')}</Text><Button secondary title={t('Cuba baca semula', 'Retry loading records')} onPress={() => void reload()} /></Card>;
}
