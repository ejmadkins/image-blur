
# Project Setup

PROJECT_ID=$(gcloud config get-value project)

REGION=europe-west1
gcloud config set run/region $REGION
gcloud config set run/platform managed
gcloud config set eventarc/location $REGION

gcloud config set project $PROJECT_ID
PROJECT_ID=$(gcloud config get-value project)
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')

# Add eventReciever Role to Default Compute Service Account

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member serviceAccount:$PROJECT_NUMBER-compute@developer.gserviceaccount.com \
    --role roles/eventarc.eventReceiver

# Get the Cloud Storage Service Account

SERVICE_ACCOUNT=$(gsutil kms serviceaccount -p $PROJECT_NUMBER)

# Add IAM Permissions

gcloud projects add-iam-policy-binding $PROJECT_NUMBER \
    --member serviceAccount:$SERVICE_ACCOUNT \
    --role roles/pubsub.publisher

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member serviceAccount:service-$PROJECT_NUMBER@gcp-sa-pubsub.iam.gserviceaccount.com \
  --role roles/iam.serviceAccountTokenCreator

# Create GCS Bucket

BUCKET_NAME=ejmadkins-dev-img-source
gsutil mb -l $REGION gs://$BUCKET_NAME


#
#SERVICE_NAME=image-process
#gcloud run deploy $SERVICE_NAME \
#  --image=gcr.io/cloudrun/hello \
#  --allow-unauthenticated
#
#REGION=europe-west1
#PROJECT_ID=$(gcloud config get-value project)
#PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
#BUCKET_NAME=ejmadkins-dev-img-source
#SERVICE_NAME=image-validate
#TRIGGER_NAME=trigger-gcs-validate
#gcloud eventarc triggers create $TRIGGER_NAME\
#  --destination-run-service=$SERVICE_NAME \
#  --destination-run-region=$REGION \
#  --event-filters="type=google.cloud.storage.object.v1.finalized" \
#  --event-filters="bucket=$BUCKET_NAME" \
#  --service-account=$PROJECT_NUMBER-compute@developer.gserviceaccount.com


# Cloud Functions Deployment

gcloud functions deploy image-validate-gcf \
--gen2 \
--runtime=nodejs16 \
--region=europe-west1 \
--source=. \
--entry-point=imageValidate \
--trigger-event-filters="type=google.cloud.storage.object.v1.finalized" \
--trigger-event-filters="bucket=spooky-image-source" \
--trigger-service-account="eventarc-trigger@ejmadkins-sky-tech-day.iam.gserviceaccount.com"

docker build -t image-validate .
docker tag image-validate europe-west1-docker.pkg.dev/ejmadkins-sky-tech-day/spooky-images/image-validate
docker push europe-west1-docker.pkg.dev/ejmadkins-sky-tech-day/spooky-images/image-validate

docker build -t image-resize .
docker tag image-resize europe-west1-docker.pkg.dev/ejmadkins-sky-tech-day/spooky-images/image-resize
docker push europe-west1-docker.pkg.dev/ejmadkins-sky-tech-day/spooky-images/image-resize

docker build -t image-blur-resize .
docker tag image-blur-resize europe-west1-docker.pkg.dev/ejmadkins-sky-tech-day/spooky-images/image-blur-resize
docker push europe-west1-docker.pkg.dev/ejmadkins-sky-tech-day/spooky-images/image-blur-resize