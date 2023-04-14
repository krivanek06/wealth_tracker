# Deployment

The `client` and the `server` part of the application are deployed into GCP via Dockerfile to the cloud-run service.
To deploy ay of the services, navigate to the folder and run `gcloud builds submit`.
Each folder contains a `cloudbuild.yaml` that takes care of the build.

  
As an important side-note, please verify which project you use from GCP with the following commands:
- See current project:
  - `gcloud config get-value project`
- List all projects:
  - `gcloud projects list`
- Set new project as active:
  - `gcloud config set project XXX`

