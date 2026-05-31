# JAMB Practice App

The JAMB Practice App is a modern CBT preparation tool built for Nigerian students preparing for the UTME. It delivers AI-powered explanations, personalized score analytics, and optional WhatsApp performance updates.

---

## 📚 Features
- JAMB-style CBT questions
- AI-generated explanations
- Score tracking & analytics dashboard
- WhatsApp score notifications
- Fast, responsive UI
- Offline-friendly architecture

---

## 🛠️ Tech Stack
**Frontend**
- TypeScript
- Vite
- TailwindCSS
- Capacitor

**Backend**
- Functions (serverless)
- Storage
- SQL database

**DevOps**
- GitHub Actions (Android build pipeline)
- Android signing + AAB generation
- Play Store deployment workflow

---

## 📱 Android Build Instructions
This project includes a complete Android build pipeline.

- Build workflow: `.github/workflows/android-build.yml`
- Output artifacts:
  - `app-release.aab` (Play Store)
  - `app-release.apk` (testing)

See **ANDROID_BUILD.md** for full build instructions.

---

## 🚀 Publishing to Google Play
A complete step-by-step publishing guide is included in:

- **PLAY_STORE_GUIDE.md**

This covers:
- Creating your Play Console app
- Uploading the AAB
- Filling Data Safety
- Adding screenshots & descriptions
- Submitting for review

---

## 📄 License
Proprietary — All rights reserved. 2026
