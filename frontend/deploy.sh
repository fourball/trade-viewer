#!/bin/bash

# デプロイスクリプト
# S3バケット名を設定
export S3_BUCKET_NAME=trade-viewer-sqz

# CloudFront Distribution IDを確認
if [ -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
  echo "Error: CLOUDFRONT_DISTRIBUTION_ID is not set"
  echo "Please run: export CLOUDFRONT_DISTRIBUTION_ID=your-distribution-id"
  exit 1
fi

# デプロイ実行
echo "Deploying to S3 bucket: $S3_BUCKET_NAME"
npm run deploy