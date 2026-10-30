import {Pressable, StyleSheet, Text, View} from 'react-native';
import {router} from 'expo-router';
import {colors, Icon, type IconName} from './ui';
import {useLocale} from '../lib/locale';

export function DashboardHeading({icon, title, detail, action, onPress}: {icon: IconName; title: string; detail?: string; action?: string; onPress?: () => void}) {
  return <View style={d.sectionHeading}><View style={d.headingCopy}><Icon name={icon} size={23} /><View style={{flex: 1, gap: 3}}><Text style={d.sectionTitle}>{title}</Text>{detail ? <Text style={d.caption}>{detail}</Text> : null}</View></View>{action && onPress ? <Pressable accessibilityRole="button" onPress={onPress} style={{minHeight: 44, justifyContent: 'center'}}><Text style={d.link}>{action}</Text></Pressable> : null}</View>;
}
export function DashboardStat({value, label}: {value: number; label: string}) {return <View style={d.stat}><Text style={d.statValue}>{value}</Text><Text style={d.statLabel}>{label}</Text></View>;}
export function DashboardShortcut({icon, title, onPress}: {icon: IconName; title: string; onPress: () => void}) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={({pressed}) => [d.shortcut, pressed && {opacity: .7}]}><Icon name={icon} size={27} /><Text style={d.shortcutTitle}>{title}</Text><Icon name="chevron-right" size={19} /></Pressable>;
}
export function DashboardNav() {
  const {t} = useLocale();
  const items: {icon: IconName; label: string; route: '/' | '/camera' | '/monitoring' | '/settings'}[] = [
    {icon: 'home-outline', label: t('Utama', 'Home'), route: '/'},
    {icon: 'camera-outline', label: t('Imbas', 'Scan'), route: '/camera'},
    {icon: 'map-marker-outline', label: t('Lokasi', 'Locations'), route: '/monitoring'},
    {icon: 'account-outline', label: t('Peranti', 'Device'), route: '/settings'},
  ];
  return <View style={d.nav}>{items.map(item => <Pressable key={item.route} accessibilityRole="button" accessibilityLabel={item.label} accessibilityState={{selected: item.route === '/'}} onPress={() => {if (item.route !== '/') router.push(item.route);}} style={d.navItem}><Icon name={item.icon} size={24} color={item.route === '/' ? colors.green : colors.muted} /><Text style={[d.navText, item.route === '/' && {color: colors.green, fontWeight: '800'}]}>{item.label}</Text></Pressable>)}</View>;
}
export const d = StyleSheet.create({
  sectionHeading: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8},
  headingCopy: {flex: 1, flexDirection: 'row', gap: 9, alignItems: 'center'},
  sectionTitle: {fontSize: 18, lineHeight: 24, color: colors.dark, fontWeight: '800'},
  caption: {fontSize: 12, lineHeight: 18, color: colors.muted},
  link: {fontSize: 12, fontWeight: '700', color: colors.green},
  stat: {flex: 1, minWidth: 68, paddingVertical: 12, paddingHorizontal: 7, borderRadius: 16, backgroundColor: colors.pale, alignItems: 'center', gap: 4},
  statValue: {fontSize: 26, lineHeight: 32, color: colors.green, fontWeight: '800'},
  statLabel: {fontSize: 11, lineHeight: 16, textAlign: 'center', color: colors.muted},
  shortcut: {minHeight: 78, flexDirection: 'row', gap: 8, alignItems: 'center', padding: 14, backgroundColor: '#EAF3E9', borderRadius: 18, borderWidth: 1, borderColor: colors.line},
  shortcutTitle: {fontSize: 13, lineHeight: 19, color: colors.dark, fontWeight: '700', flex: 1},
  nav: {flexDirection: 'row', backgroundColor: 'white', paddingTop: 6, borderTopWidth: 1, borderTopColor: colors.line},
  navItem: {flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 56, gap: 3, paddingHorizontal: 3, paddingBottom: 5},
  navText: {fontSize: 11, lineHeight: 15, color: colors.muted},
});
