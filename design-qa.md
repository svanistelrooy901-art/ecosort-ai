# ECOXENE dashboard reference implementation — 30 October 2026

## Source and scope

Client specifically requested the existing native Android dashboard follow the supplied PDF.
References are PDF page 4 (Home Dashboard wireframe) and page 8 (scanner flow/home styling).
Extracted references are in docs/references/. This is a modification to the existing React Native
app, not a new website, Sites prototype or web-only substitute.

## Source comparison / implemented structure

1. Header: client-supplied ECOXENE logo, BM/English switch, landscape greeting and scanner CTA.
2. Environmental Alerts: air/haze panel, official JAS air-quality link and burning-alternatives guide.
   No fabricated air-quality value, warning level or live incident alert.
3. Map View & Location: clearly labelled illustrative map, manual location input, real Maps
   search button, local location-record count and records access. No fake pins/GPS/hotspots.
4. Report an Issue: prominent camera CTA; adjacent copy explains local record vs official complaint.
5. My Reports Summary: genuine saved-record counts, most recent observations, local-only labels,
   empty/loading/storage-error handling and category-guidance access. No invented agency statuses.
6. 3R Hub: plastic/glass/paper guidance, compost/mulch education and external recycling-centre search.
7. Government & NGOs: JAS/SAM/MNS reference section linked to existing action channels; no badges
   or implied partnership, feed, campaign, automatic forwarding or official acknowledgement.
8. Personal Impact: genuine device record count and activity link; no community/carbon/recovery claims.
9. Compact module shortcuts and dashboard bottom navigation replace the old full-page menu list.

## Constraints relative to source

The source shows illustrative real-time air warnings, nearby map pins and pending/completed
agency reports. Those data services are outside the agreed RM400 scope. Their section layout
is retained with honest unavailable/local states and working existing actions. Record storage,
AI logic, credentials, watermark and other screens are unchanged apart from shared Screen's
optional footer/content-style support. No additional permissions, accounts or paid APIs.

## Visual QA

Source images and generated decorative assets inspected. Source code reviewed for section order,
empty/local data states, working routes and explicit external-link actions. Flexible card heights,
wrapping stat/grid rows and minimum touch targets used. Native system chrome is not recreated.

Native rendered screenshot/physical-device comparison is not available in this environment.
The Product Design web preview workflow does not verify a native Android screen, and an earlier
preview access policy denial has not been bypassed. Compilation and APK permission checks are
separate evidence and must not be called visual verification. Device visual acceptance is pending:
320–430 px widths, large text, BM/English, empty/populated records, external links and bottom nav.

final result: blocked (native visual comparison only; implementation/build checks reported separately)
