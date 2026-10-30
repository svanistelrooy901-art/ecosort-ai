import {createContext, useContext, useEffect, useRef, useState, type ReactNode} from 'react';
import {Platform} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import type {Language} from '../../shared/environment';

type Locale = {language: Language; setLanguage: (language: Language) => void; t: (ms: string, en: string) => string};
const Context = createContext<Locale | null>(null);
export function LocaleProvider({children}: {children: ReactNode}) {
  const [language, update] = useState<Language>('ms');
  const [hydrated, setHydrated] = useState(Platform.OS === 'web');
  const chosen = useRef(false);
  useEffect(() => {
    let active = true;
    if (Platform.OS === 'web') return;
    void SecureStore.getItemAsync('ecoxene-language').then(value => {
      if (active && !chosen.current && (value === 'ms' || value === 'en')) update(value);
    }).catch(() => {}).finally(() => {if (active) setHydrated(true);});
    return () => {active = false;};
  }, []);
  useEffect(() => {
    if (hydrated && Platform.OS !== 'web') void SecureStore.setItemAsync('ecoxene-language', language).catch(() => {});
  }, [language, hydrated]);
  return <Context.Provider value={{language, setLanguage: value => {chosen.current = true; update(value);}, t: (ms, en) => language === 'ms' ? ms : en}}>{children}</Context.Provider>;
}
export function useLocale() {
  const value = useContext(Context);
  if (!value) throw new Error('Locale provider missing');
  return value;
}
