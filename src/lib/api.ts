import {parsePrediction, type Language, type Prediction} from '../../shared/environment';
const messages: Record<string, [string, string]> = {
  unauthorized: ['Kod demo tidak sah. Semak Tetapan AI.', 'Invalid demo code. Check AI settings.'],
  service_unavailable: ['Analisis AI belum diaktifkan. Sediakan backend dahulu.', 'AI analysis is not enabled. Configure the backend first.'],
  rate_limited: ['Had demo sementara dicapai. Tunggu seminit.', 'Demo rate limit reached. Wait a minute.'],
  invalid_image: ['Foto tidak dapat dibaca. Ambil semula.', 'Unable to read this photo. Retake it.'],
  image_too_large: ['Foto terlalu besar. Pilih foto lain.', 'Photo is too large. Choose another.'],
  analysis_timeout: ['Analisis tamat masa. Cuba lagi.', 'Analysis timed out. Try again.'],
  analysis_failed: ['Analisis gagal atau hasil tidak lengkap. Cuba foto lebih jelas.', 'Analysis failed or returned an incomplete result. Try a clearer photo.'],
  invalid_response: ['Respons server tidak sah. Cuba lagi.', 'Invalid server response. Try again.'],
  network: ['Semak sambungan internet dan cuba lagi.', 'Check your internet connection and retry.'],
  upgrade_required: ['Versi backend tidak sepadan. Kemas kini backend projek.', 'Backend version mismatch. Update the project backend.'],
};
export class ApiError extends Error {constructor(public code: string) {super(code);}}
export function apiMessage(error: unknown, language: Language) {
  const pair = messages[error instanceof ApiError ? error.code : 'network'] || messages.analysis_failed;
  return pair[language === 'ms' ? 0 : 1];
}
export function endpoint(base: string): string {
  const url = new URL(base.trim());
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/') throw new Error('Invalid HTTPS origin');
  return url.origin + '/v2/identify';
}
export async function identify(base: string, code: string, image: string, signal: AbortSignal, language: Language = 'ms'): Promise<Prediction> {
  const response = await fetch(endpoint(base), {method: 'POST', headers: {'Content-Type': 'application/json', Authorization: `Bearer ${code}`}, body: JSON.stringify({image, language}), signal});
  let body;
  try {body = await response.json();} catch {throw new ApiError('invalid_response');}
  if (!response.ok) throw new ApiError(typeof body?.error === 'string' ? body.error : 'analysis_failed');
  try {
    if (body.version !== 2 || body.language !== language) throw new Error('Contract mismatch');
    return parsePrediction(body.identification);
  } catch {throw new ApiError('analysis_failed');}
}
