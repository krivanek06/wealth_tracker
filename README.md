## Overview
The purpose of the application is to have on system for logging personal incomes, expenses and investments. In the desktop version a person can see multiple chart analytics on his spending/investing, however also a mobile version is available. Links are following:
- https://spendmindful.com/
- https://play.google.com/store/apps/details?id=spendmindful.com

## Build for Android 
- Build the app 
  - `ng build`
- First time build (Android)
  - `npx cap add android`
  - Add `rgcfaIncludeGoogle = true` into `variable.grapdle` under `ext`
  - Add `google-services.json` related to the platform from firebase
- Copy new code into native projects
  - `npx cap copy`
  - `npx cap sync android`
  - `npx cap update`
- Open Android studio
  - `npx capacitor open android`
- In `build.gradle` change
  - `versionCode`
  - `versionName`
- Commands
  - Fingerprint Debug: `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android`
  - Fingerprint Release: `keytool -keystore ~/Documents/generated_keys/android_signature -list -v`
- Release version (Android)
  - In `build.gradle` increase `versionCode` and `versionName`
  - `build` -> `Generate Signed Bundle` -> `Android App Bundle` -> choose fingerprint from pc -> `release version` -> upload `.aab` file to Google Play
