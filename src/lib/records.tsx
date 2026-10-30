import {createContext, useContext, useEffect, useState, type ReactNode} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createRecordRepository, type LocalRecord} from '../../shared/records';
const repository = createRecordRepository(AsyncStorage);
type State = {records: LocalRecord[]; ready: boolean; failed: boolean; reload: () => Promise<void>; add: (record: LocalRecord) => Promise<void>; remove: (id: string) => Promise<void>; clear: () => Promise<void>};
const Context = createContext<State | null>(null);
export function RecordsProvider({children}: {children: ReactNode}) {
  const [records, setRecords] = useState<LocalRecord[]>([]), [ready, setReady] = useState(false), [failed, setFailed] = useState(false);
  async function reload() {setReady(false); try {setRecords(await repository.load()); setFailed(false);} catch {setFailed(true);} finally {setReady(true);}}
  useEffect(() => {
    let active = true;
    void repository.load().then(value => {if (active) {setRecords(value); setFailed(false);}}).catch(() => {if (active) setFailed(true);}).finally(() => {if (active) setReady(true);});
    return () => {active = false;};
  }, []);
  async function add(record: LocalRecord) {if (!ready || failed) throw new Error('storage_unavailable'); setRecords(await repository.add(record));}
  async function remove(id: string) {if (!ready || failed) throw new Error('storage_unavailable'); setRecords(await repository.remove(id));}
  async function clear() {setRecords(await repository.clear()); setFailed(false); setReady(true);}
  return <Context.Provider value={{records, ready, failed, reload, add, remove, clear}}>{children}</Context.Provider>;
}
export function useRecords() {const value = useContext(Context); if (!value) throw new Error('Records provider missing'); return value;}
