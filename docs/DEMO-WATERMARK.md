# Demo watermark

The unpaid demo APK displays a floating, two-line “DEMO VERSION / Digital Sambal” badge.
It is mounted above the root navigator, so Home, Camera, Result, Education and their loading,
permission and error states are covered. The native settings Modal mounts the same badge inside
its own window. The label stays fixed while content scrolls and ignores touches
(`pointerEvents="none"`). It is hidden from assistive technologies to avoid repetitive announcements.

The badge is forest green at 65% opacity, positioned at the right edge above lower camera controls,
with bottom safe-area spacing. It is part of the app UI, never of the captured/uploaded image.
It does not appear over other apps, OS permission prompts, the system photo picker or the native splash.

## Paid handover

Only after the owner confirms payment, set `DEMO_WATERMARK_ENABLED` to `false` in
`src/lib/demo-branding.ts`, increase Android versionCode, and produce a new APK.
There is no customer-facing toggle, payment integration, or remote activation.
This is a visual delivery watermark, not tamper-proof licensing.

## Verification

CI must run lint, both TypeScript checks, existing tests and Android bundling.
The Android preview workflow also checks camera permission in the manifest and packaged APK.
On-device review remains required: navigate all four screens, scroll Education, open settings,
and tap the camera/gallery/retry controls around the badge. Verify the captured image has no badge.
APK artifacts now remain downloadable for 30 days instead of one day.
