import {Stack} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import {View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {SessionProvider} from '../lib/session';
import {DemoWatermark} from '../components/demo-watermark';

export default function Layout() {
  return (
    <SafeAreaProvider>
      <SessionProvider>
        <View style={{flex: 1}}>
          <StatusBar style="dark" />
          <Stack screenOptions={{headerShown: false, animation: 'slide_from_right'}} />
          <DemoWatermark />
        </View>
      </SessionProvider>
    </SafeAreaProvider>
  );
}
