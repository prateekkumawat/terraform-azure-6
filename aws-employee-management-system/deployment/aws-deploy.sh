#!/usr/bin/env bash
# AWS Employee Management System - Bash Deployment Script
# Usage: ./aws-deploy.sh [region]

set -e

REGION="${1:-us-east-1}"
TABLE_NAME="Employees"
BUCKET_PREFIX="employee-photos-app"

echo "==============================================="
echo "   AWS Employee Management System Deployer"
echo "==============================================="

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
BUCKET_NAME="${BUCKET_PREFIX}-${ACCOUNT_ID}"

echo "[1/5] AWS Account: ${ACCOUNT_ID} | Region: ${REGION}"

# 1. DynamoDB Table
echo "[2/5] Provisioning DynamoDB Table '${TABLE_NAME}'..."
TABLE_EXISTS=$(aws dynamodb list-tables --region "${REGION}" --query "TableNames[?@=='${TABLE_NAME}'] | [0]" --output text)
if [ "${TABLE_EXISTS}" == "${TABLE_NAME}" ]; then
  echo "   -> Table '${TABLE_NAME}' already exists."
else
  aws dynamodb create-table \
    --table-name "${TABLE_NAME}" \
    --attribute-definitions AttributeName=empId,AttributeType=S \
    --key-schema AttributeName=empId,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region "${REGION}" > /dev/null
  echo "   -> Created DynamoDB Table '${TABLE_NAME}'"
fi

# 2. S3 Bucket
echo "[3/5] Provisioning S3 Bucket '${BUCKET_NAME}'..."
if aws s3api head-bucket --bucket "${BUCKET_NAME}" 2>/dev/null; then
  echo "   -> S3 Bucket '${BUCKET_NAME}' already exists."
else
  if [ "${REGION}" == "us-east-1" ]; then
    aws s3api create-bucket --bucket "${BUCKET_NAME}" --region "${REGION}" > /dev/null
  else
    aws s3api create-bucket --bucket "${BUCKET_NAME}" --region "${REGION}" --create-bucket-configuration LocationConstraint="${REGION}" > /dev/null
  fi
  echo "   -> Created S3 Bucket '${BUCKET_NAME}'"
fi

# Set CORS
aws s3api put-bucket-cors --bucket "${BUCKET_NAME}" --cors-configuration '{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
      "AllowedOrigins": ["*"],
      "ExposeHeaders": ["ETag"]
    }
  ]
}'
echo "   -> Configured S3 CORS policy"

# 3. Cognito User Pool
echo "[4/5] Provisioning Cognito User Pool..."
USER_POOL_ID=$(aws cognito-idp list-user-pools --max-results 10 --query "UserPools[?Name=='EmployeeUserPool'].Id | [0]" --output text)
if [ "${USER_POOL_ID}" == "None" ] || [ -z "${USER_POOL_ID}" ]; then
  USER_POOL_ID=$(aws cognito-idp create-user-pool --pool-name EmployeeUserPool --query UserPool.Id --output text)
  echo "   -> Created User Pool ID: ${USER_POOL_ID}"
else
  echo "   -> User Pool already exists: ${USER_POOL_ID}"
fi

CLIENT_ID=$(aws cognito-idp list-user-pool-clients --user-pool-id "${USER_POOL_ID}" --query "UserPoolClients[?ClientName=='EmployeeAppClient'].ClientId | [0]" --output text)
if [ "${CLIENT_ID}" == "None" ] || [ -z "${CLIENT_ID}" ]; then
  CLIENT_ID=$(aws cognito-idp create-user-pool-client --user-pool-id "${USER_POOL_ID}" --client-name EmployeeAppClient --no-generate-secret --query UserPoolClient.ClientId --output text)
  echo "   -> Created App Client ID: ${CLIENT_ID}"
else
  echo "   -> App Client already exists: ${CLIENT_ID}"
fi

echo "==============================================="
echo " Deployment Complete!"
echo " S3 Bucket Name  : ${BUCKET_NAME}"
echo " User Pool ID    : ${USER_POOL_ID}"
echo " App Client ID   : ${CLIENT_ID}"
echo "==============================================="
