export type Language = 'ms' | 'en';
export type Localized = Record<Language, string>;
export const issueCategories = ['suspected_smoke', 'domestic_waste', 'agricultural_waste', 'construction_waste', 'improper_disposal', 'vegetation_damage', 'unknown'] as const;
export type IssueCategory = typeof issueCategories[number];
export type Prediction = {category: IssueCategory; certainty: 'likely' | 'uncertain'; summary: string; observations: string[]};
export type CategorySelection = {category: IssueCategory; source: 'ai' | 'user'; confirmed: boolean};
export const labels: Record<IssueCategory, Localized> = {
  suspected_smoke: {ms: 'Asap / pembakaran disyaki', en: 'Suspected smoke / burning'},
  domestic_waste: {ms: 'Sisa domestik', en: 'Domestic waste'},
  agricultural_waste: {ms: 'Sisa pertanian / taman', en: 'Agricultural / garden waste'},
  construction_waste: {ms: 'Sisa pembinaan', en: 'Construction waste'},
  improper_disposal: {ms: 'Pembuangan tidak terurus', en: 'Possible improper disposal'},
  vegetation_damage: {ms: 'Kerosakan tumbuhan / habitat', en: 'Visible plant / habitat damage'},
  unknown: {ms: 'Belum dapat dikenal pasti', en: 'Unable to identify'},
};
export const descriptions: Record<IssueCategory, Localized> = {
  suspected_smoke: {ms: 'Asap atau api kelihatan. Punca sebenar perlu disahkan.', en: 'Visible smoke or flames. The cause needs confirmation.'},
  domestic_waste: {ms: 'Pembungkus, botol, kertas atau sisa makanan.', en: 'Packaging, bottles, paper or food scraps.'},
  agricultural_waste: {ms: 'Daun, ranting atau sisa tanaman.', en: 'Leaves, branches or crop residues.'},
  construction_waste: {ms: 'Bata, konkrit, kayu atau bahan renovasi.', en: 'Bricks, concrete, timber or renovation materials.'},
  improper_disposal: {ms: 'Longgokan sisa di kawasan yang tidak terurus; status undang-undang tidak dapat dipastikan melalui foto.', en: 'Discarded waste in an unmanaged area; a photo cannot establish whether disposal is illegal.'},
  vegetation_damage: {ms: 'Tumbuhan layu, rosak, terbakar atau kawasan terganggu.', en: 'Wilted, damaged or scorched plants, or disturbed vegetation.'},
  unknown: {ms: 'Foto kabur, bercampur atau bukti tidak mencukupi.', en: 'Unclear, mixed or insufficient visual evidence.'},
};
export function isIssueCategory(value: unknown): value is IssueCategory {
  return typeof value === 'string' && issueCategories.includes(value as IssueCategory);
}
export function parsePrediction(value: unknown): Prediction {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid prediction');
  const v = value as Record<string, unknown>;
  if (Object.keys(v).length !== 4 || Object.keys(v).some(k => !['category', 'certainty', 'summary', 'observations'].includes(k)) ||
      !isIssueCategory(v.category) || (typeof v.certainty !== 'string' || !['likely', 'uncertain'].includes(v.certainty)) ||
      typeof v.summary !== 'string' || !v.summary.trim() || v.summary.length > 500 ||
      !Array.isArray(v.observations) || v.observations.length < 1 || v.observations.length > 4 ||
      v.observations.some(x => typeof x !== 'string' || !x.trim() || x.length > 180)) throw new Error('Invalid prediction');
  const uncertain = v.certainty === 'uncertain' || v.category === 'unknown';
  return {category: uncertain ? 'unknown' : v.category, certainty: uncertain ? 'uncertain' : 'likely', summary: v.summary.trim(), observations: v.observations.map(x => (x as string).trim())};
}
export function selectCategory(prediction: Prediction | null, category: IssueCategory, confirmed = false): CategorySelection {
  return {category, source: prediction && prediction.category === category ? 'ai' : 'user', confirmed: confirmed && category !== 'unknown'};
}
