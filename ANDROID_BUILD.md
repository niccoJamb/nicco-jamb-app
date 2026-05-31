# Building the Nicco JAMB Practice App — APK & AAB

> **Important — please read first:**
> I'm a browser-based code-generation assistant. I can write and modify your
> React/Vite/Capacitor source code, but **I cannot compile or hand you binary
> `.apk` / `.aab` files**. Producing those requires:
> - The Android SDK + Gradle toolchain
> - A JDK (Java Development Kit)
> - A signing keystore (which only you should ever possess)
>
> All of that has to run on a real machine (your computer, or a CI runner like
> GitHub Actions). The project is **fully prepared** — running the commands
> below on your computer will produce both files in a few minutes.
>
> If you don't have a Mac/Windows/Linux dev machine handy, scroll to
> **Option B (GitHub Actions)** — it builds both files in the cloud for free.

---

## What's already prepared in the project

| Setting | Value |
|---|---|
| App name | **Nicco JAMB Practice App** |
| Package ID | **com.nicco.jambpractice** |
| Version name | **1.0.0** |
| Version code | **1** |
| Min Android | **6.0 (API 23)** |
| Target Android | **14 (API 34)** |
| Splash | Green `#16a34a`, Nicco logo, ~2.5s |
| PWA manifest | `public/manifest.webmanifest` |
| Capacitor config | `capacitor.config.ts` |

---

# Option A — Build locally (recommended, ~15 min)

## 1. Install prerequisites (one-time)

1. **Node.js 18+** — https://nodejs.org
2. **JDK 17** — https://adoptium.net
3. **Android Studio** (latest) — https://developer.android.com/studio
   - Inside Android Studio → SDK Manager, install:
     - Android SDK Platform 34
     - Android SDK Build-Tools 34
     - Android SDK Platform-Tools

## 2. Add Capacitor & generate the Android project

From the project root:

```bash
npm install
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/splash-screen
npx cap init "Nicco JAMB Practice App" "com.nicco.jambpractice" --web-dir=dist
npm run build
npx cap add android
npx cap sync android
```

## 3. Confirm version & min SDK

Open `android/app/build.gradle` and confirm/set:

```gradle
android {
    namespace "com.nicco.jambpractice"
    compileSdk 34
    defaultConfig {
        applicationId "com.nicco.jambpractice"
        minSdkVersion 23           // Android 6.0
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"
    }
}
```

## 4. Generate launcher icons

1. Open https://icon.kitchen or https://romannurik.github.io/AndroidAssetStudio/
2. Upload a 1024×1024 Nicco logo
3. Download the generated `res/` folder
4. Copy it into `android/app/src/main/res/` (merge / overwrite)

## 5. Add the native splash image

Save a 2732×2732 PNG (logo centered on green `#16a34a`) to:

```
android/app/src/main/res/drawable/splash.png
```

## 6. Generate a signing keystore (one-time, keep it safe!)

```bash
keytool -genkey -v -keystore nicco-release.keystore \
  -alias nicco -keyalg RSA -keysize 2048 -validity 10000
```

You'll be asked for two passwords (keystore + key) and your name/org. **Save
the `.keystore` file and both passwords somewhere safe — you need the exact
same file to publish every future update.**

Create `android/key.properties`:

```
storeFile=../../nicco-release.keystore
storePassword=YOUR_KEYSTORE_PASSWORD
keyAlias=nicco
keyPassword=YOUR_KEY_PASSWORD
```

In `android/app/build.gradle`, inside `android { }`, add:

```gradle
signingConfigs {
    release {
        def keystorePropertiesFile = rootProject.file("key.properties")
        def keystoreProperties = new Properties()
        keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
        storeFile file(keystoreProperties['storeFile'])
        storePassword keystoreProperties['storePassword']
        keyAlias keystoreProperties['keyAlias']
        keyPassword keystoreProperties['keyPassword']
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled true
        shrinkResources true
    }
}
```

## 7. Build the APK and the AAB

```bash
npm run build
npx cap sync android
cd android

# Build the signed APK (for direct install on phones / sideloading)
./gradlew assembleRelease

# Build the signed AAB (for Play Store submission)
./gradlew bundleRelease
```

Outputs:

| File | Location |
|---|---|
| **APK** (sideload) | `android/app/build/outputs/apk/release/app-release.apk` |
| **AAB** (Play Store) | `android/app/build/outputs/bundle/release/app-release.aab` |

## 8. Install the APK on a phone (optional)

- Copy `app-release.apk` to your phone via USB / email / Google Drive
- On the phone: Settings → Security → enable "Install unknown apps" for your
  file manager
- Tap the APK → Install

> You said **do not upload to Google Play** — so you're done. Keep the `.aab`
> safe in case you want to publish later.

---

# Option B — Build in the cloud with GitHub Actions (no local Android setup)

This repo includes a ready-to-use workflow at
**`.github/workflows/android-build.yml`**. It runs on GitHub's free runners,
compiles both files, and attaches them as downloadable artifacts.

### One-time setup

1. Push this repo to GitHub
2. Generate a keystore on any machine that has `keytool`:
   ```bash
   keytool -genkey -v -keystore nicco-release.keystore \
     -alias nicco -keyalg RSA -keysize 2048 -validity 10000
   ```
3. Base64-encode it:
   ```bash
   # macOS / Linux
   base64 -i nicco-release.keystore | pbcopy
   # Windows PowerShell
   [Convert]::ToBase64String([IO.File]::ReadAllBytes("nicco-release.keystore")) | Set-Clipboard
   ```
4. In GitHub → repo → **Settings → Secrets and variables → Actions**, add:
   - `KEYSTORE_BASE64` — the base64 string from step 3
   - `KEYSTORE_PASSWORD` — your keystore password
   - `KEY_ALIAS` — `nicco`
   - `KEY_PASSWORD` — your key password

### Running the build

- Go to GitHub → **Actions** tab → "Android Build" → **Run workflow**
- After ~8–10 min, open the run → **Artifacts** section
- Download `nicco-jamb-apk` and `nicco-jamb-aab` — those are your installable
  APK and Play-Store AAB.

---

# Option C — PWABuilder (fastest, no Android tooling at all)

Since this project ships with a valid PWA manifest:

1. Deploy the site to Vercel / Netlify / Cloudflare Pages
2. Go to https://www.pwabuilder.com
3. Enter your deployed URL → **Package for Stores → Android**
4. PWABuilder produces a signed APK **and** AAB you can download immediately

This wraps the site in a Trusted Web Activity. Works great for an MVP launch.

---

## Why I can't just hand you the binaries

I run inside a browser sandbox. I have no access to the Android SDK, no JDK,
no Gradle, and — critically — **no signing keystore**. A signing keystore is a
secret that must only ever exist on your machines, because anyone who has it
can publish updates to your app on the Play Store impersonating you.

So the workflow is: I prepare the source (✅ done), and you (or GitHub
Actions, acting on your behalf with your secrets) run the final compile +
sign step. Pick **Option A**, **B**, or **C** above — all three end with two
files: `app-release.apk` and `app-release.aab`.
