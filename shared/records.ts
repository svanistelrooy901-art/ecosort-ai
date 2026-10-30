import {isIssueCategory, type CategorySelection, type IssueCategory} from './environment';
export const MAX_RECORDS = 100;
export type LocalRecord = {
  id: string; createdAt: string; category: IssueCategory; source: 'ai' | 'user';
  aiCategory: IssueCategory | null; aiCertainty: 'likely' | 'uncertain' | null;
  note: string; location: string;
};
export function parseRecord(value: unknown): LocalRecord {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('invalid_record');
  const v = value as Record<string, unknown>;
  const fields = ['id', 'createdAt', 'category', 'source', 'aiCategory', 'aiCertainty', 'note', 'location'];
  if (Object.keys(v).length !== fields.length || Object.keys(v).some(k => !fields.includes(k)) ||
      typeof v.id !== 'string' || !/^[A-Za-z0-9_-]{1,80}$/.test(v.id) ||
      typeof v.createdAt !== 'string' || !Number.isFinite(Date.parse(v.createdAt)) ||
      !isIssueCategory(v.category) || v.category === 'unknown' || (typeof v.source !== 'string' || !['ai', 'user'].includes(v.source)) ||
      !(v.aiCategory === null || isIssueCategory(v.aiCategory)) ||
      ![null, 'likely', 'uncertain'].includes(v.aiCertainty as null | string) ||
      (v.aiCategory === null) !== (v.aiCertainty === null) ||
      (v.aiCertainty === 'uncertain' && v.aiCategory !== 'unknown') ||
      (v.source === 'ai' && (v.aiCategory !== v.category || v.aiCertainty !== 'likely')) ||
      typeof v.note !== 'string' || v.note.length > 300 || typeof v.location !== 'string' || v.location.length > 120) throw new Error('invalid_record');
  return {...v, note: v.note.trim(), location: v.location.trim()} as LocalRecord;
}
export function canSaveSelection(value: CategorySelection): boolean {return value.confirmed && value.category !== 'unknown';}
export function parseRecordStore(raw: string | null): LocalRecord[] {
  if (raw === null) return [];
  const value = JSON.parse(raw);
  if (!value || value.version !== 1 || Object.keys(value).length !== 2 || !Array.isArray(value.records) || value.records.length > MAX_RECORDS) throw new Error('invalid_store');
  const records = value.records.map(parseRecord);
  if (new Set(records.map((r: LocalRecord) => r.id)).size !== records.length) throw new Error('duplicate_record');
  return records;
}
export function mapSearchUrl(location: string): string {
  if (!location.trim() || location.length > 120) throw new Error('invalid_location');
  return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(location.trim());
}
export function recordCounts(records: LocalRecord[]) {
  const categories: Partial<Record<IssueCategory, number>> = {};
  for (const record of records) categories[record.category] = (categories[record.category] || 0) + 1;
  return {total: records.length, withLocation: records.filter(r => !!r.location).length, aiAccepted: records.filter(r => r.source === 'ai').length, manual: records.filter(r => r.source === 'user').length, categories};
}
type Storage = {getItem(key: string): Promise<string | null>; setItem(key: string, value: string): Promise<unknown>};
const KEY = 'ecoxene-local-records-v1';
export function createRecordRepository(storage: Storage) {
  let queue: Promise<unknown> = Promise.resolve();
  function serial<T>(operation: () => Promise<T>): Promise<T> {
    const next = queue.then(operation); queue = next.catch(() => {}); return next;
  }
  async function load() {return parseRecordStore(await storage.getItem(KEY));}
  async function write(records: LocalRecord[]) {await storage.setItem(KEY, JSON.stringify({version: 1, records})); return records;}
  return {
    load: () => serial(load),
    add: (value: LocalRecord) => serial(async () => {
      const record = parseRecord(value), current = await load();
      if (current.some(r => r.id === record.id)) throw new Error('duplicate_record');
      if (current.length >= MAX_RECORDS) throw new Error('record_limit');
      return write([record, ...current]);
    }),
    remove: (id: string) => serial(async () => write((await load()).filter(r => r.id !== id))),
    // Explicitly destructive recovery; caller must obtain user confirmation first.
    clear: () => serial(() => write([])),
  };
}
