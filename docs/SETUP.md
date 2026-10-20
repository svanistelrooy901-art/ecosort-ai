# EcoSort AI — student prototype

Android-first React Native app on Expo SDK 57 with Expo Router and a separate Cloudflare Worker.

## What exists

- Four native screens: Home, Camera (capture or Android photo picker, review, cancel/retry), AI Result and Education.
- Bahasa Melayu guidance, conditional recycling advice, dry-leaf compost/mulch lessons and open-burning/haze education.
- JPEG resize/re-encode before upload; no account, database or scan history.
- Provider key stays in Worker secrets. Native demo code is entered by the owner and stored with Expo SecureStore, never baked into an APK.
- AI returns a small validated classification. Handling instructions come from the curated local catalog. Low confidence forces an unknown result. No invented confidence percentages.

## Local checks

Use Node 22.13+ (tested with Node 24) and npm:

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run worker:check
npm run export:android
npx expo-doctor
```

`worker:check` bundles with Wrangler **dry-run**; it does not deploy.

## Android preview APK via EAS (owner account required)

1. `npx eas-cli@latest login`
2. `npx eas-cli@latest build:configure` — link/create the owner's Expo project; review the resulting project ID.
3. `npx eas-cli@latest build --platform android --profile preview`
4. Choose only an included/free build option. Stop if payment or a plan upgrade is requested.
5. Download the APK from EAS and install on an Android device. No Play Store account is needed for sideloading.

The preview profile explicitly creates an APK, not an AAB. EAS supplies the native build environment and signing. Do not run `eas submit`, `eas update` or a production deployment without approval. The generated `android/` directory is ignored; configure native settings in app.json and regenerate with Expo prebuild.

## Proposed Worker activation — requires owner approval

Provider adapter: OpenAI Chat Completions with image input, strict JSON schema, configurable model (initial proposal `gpt-4.1-mini`). No paid API call was made in development. Confirm model availability and pricing in the owner's account before enabling.

1. Review `worker/wrangler.jsonc`, choose a unique rate-limiter namespace within the Cloudflare account, and confirm the desired worker name.
2. Create a dedicated API project/key with restricted model permissions. Set provider usage limits and alerts; a budget alert may not be a hard spending cap.
3. Set secrets from the terminal, never in chat or app config:

```sh
npx wrangler secret put OPENAI_API_KEY --config worker/wrangler.jsonc
npx wrangler secret put DEMO_ACCESS_CODE --config worker/wrangler.jsonc
```

Use a unique random demo code of at least 16 characters; 32+ is recommended. The demo code gates this prototype; it is not a substitute for production authentication or app attestation. Rotate after demonstration or if shared outside the class.

4. Change `AI_ENABLED` to `true` only after approval, then deploy using the owner's Cloudflare account. `AI_ENABLED` is false in source so accidental deployments stay closed.
5. In the app, open **Tetapan demo**, enter the Worker HTTPS origin (without path/query), and the demo code.
6. Scan one leaf and compare its result with reality. Test the failure cases in TESTING.md.

The optional `EXPO_PUBLIC_API_URL` is public; it may contain only the backend origin. No private key or demo code belongs in an EXPO_PUBLIC variable.

## Budget and privacy

No paid services have been activated. Plan for the RM200 ceiling, but do not treat it as enforced by this code. Six requests/minute is an approximate per-Cloudflare-location rate limit, **not** a global monthly spending cap. Keep the demo code private, restrict the AI project's allowance, monitor usage during the demonstration, and disable AI immediately afterwards. Revoke the dedicated provider key to stop further provider access.

Photos travel over HTTPS from the phone to the Worker and AI provider when the user presses Analisis. The Worker does not save photos and request logging is disabled. `store:false` is sent to the provider; this is not a promise of zero provider retention. Review the provider's account data controls before using sensitive images. The app has no scan-history feature; temporary image files use device cache.

## Rollback

Set AI_ENABLED=false and redeploy the approved Worker version, rotate/revoke the provider key, and remove the Worker if no longer needed. Return the app source to the baseline branch/commit. Do not erase existing user services or touch ClipDock.

## Education references

Paraphrased educational content, reviewed 19 October 2026:

- https://www.epa.gov/recycle/composting-home — suitable and unsuitable home-compost ingredients.
- https://www.doe.gov.my/pengurusan-udara/pemantauan-pembakaran-terbuka/ — Malaysian open-burning guidance.
- https://www.moh.gov.my/teras/info-kesihatan/jerebu/artikel-dan-panduan-pengguna-berkaitan-jerebu/panduan-kesihatan-untuk-anda — haze and health education.
- https://www.swcorp.gov.my/teknologi-pengurusan-sisa-pepejal/ — organic-waste treatment context.
- https://ewaste.doe.gov.my/ — find appropriate e-waste guidance.

Local recycling acceptance always needs confirmation with the collector/PBT. No photograph can verify resin composition, chemical safety or universal recyclability.
