import {StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Icon} from './ui';
import {DEMO_WATERMARK_ENABLED} from '../lib/demo-branding';

/** UI overlay only: never composited into captured or uploaded photographs. */
export function DemoWatermark() {
  const insets = useSafeAreaInsets();
  if (!DEMO_WATERMARK_ENABLED) return null;

  return (
    <View
      pointerEvents="none"
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.position, {bottom: insets.bottom + 144}]}>
      <View style={styles.badge}>
        <Icon name="leaf" size={21} color="#FFFFFF" />
        <View style={styles.copy}>
          <Text maxFontSizeMultiplier={1.4} style={styles.title}>DEMO VERSION</Text>
          <Text maxFontSizeMultiplier={1.4} style={styles.brand}>Digital Sambal</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  position: {position: 'absolute', right: 12, maxWidth: '90%', zIndex: 9999, elevation: 20},
  badge: {flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 24,
    paddingHorizontal: 14, paddingVertical: 10, backgroundColor: '#28633F', opacity: 0.65,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.6)'},
  copy: {flexShrink: 1},
  title: {color: '#FFFFFF', fontSize: 11, fontWeight: '800', letterSpacing: 0.8},
  brand: {color: '#FFFFFF', fontSize: 12, fontWeight: '600', marginTop: 2},
});
