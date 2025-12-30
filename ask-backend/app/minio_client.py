import os
import boto3

s3 = boto3.client(
    "s3",
    endpoint_url=f"https://{os.getenv('MINIO_ENDPOINT')}",
    aws_access_key_id=os.getenv("MINIO_ACCESS_KEY"),
    aws_secret_access_key=os.getenv("MINIO_SECRET_KEY")
)

BUCKET_NAME=os.getenv("MINIO_BUCKET_NAME")