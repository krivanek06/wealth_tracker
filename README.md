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
  - `npx cap update`
- Open Android studio
  - `npx capacitor open android`
- In `build.gradle` change
  - `versionCode`
  - `versionName`