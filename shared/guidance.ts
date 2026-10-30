import type {IssueCategory, Language, Localized} from './environment';
type Guidance = {title: Localized; steps: Record<Language, string[]>; limit: Localized; route: Localized};
export const guidance: Record<IssueCategory, Guidance> = {
  suspected_smoke: {
    title: {ms: 'Utamakan jarak yang selamat', en: 'Keep a safe distance'},
    steps: {ms: ['Jangan mendekati api atau masuk ke kawasan berasap untuk mengambil gambar.', 'Jika selamat, catat lokasi dan masa pemerhatian.', 'Gunakan saluran kecemasan bagi bahaya segera; untuk aduan pencemaran, semak saluran rasmi JAS atau pihak setempat.'], en: ['Do not approach flames or enter smoke to take a photograph.', 'If safe, note the location and observation time.', 'Use emergency services for immediate danger; for pollution complaints, check official DOE or local reporting channels.']},
    limit: {ms: 'Foto tidak mengesahkan punca asap, tahap bahaya atau kesalahan undang-undang.', en: 'A photo does not establish the smoke source, danger level or a legal violation.'},
    route: {ms: 'Saluran rasmi JAS / pihak kecemasan mengikut keadaan', en: 'Official DOE / emergency channels as appropriate'},
  },
  domestic_waste: {
    title: {ms: 'Asingkan bahan yang sesuai', en: 'Separate suitable materials'},
    steps: {ms: ['Asingkan bahan kitar semula yang bersih jika selamat.', 'Kompos hanya sisa tumbuhan yang sesuai; elakkan daging, tenusu dan minyak untuk kompos rumah.', 'Semak penerimaan pengumpul dan ikut kutipan PBT bagi sisa baki.'], en: ['Separate clean recyclable materials when safe.', 'Home-compost suitable plant scraps; avoid meat, dairy and oils.', 'Check local collector acceptance and use municipal collection for residual waste.']},
    limit: {ms: 'Foto tidak menentukan resin plastik atau penerimaan pengumpul. Jangan bakar sampah.', en: 'A photo cannot determine plastic resin or collector acceptance. Do not burn waste.'},
    route: {ms: 'PBT / pengumpul kitar semula setempat', en: 'Local council / recycling collector'},
  },
  agricultural_waste: {
    title: {ms: 'Pilih kompos atau sungkupan', en: 'Consider compost or mulch'},
    steps: {ms: ['Asingkan daun dan ranting bersih daripada plastik atau bahan tercemar.', 'Cincang bahan sesuai untuk kompos atau sungkupan; jarakkan sungkupan daripada batang pokok.', 'Semak kutipan sisa taman bagi kuantiti besar. Jangan bakar.'], en: ['Separate clean leaves and branches from plastics or contaminated materials.', 'Shred suitable material for compost or mulch; keep mulch away from plant stems.', 'Check garden-waste collection for larger quantities. Do not burn.']},
    limit: {ms: 'Elakkan bahan berpenyakit atau tercemar racun dalam kompos rumah.', en: 'Avoid diseased or pesticide-contaminated material in home compost.'},
    route: {ms: 'PBT / penyedia kutipan sisa taman', en: 'Local council / garden-waste service'},
  },
  construction_waste: {
    title: {ms: 'Gunakan pengendali yang sesuai', en: 'Use a suitable waste handler'},
    steps: {ms: ['Jangan sentuh objek tajam atau bahan binaan yang tidak diketahui.', 'Jika selamat, asingkan bahan yang diterima untuk pemulihan atau kitar semula.', 'Semak pengendali sisa pembinaan yang dibenarkan atau panduan PBT.'], en: ['Do not handle sharp objects or unidentified building materials.', 'When safe, separate materials accepted for recovery or recycling.', 'Check authorised construction-waste services or local council guidance.']},
    limit: {ms: 'Foto tidak boleh menolak kehadiran asbestos atau bahan berbahaya.', en: 'A photo cannot rule out asbestos or other hazardous materials.'},
    route: {ms: 'PBT / pengendali sisa pembinaan', en: 'Local council / construction-waste service'},
  },
  improper_disposal: {
    title: {ms: 'Rekod pemerhatian dengan selamat', en: 'Record observations safely'},
    steps: {ms: ['Catat lokasi, masa dan jenis sisa dari tempat yang selamat.', 'Jangan masuk ke tanah persendirian atau berdepan dengan individu.', 'Semak sama ada tapak dibenarkan dan gunakan saluran PBT atau agensi berkaitan jika sesuai.'], en: ['Note the location, time and visible waste from a safe place.', 'Do not enter private land or confront people.', 'Check whether the site is authorised and use the relevant council or agency channel if appropriate.']},
    limit: {ms: 'Pembuangan “haram” tidak dapat diputuskan melalui foto sahaja.', en: 'A photo alone cannot establish that dumping is illegal.'},
    route: {ms: 'PBT / agensi berkaitan mengikut jenis isu', en: 'Local council / relevant agency for the issue'},
  },
  vegetation_damage: {
    title: {ms: 'Elakkan mengganggu kawasan', en: 'Avoid disturbing the area'},
    steps: {ms: ['Ambil gambar dari tempat selamat tanpa merosakkan tumbuhan.', 'Rekod lokasi dan perubahan yang diperhatikan.', 'Dapatkan penilaian pihak perhutanan, alam sekitar atau pemilik kawasan jika perlu.'], en: ['Photograph from a safe location without damaging vegetation.', 'Record the location and visible changes.', 'Seek assessment from forestry, environmental authorities or the site owner when needed.']},
    limit: {ms: 'Punca kerosakan dan pemulihan habitat memerlukan penilaian; foto sahaja tidak mencukupi.', en: 'Damage causes and habitat recovery need assessment; photos alone are insufficient.'},
    route: {ms: 'Pihak perhutanan / alam sekitar / pemilik kawasan', en: 'Forestry / environmental authority / site owner'},
  },
  unknown: {
    title: {ms: 'Semak sebelum bertindak', en: 'Check before acting'},
    steps: {ms: ['Ambil foto yang jelas jika selamat.', 'Pilih kategori sendiri hanya jika anda mengenali isu tersebut.', 'Dapatkan bantuan pihak berkaitan; jangan sentuh, bakar atau proses bahan tidak diketahui.'], en: ['Take a clearer photograph if safe.', 'Choose a category manually only if you recognise the issue.', 'Seek appropriate help; do not touch, burn or process unidentified material.']},
    limit: {ms: 'Tiada kategori dapat disahkan.', en: 'No category has been confirmed.'},
    route: {ms: 'Dapatkan nasihat pihak berkaitan', en: 'Seek advice from the relevant authority'},
  },
};
