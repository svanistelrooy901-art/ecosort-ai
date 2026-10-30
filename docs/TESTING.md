# ECOXENE lite — acceptance checklist

## Automated

Run app/Worker typecheck, Expo lint, Vitest, Worker dry-run and Android JS export.
The APK workflow additionally validates generated-manifest and packaged permissions.
Do not count mocked binding responses as evidence of live model accuracy.

## Physical Android device (pending)

1. Install the new preview APK. Verify ECOXENE launcher label, leaf icon, watermark and BM/English.
2. Navigate dashboard -> scanner -> result -> advisor -> channels -> records -> activity.
3. Deny camera, grant it later in Settings, return and retry. Gallery should remain available.
4. Capture/review/retake and cancel. Watermark must not be present in the captured photograph.
5. Without AI configuration, the app must show setup guidance and still allow manual category choice.
6. Select a category, confirm, save note and manual place. Check saved source is user, not AI.
7. Restart the app. Record and language should survive; photo should not be in record history.
8. Filter records, open Maps after reading location-sharing copy, and verify the search query.
9. Counts must reflect only saved records and update after deletion. Confirm delete/reset can be cancelled.
10. Delete all records via Settings. Verify zero genuine records, not demo/example statistics.
11. Check 320–430 px widths, large system text, all buttons and modal/system picker returns.
12. Check source links open in browser without sending any personal record automatically.

## Owner-enabled live AI (pending; deployment requires approval)

Verify licence/access and Free-tier quota, configure AI binding/secret and explicitly enable.
Scan BM and English photos across six issue categories. Capture unclear, mixed and unrelated
images: unknown/uncertain or a clear retry/error must appear; never force a high-confidence result.
Correct one prediction manually: original prediction must remain distinct, selection is user-sourced.
Save it and verify activity counts do not treat it as AI-accepted. Test connectivity failure, denied
access, rate limit, model failure and timeout. Do not infer legal status, pollutant levels or causes
from a photo. Report actual samples/errors; do not invent recognition accuracy.
