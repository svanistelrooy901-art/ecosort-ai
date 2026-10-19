# Device and live-service acceptance checklist

These are required acceptance checks, not a claim that they have been performed.

- Install APK on a physical Android phone; record model, Android version and APK hash.
- Launch without Metro running; ensure it is a standalone APK.
- Open each of the four screens and verify font sizing, safe areas, Android back behavior and scrolling at large text size.
- Deny camera permission; verify galley remains available. Deny permanently; open Android Settings and grant; return to app.
- Capture a real leaf, review, retake, switch between foreground/background and import a photo with Android's photo picker.
- Enter approved backend URL and code, restart the app, verify secure persistence. Close the configuration modal using both its back arrow and Android back.
- With owner-approved live Worker/key: scan dry leaf, fruit peel, bottle and food container; verify useful but conditional guidance.
- Scan a blurry photo, several mixed items and a non-waste object; verify uncertainty rather than false certainty.
- Verify dangerous material guidance does not recommend burning, composting or DIY processing.
- Disconnect internet, use wrong access code, disable Worker, exhaust rate limit, and cancel a running analysis. Verify retry states and absence of stale results.
- Confirm education works offline. External references require connectivity.
- Verify images and API keys are absent from application logs and source control.
- Revoke code/key or set AI_ENABLED=false after demo; confirm requests are denied.

## Automated checks

`worker/test/api.test.ts` covers client contract, structured classification, uncertain fallback, authentication, closed-by-default behavior, limiter, body-size limits, unsupported input, upstream refusal/truncation/errors/timeouts and secret sanitization. These use a mocked upstream provider, not real AI.
