# AWS Employee Management System - PowerShell Deployment Script
# Prerequisites: AWS CLI configured with valid credentials (aws configure)

param (
    [string]$Region = "us-east-1",
    [string]$TableName = "Employees",
    [string]$BucketPrefix = "employee-photos-app"
)

$ErrorActionPreference = "Stop"

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "   AWS Employee Management System Deployer" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

# Get AWS Account ID
$AccountId = (aws sts get-caller-identity --query Account --output text)
$BucketName = "$BucketPrefix-$AccountId"

Write-Host "[1/6] AWS Account: $AccountId | Region: $Region" -ForegroundColor Yellow

# Step 1: Create DynamoDB Table
Write-Host "[2/6] Provisioning DynamoDB Table '$TableName'..." -ForegroundColor Green
$TableExists = aws dynamodb list-tables --region $Region --query "TableNames[?@=='$TableName'] | [0]" --output text
if ($TableExists -eq $TableName) {
    Write-Host "   -> Table '$TableName' already exists." -ForegroundColor Gray
} else {
    aws dynamodb create-table `
        --table-name $TableName `
        --attribute-definitions AttributeName=empId,AttributeType=S `
        --key-schema AttributeName=empId,KeyType=HASH `
        --billing-mode PAY_PER_REQUEST `
        --region $Region | Out-Null
    Write-Host "   -> Created DynamoDB Table '$TableName'" -ForegroundColor Green
}

# Step 2: Create S3 Bucket & CORS
Write-Host "[3/6] Provisioning S3 Bucket '$BucketName'..." -ForegroundColor Green
$BucketExists = aws s3api list-buckets --query "Buckets[?Name=='$BucketName'] | [0]" --output text
if ($BucketExists) {
    Write-Host "   -> S3 Bucket '$BucketName' already exists." -ForegroundColor Gray
} else {
    if ($Region -eq "us-east-1") {
        aws s3api create-bucket --bucket $BucketName --region $Region | Out-Null
    } else {
        aws s3api create-bucket --bucket $BucketName --region $Region --create-bucket-configuration LocationConstraint=$Region | Out-Null
    }
    Write-Host "   -> Created S3 Bucket '$BucketName'" -ForegroundColor Green
}

# Apply CORS Policy to S3
$CorsConfig = '{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
      "AllowedOrigins": ["*"],
      "ExposeHeaders": ["ETag"]
    }
  ]
}'
$CorsConfig | Out-File -FilePath "$env:TEMP\s3cors.json" -Encoding ascii
aws s3api put-bucket-cors --bucket $BucketName --cors-configuration "file://$env:TEMP\s3cors.json"
Write-Host "   -> Configured S3 CORS policy" -ForegroundColor Green

# Step 3: Create IAM Role for Lambda
Write-Host "[4/6] Provisioning IAM Role 'EmployeeAppLambdaRole'..." -ForegroundColor Green
$TrustPolicy = '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "Service": "lambda.amazonaws.com" },
      "Action": "sts:AssumeRole"
    }
  ]
}'
$TrustPolicy | Out-File -FilePath "$env:TEMP\trustpolicy.json" -Encoding ascii

$RoleArn = aws iam get-role --role-name EmployeeAppLambdaRole --query Role.Arn --output text 2>$null
if (-not $RoleArn) {
    $RoleArn = (aws iam create-role --role-name EmployeeAppLambdaRole --assume-role-policy-document "file://$env:TEMP\trustpolicy.json" --query Role.Arn --output text)
    aws iam attach-role-policy --role-name EmployeeAppLambdaRole --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
    aws iam attach-role-policy --role-name EmployeeAppLambdaRole --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess
    aws iam attach-role-policy --role-name EmployeeAppLambdaRole --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess
    Write-Host "   -> Created IAM Role 'EmployeeAppLambdaRole'" -ForegroundColor Green
    Start-Sleep -Seconds 10 # Wait for IAM propagation
} else {
    Write-Host "   -> Role 'EmployeeAppLambdaRole' already exists." -ForegroundColor Gray
}

# Step 4: Create Cognito User Pool
Write-Host "[5/6] Provisioning Cognito User Pool..." -ForegroundColor Green
$UserPoolId = aws cognito-idp list-user-pools --max-results 10 --query "UserPools[?Name=='EmployeeUserPool'].Id | [0]" --output text
if (-not $UserPoolId -or $UserPoolId -eq "None") {
    $UserPoolId = (aws cognito-idp create-user-pool --pool-name EmployeeUserPool --query UserPool.Id --output text)
    Write-Host "   -> Created User Pool ID: $UserPoolId" -ForegroundColor Green
} else {
    Write-Host "   -> User Pool already exists: $UserPoolId" -ForegroundColor Gray
}

$ClientId = aws cognito-idp list-user-pool-clients --user-pool-id $UserPoolId --query "UserPoolClients[?ClientName=='EmployeeAppClient'].ClientId | [0]" --output text
if (-not $ClientId -or $ClientId -eq "None") {
    $ClientId = (aws cognito-idp create-user-pool-client --user-pool-id $UserPoolId --client-name EmployeeAppClient --no-generate-secret --query UserPoolClient.ClientId --output text)
    Write-Host "   -> Created App Client ID: $ClientId" -ForegroundColor Green
} else {
    Write-Host "   -> App Client already exists: $ClientId" -ForegroundColor Gray
}

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host " Deployment Complete!" -ForegroundColor Green
Write-Host " S3 Bucket Name  : $BucketName" -ForegroundColor Yellow
Write-Host " User Pool ID    : $UserPoolId" -ForegroundColor Yellow
Write-Host " App Client ID   : $ClientId" -ForegroundColor Yellow
Write-Host "===============================================" -ForegroundColor Cyan
