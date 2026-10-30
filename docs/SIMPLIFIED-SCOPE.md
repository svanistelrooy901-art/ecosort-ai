# ECOXENE — agreed RM400 simplified academic prototype

Owner approved the reduced scope on 30 October 2026 after the full six-module spec exceeded
budget. RM400 is treated as the total, including the original RM200. This is the reduced
implementation scope, not a claim that the full client specification is delivered.

## Included

1. Home dashboard: navigation and counts of saved records on this device.
2. Environmental scanner: camera/gallery, JPEG review, Workers AI adapter, six issue categories,
   safe unknown/uncertain fallback, user confirmation and manual correction. Manual no-AI path.
3. Records & Locations: local records, category filter, deletion, manual place text and Google Maps
   search links. No embedded live map or automatic GPS.
4. Solution Advisor: bilingual curated guidance for the selected category; not a chatbot or
   personalised live location/air-quality recommendation.
5. Action Channels: suggested authority by category and official DOE/SAM/MNS reference links;
   no automatic forwarding, claim of partnership, agency receipt or status sync.
6. Activity Summary: saved-record totals, category counts, records with locations and AI-accepted
   versus user-selected categories. These are not total scans, verified incidents or recovery metrics.

Additional included support: BM/English UI and education, Android APK, error/retry handling,
secure demo configuration and persistent demo watermark until owner-approved paid handover.
All data presentation starts empty; no seeded incident or agency statistics.

## Explicit exclusions

Accounts/authentication, admin portal, cloud database, photo archive, crowdsourcing,
agency integration, satellite hotspots, live air quality, push alerts, pickup scheduling,
rewards, campaign management, carbon estimates, recovery verification and iOS distribution.

## Live AI dependency

Adapter and fail-closed configuration are prepared. Actual scanning still requires owner-approved
Cloudflare deployment, Workers AI access/licence and a secret demo code. This sprint never
activates billing, accepts a model licence or deploys a Worker. No live accuracy claim is made.

## Verification boundaries

Automated tests cover schema rejection, uncertainty/correction, auth, rate limiting, timeouts,
bilingual request/response contracts, durable local storage, concurrent writes, corruption,
failed writes, deletion/counters and external Maps query encoding. Model calls are mocked.
Physical-device capture, persistence across real app restart, visual QA and live inference remain
separate acceptance checks. See TESTING.md. Main and the original draft branch remain unmerged.
