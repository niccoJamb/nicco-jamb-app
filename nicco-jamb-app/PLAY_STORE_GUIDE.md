# Publishing the Nicco JAMB Practice App to the Google Play Store

> **Honest note up front:** I'm a browser-based code assistant. I can prepare
> and configure 100% of your source code (already done ✅), but I **cannot
> compile the binary or upload it to Google Play for you.** Producing the
> signed `.aab` and submitting it requires the Android toolchain and your
> private signing keystore + Play Console account — secrets that must only ever
> live with you. This guide is the exact, complete path from where you are now
> to "Live on Play Store."

There are two parts:
1. **Build the app** → produce a signed `.aab` (Android App Bundle).
2. **Publish it** → upload that `.aab` to the Google Play Console.

---

## PART 1 — Build the signed `.aab`

Your repo is already configured (`capacitor.config.ts`, a GitHub Actions
workflow, and `ANDROID_BUILD.md`). Pick the easiest path for you:

### Easiest: GitHub Actions (no Android tools on your computer)
1. Push this repo to GitHub.
2. Create a signing keystore on any machine with Java's `keytool`:
   ```bash
   keytool -genkey -v -keystore nicco-release.keystore \
     -alias nicco -keyalg RSA -keysize 2048 -validity 10000
   ```
   Keep this file + both passwords **forever** — you need the same keystore
   for every future update.
3. Base64-encode it and add these repo secrets
   (**Settings → Secrets and variables → Actions**):
   - `KEYSTORE_BASE64` (the base64 of the keystore file)
   - `KEYSTORE_PASSWORD`
   - `KEY_ALIAS` → `nicco`
   - `KEY_PASSWORD`
4. **Actions tab → "Android Build" → Run workflow.**
5. When it finishes (~10 min), open the run → **Artifacts** → download
   `nicco-jamb-aab`. That file is `app-release.aab`.

> Prefer building on your own computer instead? Follow **Option A** in
> `ANDROID_BUILD.md`. Want a no-tooling shortcut? **Option C (PWABuilder)**
> can also generate a `.aab` from your deployed site.

---

## PART 2 — Publish on the Google Play Console

### 1. Create a Google Play Developer account (one-time)
- Go to https://play.google.com/console
- Pay the **one-time $25 USD** registration fee.
- Complete identity verification (Google now requires a valid ID; for a
  personal account this can take 1–2 days to approve).

### 2. Create the app
- Play Console → **Create app**.
- App name: **Nicco JAMB Practice App**
- Default language, App or Game: **App**, Free or Paid: **Free**
- Accept the declarations → **Create**.

### 3. Fill in the required "Set up your app" checklist
Play won't let you publish until these are green:
- **App access** – if login is required, provide test credentials so Google
  can review the app.
- **Ads** – declare whether the app shows ads.
- **Content rating** – fill the questionnaire (education app → usually rated
  Everyone).
- **Target audience** – select age groups. (Since this is a study app, be
  careful here — see "Children" note below.)
- **Data safety** – declare what data you collect. You collect **email +
  account data**; link your Privacy Policy URL:
  `https://niccojamb.centerkross.com/privacy`
- **Privacy Policy** – paste that same URL.
- **Government apps / financial / health** – answer No as applicable.

### 4. Store listing assets you need to prepare
| Asset | Spec |
|---|---|
| App icon | 512×512 PNG (32-bit, with alpha) |
| Feature graphic | 1024×500 PNG/JPG |
| Phone screenshots | at least 2 (e.g. 1080×1920) |
| Short description | up to 80 characters |
| Full description | up to 4000 characters |

> Tip: take screenshots of your live app's home, quiz, leaderboard, and
> results screens — those make great store images.

### 5. Upload the `.aab` and create a release
- Left menu → **Production** (or start with **Internal testing** first — wise).
- **Create new release.**
- Google will offer **Play App Signing** — accept it (recommended; Google
  manages the final signing key, your upload key stays safe).
- Upload `app-release.aab`.
- Add release notes → **Save → Review release → Start rollout to Production.**

### 6. Review & go live
- Google reviews new apps/developers. First review typically takes a **few
  hours to ~7 days**.
- Once approved, your app appears on Play. You'll get an email confirmation.

---

## Important things to double-check before submitting

- **Package ID** is `com.nicco.jambpractice` (set in `capacitor.config.ts`) —
  this is permanent and can never be changed after first publish.
- **Version** must increase on every update: bump `versionCode` (1 → 2 → 3…)
  and `versionName` in `android/app/build.gradle`.
- **Privacy Policy** must be reachable at the URL you provide — yours is at
  `/privacy` and includes the Account & Data Deletion section ✅, which Google
  now requires.
- **Account deletion** – Google requires a way to request data deletion. Your
  Privacy Policy covers this; even better is an in-app "Delete account" button
  (a good next step).
- **Children / families** – JAMB is for older students, but if you target
  under-13s you must complete Google's Families policy. Easiest is to set the
  target audience to 13+.

---

## TL;DR
1. Run the GitHub Actions "Android Build" → download `app-release.aab`.
2. Create a Play Console account ($25 one-time).
3. Create the app, complete the content/data-safety checklist, add store
   graphics, link your `/privacy` URL.
4. Upload the `.aab`, accept Play App Signing, roll out to Production.
5. Wait for Google's review → live.

I've prepared every piece of code/config for you. The compile + upload steps
above are the parts only you can do, because they need your keystore and your
Play account.
