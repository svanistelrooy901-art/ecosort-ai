import {createContext, useContext, useState, useEffect, type ReactNode} from 'react';
import * as SecureStore from 'expo-secure-store';
import {Platform} from 'react-native';
import {selectCategory, type Prediction, type CategorySelection, type Language} from '../../shared/environment';
export type Photo = {uri: string; base64: string};
type State = {
  photo: Photo | null; result: Prediction | null; resultLanguage: Language;
  selection: CategorySelection; setSelection: (selection: CategorySelection) => void;
  startResult: (result: Prediction | null, language: Language, photo: Photo | null) => void;
  base: string; code: string; ready: boolean; save: (base: string, code: string) => Promise<void>;
};
const Context = createContext<State | null>(null);
export function SessionProvider({children}: {children: ReactNode}) {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [result, setResult] = useState<Prediction | null>(null);
  const [resultLanguage, setResultLanguage] = useState<Language>('ms');
  const [selection, setSelection] = useState<CategorySelection>(selectCategory(null, 'unknown'));
  const [base, setBase] = useState(process.env.EXPO_PUBLIC_API_URL || '');
  const [code, setCode] = useState('');
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        if (Platform.OS !== 'web') {
          // Retain the old key so existing owner-entered settings survive an update.
          const saved = await SecureStore.getItemAsync('ecosort-config');
          if (saved && active) {const value = JSON.parse(saved); setBase(typeof value.base === 'string' ? value.base : ''); setCode(typeof value.code === 'string' ? value.code : '');}
        }
      } catch {} finally {if (active) setReady(true);}
    })();
    return () => {active = false;};
  }, []);
  function startResult(next: Prediction | null, language: Language, nextPhoto: Photo | null) {
    setResult(next); setResultLanguage(language); setPhoto(nextPhoto);
    setSelection(selectCategory(next, next?.category || 'unknown'));
  }
  async function save(b: string, c: string) {
    if (Platform.OS !== 'web') await SecureStore.setItemAsync('ecosort-config', JSON.stringify({base: b, code: c}));
    setBase(b); setCode(c);
  }
  return <Context.Provider value={{photo, result, resultLanguage, selection, setSelection, startResult, base, code, ready, save}}>{children}</Context.Provider>;
}
export function useSession() {const value = useContext(Context); if (!value) throw new Error('Session unavailable'); return value;}
