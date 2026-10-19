import {Stack} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {SessionProvider} from '../lib/session';
export default function Layout(){return <SafeAreaProvider><SessionProvider><StatusBar style="dark"/><Stack screenOptions={{headerShown:false,animation:'slide_from_right'}}/></SessionProvider></SafeAreaProvider>;}
