import {Stack} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import {View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {SessionProvider} from '../lib/session';
import {DemoWatermark} from '../components/demo-watermark';
import {LocaleProvider} from '../lib/locale';
import {RecordsProvider} from '../lib/records';

export default function Layout() {
  return (
    <SafeAreaProvider>
      <LocaleProvider><SessionProvider><RecordsProvider>
        <View style={{flex: 1}}>
          <StatusBar style="dark" />
          <Stack screenOptions={{headerShown: false, animation: 'slide_from_right'}} />
          <DemoWatermark />
        </View>
      </RecordsProvider></SessionProvider></LocaleProvider>
    </SafeAreaProvider>
  );
}

