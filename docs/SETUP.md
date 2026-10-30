# ECOXENE simplified academic prototype — owner setup

## Current architecture

Android Expo SDK 57 app -> POST /v2/identify -> Cloudflare Worker -> Workers AI
(`@cf/meta/llama-3.2-11b-vision-instruct`). Responses use the shared environmental
category contract. The application checks the response again before displaying it.
The incompatible original /v1/identify endpoint returns 410 upgrade_required.
There is no remaining OpenAI adapter or requirement for an OpenAI API key.

The Worker name is now `ecoxene-api`; this does not modify or deploy any existing Worker.
The repository and Android application ID retain their original names for continuity.
The launcher label and visible product text are ECOXENE. Existing leaf assets are retained;
the client PDF logo has not been recreated as a new source asset.

## What works without AI

Choose a category manually, confirm it, read bilingual guidance, save a personal text
record with optional note/manual location, open the location in Google Maps, browse
category totals and open official reference links. Manual mode is labelled explicitly.
No AI result is fabricated when the backend is missing or disabled.

## Owner actions before live scanning

Deployment and paid services require owner approval. None of the following has been run:

1. Use the owner's Cloudflare Free account and review current Workers AI model eligibility,
   quota and data handling. Do not upgrade billing or enable paid usage automatically.
2. Accept the Meta model licence and acceptable-use policy as the account owner through
   the documented initial model request. Code never auto-accepts licence terms.
3. Review `worker/wrangler.jsonc`: AI binding `AI`, SCAN_LIMITER binding and AI_ENABLED=false.
4. Set a fresh, unpredictable `DEMO_ACCESS_CODE` (16–128 characters) with Cloudflare Secrets.
   Never commit it, paste it in chat, or embed it in the APK. Store any local development
   secrets in ignored `worker/.dev.vars`, not `.dev.vars.example`.
5. Deploy only after approval. With the flag still false, GET /health reports enabled=false.
6. After quota/access review, set AI_ENABLED=true and verify /health. This reports configuration
   readiness, not successful model access, licence acceptance or image recognition quality.
7. Enter the HTTPS Worker origin and demo code once under AI connection settings on the phone.
8. Run an actual JPEG scan in BM and English and verify a schema-valid response.

A 25-second backend response timeout and 35-second app timeout are implemented. Cancelling
or timing out the app stops waiting but may not cancel inference already running in Workers AI;
the binding call itself is not cancelled. There is no automatic inference retry.
The shared 6 requests / 60 seconds rate limiter is approximate per Cloudflare location,
not a global quota, billing control or spending cap.

## Record storage and privacy

Up to 100 personal records are stored using AsyncStorage on the same device. Records contain
only category/source, original AI category/certainty (if any), timestamp, note and manual location.
No photo, API key, demo code, account, reporter identity or incident-status claim is saved in them.
Record storage is not encrypted by the app; users are told not to save sensitive information.
Demo configuration remains in native SecureStore. Android app backup is disabled.

Saving a record does not upload it or send an official complaint. Maps opens only on an explicit
button tap and sends the location text to Google Maps. A textual place search is not verified GPS.
Official channel links contain no automatically attached record. Removing the app can remove records.
Record deletion and reset require explicit UI confirmation. Corrupt data is not overwritten silently;
reset in Settings is an explicitly destructive recovery option.

## Validation and build

- npm run typecheck
- npm run lint
- npm test
- npm run worker:check (dry-run only)
- npm run export:android

The Android preview workflow builds an arm64-v8a standalone APK and validates packaged CAMERA
permission and absence of RECORD_AUDIO. Artifact name: ECOXENE-Lite-preview; retention: 30 days.
APK uses preview/debug signing, not Play Store production signing. A different generated signing
key may require uninstalling an older preview, which deletes device records. Do not uninstall
without noting any records you need to retain. EAS remains an optional alternative, not a paid
service enabled by this work. No iOS build is promised in this package.
