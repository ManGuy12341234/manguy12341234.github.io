# E.V. Suit Interface (Android + Chrome PWA)

Files: `index.html`, `sw.js`, `manifest.webmanifest`, `icon-192.png`, `icon-512.png`. Keep them in the same folder.

## A. PWA deploy (any static HTTPS host)
1. Upload the folder to Netlify, Cloudflare Pages, GitHub Pages, Vercel (static) or any HTTPS host. HTTPS is required for camera, mic, service worker and install.
2. On the phone, open the URL in Chrome (v110+) **while online** and tap ENGAGE once. This lets the service worker cache the shell, the MediaPipe WASM and the detection model for offline use.
3. Chrome menu -> **Install app** (or use the in-app INSTALL SUIT INTERFACE button on the boot screen). It then launches fullscreen from the home screen.
4. Allow Camera and Microphone when asked. Compass and battery need no prompt.
5. After updating files, bump `V` in `sw.js` (e.g. `ev-v2`) so phones pick up the change.

Voice (wake phrase "E.V."). New: "HUD test" (systems-check panel + sweep), "target" (marks what is in the reticle), "drone strike" (simulated, harmless), "help". Also: say "E.V., flashlight on", "E.V., zoom 4x", "E.V., holo view", "E.V., intel", "E.V., tactical off", "E.V., scan", "E.V., spider sense off", "E.V., battery", "E.V., settings".

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

## D. AI brain (free, runs on the phone, no key)
E.V. thinks with a free open model that runs inside the phone's browser (WebLLM + WebGPU). There is no API key, no account, no quota and no cloud AI: your questions are not sent to any AI service.

- **First launch:** after ENGAGE, E.V. downloads the model once and keeps it in the browser (Balanced about 0.7 GB, Fast about 0.25 GB, Best about 1.7 GB). Use Wi-Fi. If you are on mobile data and it is not saved yet, E.V. pauses and waits for you to tap Settings -> LOAD BRAIN. After the first download it works offline.
- **Needs WebGPU:** Chrome 121+ on Android 12+ with a Qualcomm or ARM GPU. Without it, E.V. runs in basic mode: time, math, what the detector sees, and Wikipedia summaries (basic mode sends the question text to Wikipedia).
- **Brain size (Settings):** Fast = SmolLM2 360M, Balanced = Llama 3.2 1B (default), Best = Llama 3.2 3B (needs a strong phone). If the phone runs out of memory, pick Fast. TEST BRAIN shows whether WebGPU works and which model is loaded.
- **Compared with the old Gemini brain:** a small on-device model knows less and can be wrong, and it cannot see pictures. Camera questions use the object detector's list of what it sees (80 common categories), and Intel writes its dossier from the detected object's name. Time, date and math are answered instantly without the model.
- E.V. pauses object detection while the brain is thinking so the GPU is free for it, and speaks each sentence as soon as it is written. Tap E.V.'s text box to stop her.
- The model library is loaded from jsDelivr and the model files from Hugging Face, so the first run needs internet; the service worker and the browser cache keep them afterwards.

Say "E.V., what is ..." for questions, or "E.V., what am I looking at" for a camera question.


## E. CPU brain
Settings -> Brain engine: **Auto** uses the phone GPU (WebGPU) when it works and falls back to a CPU brain (llama.cpp WASM via wllama, SmolLM2 360M, about 390 MB first download) when it does not, or after a GPU error. **CPU only** forces it. CPU is slower because GitHub Pages cannot enable multi-threading.

## F. Voice and Note 20 5G
The wake word accepts anything that sounds like "E.V." (ev, eve, evie, eevee, ee vee, ivy...) and checks the 3 best guesses Chrome returns. Chrome's speech recognition needs an internet connection. For best results on a Samsung: Settings -> Apps -> Chrome -> Battery -> Unrestricted, and allow the microphone for the site.

## G. Better brain
Settings -> Brain engine -> **Cloud (my API key)**: paste a free key from aistudio.google.com (Gemini) or console.groq.com (Groq). Gemini can also see the camera frame for "what am I looking at". Your questions are sent to that service. The **CPU model** box accepts any Hugging Face GGUF as `owner/repo:file.gguf`; the default CPU brain is now Qwen2.5 1.5B (about 1.1 GB).

## H. Wake words
Besides E.V., E.V. also wakes on sound-alikes at the start of a phrase (easy, tv, ez, ebay, ivy...). Anything else she mishears: Settings -> Extra wake words (comma separated). The text box shows what Chrome heard.
