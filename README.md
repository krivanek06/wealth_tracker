# Deployment
References
- Build client side: https://www.youtube.com/watch?v=eajxBaSEAoY&ab_channel=ScriptBytes
  
## Deploying Frontend

Build docker file:
- `docker build -t spend_mindful_client .`
  
Run docker file locally:
- `docker run -d -p 5001:8080 spend_mindful_client`

## Deploying Backend

```YAML
gcloud builds submit --tag gcr.io/wealth-tracker-364707/spend_mindful_graphql

gcloud run deploy --image gcr.io/wealth-tracker-364707/spend_mindful_graphql --platform managed --max-instances=1 --port=8080
```

## Additional Commands

- See current project:
  - `gcloud config get-value project`
- List all projects:
  - `gcloud projects list`
- Set new project as active:
  - `gcloud config set project XXX`
- Run `cloudbuild.yaml`:
  - `gcloud builds submit`
- Run docker:
  - `docker run -p80:3000 wealth_tracker_api`
