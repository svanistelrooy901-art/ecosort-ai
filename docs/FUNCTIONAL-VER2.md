# ECOXENE Functional Ver2 — 12 November 2026

Owner: keep approved UI; make RM400 scoped functions real; complex features must be
interactive frontend demos without a backend. Previous UI demo branch remains unchanged.

## Implemented integration
- Branded home launches the functional scanner and solution advisor; real device counts
  and recent observations replace fictional personal totals/statuses.
- New /scan, /scan-result: native camera/gallery, JPEG resize/compress/base64 limit,
  explicit consent action before POST /v2/identify, loading/cancel/retry, 35s client timeout,
  strict existing API parser, uncertain result, user category confirmation/correction.
- No fixed percentage, sample image or sample prediction on the real scanner route.
  Missing credentials/service errors stay errors. Dedicated sample scanner remains available.
- /observation-form saves validated records with provenance through the existing durable
  repository (100 max); duplicate tap guard; no photo/generated prose/agency status stored.
- /observations: filter, details, notes, manual Maps links, guidance, confirmed deletion,
  empty/loading/storage failure states. /activity derives counts/category bars from records.
- /solutions: actual bilingual curated category guidance and manual facility search via Maps;
  explicit manual record creation, no claim of live location or model-generated advice.
- /profile: real record totals, AI settings, education/reference links and separate demo access.
- AI settings hydration no longer clobbers owner input while saved settings are loading.

## Frontend simulations retained/enhanced
Each simulated screen is labelled Sample Data. Maps/hotspots/sensors/IPU, agency routing/
statuses, rewards, recovery, campaigns and pickup have no backend. Sample reports and
bookings stay in session memory and cannot modify real observation counters.
- Map point taps/list open selected sample names; type filters operate on the point list.
- Sample report detail timeline can change status using explicit simulation controls.
- Pickup supports address, material, slot selection, booking review, confirmation and cancel.
- Campaign join, charts, period selectors, 3R materials and demo reset remain interactive.
- Prototype badge appears on real routes; data-specific demo labels remain on sample sections.
- Floating owner watermark retained. No claim of official partners, pickup or incident action.

## Verification
TypeScript, lint and 93 mocked-provider/storage/record-integration tests pass locally.
Worker dry-run passes with AI_ENABLED=false; Android JS export checked separately.
Seven new regression cases verify accepted AI vs corrected/manual provenance, uncertainty,
confirmation gates, durable save/reload/delete counts and exclusion of photos/statuses.
Native camera, visual fidelity and live inference require physical-device testing.

## Live backend blocker / concrete deployment target
Read-only `wrangler whoami --config worker/wrangler.jsonc` reports not authenticated.
No credentials, licence acceptance, deployment or billing changes have been performed.
Owner needs their Cloudflare account, Workers AI eligibility/model access and a secret demo code.
Proposed target is only `ecoxene-api`, AI binding `AI`, limiter `SCAN_LIMITER`, 6/60 seconds.
Keep AI_ENABLED=false for first deployment and check /health; enable only after owner's quota/
licence review. No paid plan upgrade. Rate limiter is not a global spend cap.
See SETUP.md for secret entry and activation steps; never put secrets into source/chat/APK.
Then enter HTTPS Worker origin + demo code on phone, test real JPEG BM/EN and unknown cases.

## Build/handover
Android label ECOXENE, version 1.3.0, versionCode 7, same package as prior previews.
Artifact ECOXENE-Functional-Ver2. Preview/debug signing; not a store release.
Ver1 remains on dev/ecoxene-ui-fidelity-v1; this branch is dev/ecoxene-functional-v2.
No merge/deployment authorised by this change. No iOS build produced: signing still needed.
