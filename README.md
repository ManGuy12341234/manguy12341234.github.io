# E.V. Suit Interface (Android + Chrome PWA)

Files: `index.html`, `sw.js`, `manifest.webmanifest`, `icon-192.png`, `icon-512.png`. Keep them in the same folder.

## A. PWA deploy (any static HTTPS host)
1. Upload the folder to Netlify, Cloudflare Pages, GitHub Pages, Vercel (static) or any HTTPS host. HTTPS is required for camera, mic, service worker and install.
2. On the phone, open the URL in Chrome (v110+) **while online** and tap ENGAGE once. This lets the service worker cache the shell, the MediaPipe WASM and the detection model for offline use.
3. Chrome menu -> **Install app** (or use the in-app INSTALL SUIT INTERFACE button on the boot screen). It then launches fullscreen from the home screen.
4. Allow Camera and Microphone when asked. Compass and battery need no prompt.
5. After updating files, bump `V` in `sw.js` (e.g. `ev-v2`) so phones pick up the change.

Voice: say "E.V., flashlight on", "E.V., zoom 4x", "E.V., holo view", "E.V., intel", "E.V., tactical off", "E.V., scan", "E.V., spider sense off", "E.V., battery", "E.V., settings".

**Intel (AI):** aim the red lock reticle at something (or just point the camera) and say "E.V., intel" or tap INTEL. A scanner sweeps the target, then a holographic dossier types out on the right: name, class, three facts and a one-line verdict. E.V. reads the highlights aloud and you can ask follow-ups ("how much does it cost?").

**Tactical data:** every target the detector sees gets an estimated range, compass bearing and a CLOSING / RECEDING tag, and anything approaching you turns red. Range is an estimate from the typical size of the object, so treat it as approximate. Toggle with the button or "E.V., tactical off".

**Scan pulse:** a ring, one buzz per detected object and a spoken summary. Spider-Sense buzzes the phone harder and longer the more movement or the bigger the object in view; keep Haptics on in Settings.

## B. Optional APK via Capacitor (sideload, no Play Store)
```
mkdir ev-apk && cd ev-apk
npm init -y
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "E.V." com.example.ev --web-dir=www
mkdir www && cp ../ev-suit/{index.html,sw.js,manifest.webmanifest,icon-*.png} www/
npx cap add android
```
Add inside `<manifest>` in `android/app/src/main/AndroidManifest.xml`:
```
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```
Then `npx cap sync android`, `npx cap open android`, and in Android Studio choose **Build -> Build Bundle(s)/APK(s) -> Build APK(s)**. Copy `app/build/outputs/apk/debug/app-debug.apk` to the phone (or `adb install app-debug.apk`) and allow installs from unknown sources.

**Caveat:** Android WebView (which Capacitor uses) does not support `webkitSpeechRecognition`, so the "E.V." wake phrase will not work in the APK without a native speech plugin such as `@capacitor-community/speech-recognition`. The Chrome PWA route is the one that supports voice as written. Also, the app does not currently use geolocation; the location permission is only there as requested.

## C. APK via PWABuilder (recommended, free, no Play Store account)
Runs on Chrome itself (a Trusted Web Activity), so voice keeps working, unlike the Capacitor route. For a fullscreen app with no address bar, the site must live at the root of `yourusername.github.io` and serve `/.well-known/assetlinks.json` (plus an empty `.nojekyll` file so GitHub Pages serves dot-folders). Package it at pwabuilder.com -> Package for stores -> Android, with a new signing key, then sideload the signed APK. Keep the keystore: you need it to update the APK later.

## D. AI brain (Google Gemini)
The Gemini API key is built into `index.html` (the `GKEY` constant near the top of the script), so there is no key box in Settings. E.V. uses `gemini-flash-latest`.

**Important:** because the key is inside the page, anyone who can open your site can read it. Before you put this on a public host, restrict the key in Google AI Studio / Google Cloud Console (API restrictions: Generative Language API only; application restriction: your site's address) and set a spending cap. If it ever leaks, delete it there and paste a new one into `GKEY`.

Say "E.V., what is ..." for questions, or "E.V., tell me what I'm looking at" to send the camera view with the question.
