import {Pressable, Text, View} from 'react-native';
import {issueCategories, labels, descriptions, type IssueCategory} from '../../shared/environment';
import {useLocale} from '../lib/locale';
import {Card, Icon, colors, s} from './ui';
export function CategoryPicker({value, onChange}: {value: IssueCategory; onChange: (value: IssueCategory) => void}) {
  const {language, t} = useLocale();
  return <View accessibilityRole="radiogroup" accessibilityLabel={t('Kategori isu', 'Issue category')} style={{gap: 10}}>
    {issueCategories.map(category => <Pressable key={category} accessibilityRole="radio" accessibilityState={{checked: category === value}} onPress={() => onChange(category)}>
      <Card style={{borderColor: value === category ? colors.green : colors.line, backgroundColor: value === category ? colors.pale : colors.white, padding: 15}}>
        <View style={s.row}><Icon name={value === category ? 'radiobox-marked' : 'radiobox-blank'} /><View style={{flex: 1, gap: 4}}><Text style={s.subheading}>{labels[category][language]}</Text><Text style={s.small}>{descriptions[category][language]}</Text></View></View>
      </Card>
    </Pressable>)}
  </View>;
}
