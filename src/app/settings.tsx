import {useState} from 'react';
import {Text, TextInput} from 'react-native';
import {Screen, Button, Card, s, colors} from '../components/ui';
import {useLocale} from '../lib/locale';
import {useSession} from '../lib/session';
import {endpoint} from '../lib/api';
import {useRecords} from '../lib/records';
export default function Settings() {
  const {t} = useLocale(); const session = useSession(); const records = useRecords();
  const [confirmReset, setConfirmReset] = useState(false), [resetting, setResetting] = useState(false), [resetError, setResetError] = useState(false);
  const [base, setBase] = useState(session.base), [code, setCode] = useState(session.code);
  const [error, setError] = useState(''), [saving, setSaving] = useState(false), [saved, setSaved] = useState(false);
  async function save() {
    setError(''); setSaved(false);
    try {endpoint(base);} catch {setError('url'); return;}
    if (code.trim().length < 16 || code.trim().length > 128) {setError('code'); return;}
    setSaving(true);
    try {await session.save(base.trim(), code.trim()); setSaved(true);} catch {setError('save');} finally {setSaving(false);}
  }
  return <Screen title={t('Tetapan AI', 'AI settings')}>
    <Text style={s.heading}>{t('Sambungkan backend projek', 'Connect the project backend')}</Text>
    <Text style={s.body}>{t('Gunakan Worker dengan binding Workers AI. Jangan masukkan API key atau token Cloudflare di sini.', 'Use a Worker with a Workers AI binding. Do not enter an API key or Cloudflare token here.')}</Text>
    <Text style={s.small}>{t('Alamat backend HTTPS', 'HTTPS backend address')}</Text>
    <TextInput accessibilityLabel={t('Alamat backend HTTPS', 'HTTPS backend address')} value={base} onChangeText={v => {setBase(v); setSaved(false);}} autoCapitalize="none" autoCorrect={false} keyboardType="url" placeholder="https://ecoxene-api.…workers.dev" style={s.input} />
    <Text style={s.small}>{t('Kod akses demo', 'Demo access code')}</Text>
    <TextInput accessibilityLabel={t('Kod akses demo', 'Demo access code')} value={code} onChangeText={v => {setCode(v); setSaved(false);}} secureTextEntry autoCapitalize="none" autoCorrect={false} maxLength={128} style={s.input} />
    <Text style={s.small}>{t('Kod disimpan dalam storan selamat Android. Foto dihantar hanya selepas Analisis ditekan. Tiada sejarah foto disimpan oleh aplikasi.', 'The code is saved in secure Android storage. Photos are sent only after you tap Analyse. The app does not save a photo history.')}</Text>
    {error ? <Text accessibilityRole="alert" style={{color: colors.red}}>{error === 'url' ? t('Gunakan alamat HTTPS sahaja tanpa path atau query.', 'Use an HTTPS origin without a path or query.') : error === 'code' ? t('Kod demo mesti antara 16 hingga 128 aksara.', 'Demo code must contain 16 to 128 characters.') : t('Tetapan gagal disimpan.', 'Unable to save settings.')}</Text> : null}
    <Button title={t('Simpan tetapan', 'Save settings')} busy={saving} onPress={save} />
    {saved ? <Card><Text accessibilityRole="alert" style={s.body}>{t('Tetapan disimpan. Ini belum mengesahkan sambungan atau akses AI.', 'Settings saved. This does not yet verify connectivity or AI access.')}</Text></Card> : null}
    <Card><Text style={s.subheading}>{t('Rekod telefon', 'Device records')}</Text><Text style={s.small}>{t('Simpan sehingga 100 rekod teks pada telefon ini. Storan rekod tidak disulitkan oleh aplikasi. Tiada foto, akaun atau penyelarasan awan. Jangan simpan maklumat sensitif.', 'Save up to 100 text records on this device. Record storage is not encrypted by the app. No photos, accounts or cloud sync. Do not save sensitive information.')}</Text>
      {confirmReset ? <><Text style={s.body}>{t('Padam SEMUA rekod telefon? Tindakan ini tidak boleh dibatalkan.', 'Delete ALL device records? This cannot be undone.')}</Text><Button title={t('Ya, padam semua rekod', 'Yes, delete all records')} busy={resetting} onPress={() => {setResetting(true); setResetError(false); void records.clear().then(() => setConfirmReset(false)).catch(() => setResetError(true)).finally(() => setResetting(false));}} /><Button secondary title={t('Batal', 'Cancel')} disabled={resetting} onPress={() => setConfirmReset(false)} /></> : <Button secondary title={t('Tetapkan semula rekod', 'Reset records')} onPress={() => setConfirmReset(true)} />}
      {resetError ? <Text accessibilityRole="alert" style={{color: colors.red}}>{t('Rekod gagal dipadam. Cuba lagi.', 'Unable to delete records. Retry.')}</Text> : null}
    </Card>
  </Screen>;
}
