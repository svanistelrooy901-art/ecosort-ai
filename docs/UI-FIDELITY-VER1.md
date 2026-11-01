# ECOXENE — Ver1 UI Fidelity

Owner approved 1 November 2026: recreate the client PDF interface as closely as possible,
mock complex integrations, keep simple functionality. This is a separate demo branch/PR,
not activation of services or an expansion of the RM400 functional implementation.

## Reference mapping

| PDF | App-owned implementation |
| --- | --- |
| 4 | Alerts, map, Report an Issue CTA, report summary/statuses |
| 8 | Logo/landscape/scanner CTA/2×2 tiles/bottom navigation; picker, result, uncertain result, manual correction, confirmation |
| 10 | Static satellite map and tappable points, hotspot detail, sensor cards, alert, reports |
| 13 | Location → issue → recommendations → 3R; material guide, sample facility, challenge |
| 14 | JAS/SAM/MNS role cards, simulated referral preview, actual reference links |
| 16 | Report statistics, monthly chart, follow-up bars, problem chart/heatmap, restoration activities, sample recovery score |

Where references are posters showing different concepts, preserve each module's layout and
visual language rather than claiming a single pixel-exact screen exists for every state.
Home combines p8's branded hero/shortcuts with p4's dashboard section order below.
Tracker's two desktop columns stack on a phone. Native system bars are not recreated.

## Working features

- Native Expo Router navigation and back; all four demo tabs and six modules accessible.
- BM/English switch (existing language persistence).
- Real camera permission/capture through Android system camera; real gallery picker and review.
- Category selection/correction, fixed sample results, uncertain scenario switch.
- Real curated guidance and educational pages, existing official reference links/Google Maps search.
- Confirmed manual category can be saved through the existing real local-record flow, explicitly
  as user-selected (no sample AI percentage/prose is stored in real records).
- Map sample-point list filters, tappable reference-map points, status filters, report detail.
- Demo report form, selected pickup slot, campaign join/reset in memory for this session only.

## Simulation boundaries

Persistent top label: Ver1 / UI Demo / Sample Data, plus original floating Digital Sambal watermark.
Map and pin artwork is a static source image; filters apply to the point list (stated beside map).
All IPU, satellite/sensor values, confidence percentages, agency status/timeline, eco points,
pickup slots, facilities, recovery statistics and campaign participation are clearly sample data.
Captured photos are not analysed or uploaded. Results are fixed, explicitly labelled scenarios.
No official agency submission, account, booking, live map, GPS, push or real reward exists.
No Workers AI calls; existing Worker remains disabled and unchanged.
Demo memory resets on process restart; real local records are separate and not reset by demo reset.
Original functional prototype remains accessible from the demo Profile screen.

## Review checklist on Android

- Install versionCode 6 (same package ID as previous previews; updates replace the launcher).
- First screen is the UI demo. Header badge and floating watermark visible throughout demo routes.
- Switch BM/EN. Check line wrapping and four-tab navigation at normal/large font size.
- Take/upload image; confirm preview, sample disclaimer, normal and uncertain sample result.
- Correct category/reason → confirm → advisor; save an actual manual record and inspect it.
- Check map points/list filters, hotspot/sensor/alert routes, manual Maps link and failure state.
- Create a demo report; verify detail/status filters, no duplication on repeated submit, session reset.
- Advisor location edit, problem selection, recommendations, 3R tabs/materials and education.
- Pickup/campaign remain demo-only. Government reference links open only on explicit action.
- Tracker period/details/activity controls and profile's real-record access.

## Validation

TypeScript, Expo lint, 86 existing backend/storage regression tests and Android JS export passed
locally during implementation. Those tests do not establish UI fidelity or live AI accuracy.
Native screenshot/physical-device visual QA is pending; no exact visual acceptance claim.
