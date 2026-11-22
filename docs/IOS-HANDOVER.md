# ECOXENE iOS handover — no-watermark version

The client will manage Apple Developer membership, signing, TestFlight upload and
physical iPhone testing. This branch prepares the same no-watermark 1.3.3 source
as Android Ver5 for an iOS store-distribution build. No IPA has been generated yet.

## Required before a signed IPA can be built

- Client-controlled Expo/EAS account and project with sufficient build allowance.
- Active Apple Developer Program membership with permission to create or use this
  app's distribution certificate and App Store provisioning profile.
- Client confirmation of the final bundle identifier. The configured initial value
  is `space.digitalsambal.ecosort`, matching the Android package. If an Apple app
  already exists, use that app's exact identifier and a new build number instead.
- Credentials configured through EAS's secure Apple/account flow or approved
  credential management. Never put Apple passwords, OTPs, certificates, private
  keys or API keys into this repository or chat.

Signing is a build prerequisite for the requested TestFlight-compatible IPA.
Uploading to TestFlight later does not add missing signing to an arbitrary IPA.

## Client-side build steps

Clone this repository and check out `build/ecoxene-ios-handover`. Use Node 24 LTS.
From the project root:

```sh
npm ci
npx eas-cli@latest login
npx eas-cli@latest whoami
```

Confirm the client owns or has appropriate access to the selected Expo project.
After reviewing the final bundle identifier, link/create the client-controlled
Expo project using:

```sh
npx eas-cli@latest init
```

Commit the resulting project association only after verifying the owner/project.
Check the client's current EAS build quota and billing before requesting a build.
Do not enable a paid service without their approval.

Once Apple signing is available, request the signed store-distribution build:

```sh
npx eas-cli@latest build --platform ios --profile ios-testflight
```

Complete Apple authentication and signing prompts directly in the secure EAS flow.
Download the resulting `.ipa` only when the build finishes successfully. The build
profile uses store distribution and explicitly disables simulator output. It does
not automatically submit or publish the app.

The current initial iOS build number is `1`, with app version `1.3.3`. Increase
`ios.buildNumber` before another upload of the same app version, using a number
higher than any build already uploaded to App Store Connect.

## TestFlight is managed by the client

The client must create/select the matching app in App Store Connect, upload the
signed IPA using their approved submission process, complete required metadata
and declarations, wait for processing and complete any required beta review.
This handover does not register an Apple app or promise immediate tester access.

## Application configuration on the iPhone

Use Profile > AI & storage settings to enter the existing HTTPS Worker origin:

`https://ecoxene-api.svanistelrooy901.workers.dev`

Enter the project DEMO_ACCESS_CODE provided separately by its owner. Do not enter
a Cloudflare API token in the app. No AI credential is embedded in the IPA.

Review camera/gallery permissions, photo preparation, successful and uncertain
AI results, cancellation/timeouts, local save/reload, map gestures and all demo
labels on an actual iPhone. The floating Digital Sambal watermark is disabled.
An iOS JavaScript export only verifies bundling; it is not native compilation,
Apple signing, an IPA, or completed iPhone testing.

## Current scope and blocker

Prepared: iOS bundle identifier, initial build number, no-watermark source and
the `ios-testflight` EAS build profile.

Verified locally: resolved Expo app configuration, iOS JavaScript export,
TypeScript, lint and 145 existing automated tests. These checks have not compiled
or signed a native iOS application. The current build session is not logged in
to Expo/EAS and has no client-configured signing access.

Blocked: a signed device IPA until client-controlled EAS access and Apple signing
assets are configured. No certificate search, unsigned IPA workaround, simulator
archive, TestFlight submission, paid activation or production merge is part of
this preparation.

Official references:

- https://docs.expo.dev/build/setup/
- https://docs.expo.dev/build-reference/ios-builds/
- https://docs.expo.dev/app-signing/managed-credentials/
- https://docs.expo.dev/submit/ios/
