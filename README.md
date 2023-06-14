## Overview
The purpose of the application is to have on system for logging personal incomes, expenses and investments. In the desktop version a person can see multiple chart analytics on his spending/investing, however also a mobile version is available. Links are following:
- https://spendmindful.com/
- https://play.google.com/store/apps/details?id=spendmindful.com

## Images
<img width="400" alt="Screenshot 2023-06-14 at 21 09 44" src="https://github.com/krivanek06/wealth_tracker/assets/47821225/237ec46b-5f68-4301-8318-ed039c06c475">
<img width="400" alt="Screenshot 2023-06-14 at 21 09 59" src="https://github.com/krivanek06/wealth_tracker/assets/47821225/67fcd899-2987-47f0-8d54-dbe8330c9b14">
<img width="725" alt="Screenshot 2023-06-14 at 21 09 54" src="https://github.com/krivanek06/wealth_tracker/assets/47821225/4bcc7152-6939-4c3d-800a-538ae1c74539">
<img width="400" alt="Screenshot 2023-06-14 at 21 10 08" src="https://github.com/krivanek06/wealth_tracker/assets/47821225/d17704c3-7842-49cd-81c3-1e8312e9baa0">
<img width="400" alt="Screenshot 2023-06-14 at 21 10 13" src="https://github.com/krivanek06/wealth_tracker/assets/47821225/d825be24-69db-45cd-970b-bab6139ebf68">


## GCP Deployment
The `client` and the `server` part of the application are deployed into GCP via Dockerfile to the cloud-run service. 
Each folder contains a `cloudbuild.yaml` that takes care of the build.
To deploy the app to GCP, follows these steps:
- See current project:
  - `gcloud config get-value project`
- List all projects:
  - `gcloud projects list`
- Set new project as active:
  - `gcloud config set project XXX`
- Deploy to GCP by:
  - `gcloud builds submit`

## Build for Android 
- Build the app 
  - `ng build`
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
