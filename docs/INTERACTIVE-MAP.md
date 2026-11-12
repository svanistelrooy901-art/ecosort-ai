# ECOXENE interactive map — 12 November 2026

Owner requested a map that feels real, replacing the static reference photo while keeping
incident/sensor functionality as a frontend demo. No backend or account provisioning.

## Implemented
- Full map panel outside the parent ScrollView, so drag/pinch gestures own their touch area.
- Leaflet 1.9.4 bundled locally in react-native-webview (SDK-compatible native module).
- Actual OpenStreetMap street tiles, pan, pinch/double-tap zoom, plus/minus controls.
- Nine fictional geo-positioned markers in Pahang, Penang and Seremban, colour-coded by type.
- Type filters change the actual marker layer and point list, not only the list.
- Region presets, fit-visible-markers button, selected-marker tooltip/native detail card.
- Point details use stable IDs for matching location/name/value rather than a shared dummy record.
- Tap the map or choose its centre to select coordinates; explicit Report Here passes this manual
  place text to the existing demo form. No automatic GPS or location permission.
- Tile failure notice/retry and renderer timeout/reload; no silent claim of offline map coverage.

## Network and provider handling
Only currently viewed HTTPS OSM tiles are fetched. No CDN scripts, geocoder, satellite service,
API key, backend reports or paid service. WebView's ordinary HTTP cache remains enabled;
no prefetch/offline download, forced no-cache or background tile fetch loop.
Stable app User-Agent identifies ECOXENE and links its public repo. OSM attribution is visible
inside the map and outside it in native UI; copyright action opens a fixed URL on explicit tap.
See https://operations.osmfoundation.org/policies/tiles/ . Availability is best-effort.
The viewed area is necessarily sent to the tile provider; disclosed in Map Information.
Leaflet BSD licence and archive provenance are in src/features/map/.

## Boundary
The base map/geographic interaction is real. ALL environmental markers, sensor readings,
air readings and incident statuses are samples. A fictional hotspot is not evidence of an
incident at that location. Selected coordinates are manual, not device GPS.
No new camera/record/AI processing or backend changes. Functional Ver2 flow retained.

## Verification
101 unit/regression tests, TypeScript and lint pass. Eight map cases validate bridge IDs,
coordinate ranges, malformed payload rejection, bundled script syntax, actual controller layer
filters, selected marker messages, viewport commands and manual coordinate selection with a
mock Leaflet implementation. These are not native WebView visual or real tile-network tests.
Android/iOS JS exports and APK build are checked separately. Real phone pan/pinch/tile loading,
network failure, touch targets, attribution and sample detail/form flow remain acceptance checks.
No native screenshot verification is available in this environment. No 100% fidelity claim.

## Delivery
Version 1.3.1 / Android versionCode 8. Artifact ECOXENE-Interactive-Map-Ver3.
A new APK is required because react-native-webview is a new native dependency.
No iOS IPA is produced; iOS JS export is not an installable iOS build.
