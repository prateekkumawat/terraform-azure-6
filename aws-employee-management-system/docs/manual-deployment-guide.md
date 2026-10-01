# Step-by-Step AWS Manual Deployment Guide

This document provides complete, detailed, manual step-by-step instructions for provisioning and configuring the **AWS Serverless Employee Management System** using the **AWS Management Console**.

---

## Architecture Overview

```
[ Frontend Web App ] ──► [ Amazon Cognito User Pool ] (JWT Auth)
         │
         ├──► [ API Gateway REST API ]
         │           │
         │           ├──► [ Lambda: CreateEmployee ] ──► [ DynamoDB: Employees ]
         │           ├──► [ Lambda: GetEmployees ]    ──► [ DynamoDB: Employees ]
         │           ├──► [ Lambda: UpdateEmployee ] ──► [ DynamoDB: Employees ]
         │           ├──► [ Lambda: DeleteEmployee ] ──► [ DynamoDB: Employees ]
         │           └──► [ Lambda: GetUploadUrl ]    ──► [ S3 Bucket (Presigned URL) ]
         │
         └──► [ Amazon S3 Bucket ] (Direct Photo Upload)
```

---

## Step 1: Create DynamoDB Table

1. Open the [AWS DynamoDB Console](https://console.aws.amazon.com/dynamodb/).
2. Click **Create table**.
3. Configure table parameters:
   - **Table name**: `Employees`
   - **Partition key**: `empId` (Type: `String`)
   - **Table class**: `DynamoDB Standard`
   - **Read/Write capacity settings**: Select **On-demand (Pay-per-request)**
4. Click **Create table** and wait until status becomes **Active**.

---

## Step 2: Create S3 Photo Storage Bucket & CORS Policy

1. Open the [AWS S3 Console](https://console.aws.amazon.com/s3/).
2. Click **Create bucket**.
3. Configure bucket settings:
   - **Bucket name**: `employee-management-photos-<your-aws-account-id>` (Must be globally unique)
   - **AWS Region**: Select your preferred region (e.g., `us-east-1`)
   - **Object Ownership**: ACLs disabled (recommended)
   - **Block Public Access settings**: 
     - Uncheck **Block *all* public access** (or keep checked and use presigned URLs / Bucket Policy).
     - Acknowledge warning check box.
4. Click **Create bucket**.
5. Select your newly created bucket and navigate to the **Permissions** tab.
6. Scroll down to **Cross-origin resource sharing (CORS)** and click **Edit**.
7. Paste the following CORS JSON configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"]
  }
]
```
8. Click **Save changes**.

---

## Step 3: Create IAM Execution Role for Lambda

1. Open the [AWS IAM Console](https://console.aws.amazon.com/iam/).
2. Navigate to **Roles** -> **Create role**.
3. Select **AWS service** as Trusted entity, and choose **Lambda** as Use case. Click **Next**.
4. Attach the following AWS Managed Policies:
   - `AWSLambdaBasicExecutionRole`
   - `AmazonDynamoDBFullAccess`
   - `AmazonS3FullAccess`
5. Click **Next**, enter **Role name**: `EmployeeAppLambdaRole`.
6. Click **Create role**.

---

## Step 4: Create & Deploy AWS Lambda Functions

You will create 5 Lambda functions in [AWS Lambda Console](https://console.aws.amazon.com/lambda/):

### Common Settings for All Functions:
- **Runtime**: `Node.js 18.x` or `Node.js 20.x`
- **Execution role**: Use an existing role -> Select `EmployeeAppLambdaRole`
- **Environment Variables**:
  - `TABLE_NAME` = `Employees`
  - `BUCKET_NAME` = `employee-management-photos-<your-aws-account-id>`

### Function 1: `CreateEmployee`
- Function name: `CreateEmployee`
- Copy code from [`backend/lambda/createEmployee.js`](file:///c:/Users/Prateek/Documents/azure-terraform-setup/aws-employee-management-system/backend/lambda/createEmployee.js) and paste into the Code Source editor.
- Click **Deploy**.

### Function 2: `GetEmployees`
- Function name: `GetEmployees`
- Copy code from [`backend/lambda/getEmployees.js`](file:///c:/Users/Prateek/Documents/azure-terraform-setup/aws-employee-management-system/backend/lambda/getEmployees.js).
- Click **Deploy**.

### Function 3: `UpdateEmployee`
- Function name: `UpdateEmployee`
- Copy code from [`backend/lambda/updateEmployee.js`](file:///c:/Users/Prateek/Documents/azure-terraform-setup/aws-employee-management-system/backend/lambda/updateEmployee.js).
- Click **Deploy**.

### Function 4: `DeleteEmployee`
- Function name: `DeleteEmployee`
- Copy code from [`backend/lambda/deleteEmployee.js`](file:///c:/Users/Prateek/Documents/azure-terraform-setup/aws-employee-management-system/backend/lambda/deleteEmployee.js).
- Click **Deploy**.

### Function 5: `GetUploadUrl`
- Function name: `GetUploadUrl`
- Copy code from [`backend/lambda/getUploadUrl.js`](file:///c:/Users/Prateek/Documents/azure-terraform-setup/aws-employee-management-system/backend/lambda/getUploadUrl.js).
- Set Environment Variable: `BUCKET_NAME` = `employee-management-photos-<your-aws-account-id>`
- Click **Deploy**.

---

## Step 5: Configure Amazon Cognito User Pool

1. Open the [AWS Cognito Console](https://console.aws.amazon.com/cognito/).
2. Click **Create user pool**.
3. **Step 1: Configure sign-in experience**: Select **Email** or **Username**.
4. **Step 2: Configure security requirements**: Standard password policy, No MFA (for quick setup).
5. **Step 3: Configure sign-up experience**: Keep defaults.
6. **Step 4: Configure message delivery**: Send email with Cognito (default).
7. **Step 5: Integrate your app**:
   - User pool name: `EmployeeUserPool`
   - App client name: `EmployeeAppClient`
   - Client secret: Select **Don't generate a client secret** (required for browser SPA).
8. Click **Create user pool**.
9. Note down your **User Pool ID** (e.g. `us-east-1_Xyz123`) and **App Client ID** (e.g. `71a2b3c4d5...`).

---

## Step 6: Create API Gateway REST API & Enable CORS

1. Open the [AWS API Gateway Console](https://console.aws.amazon.com/apigateway/).
2. Click **Create API** -> Choose **REST API** (Build).
3. Select **New API**, enter **API name**: `EmployeeManagementAPI`.
4. Click **Create API**.

### Create Authorizer (Cognito):
1. In the left navigation, click **Authorizers** -> **Create new authorizer**.
2. Name: `CognitoAuthorizer`
3. Type: `Cognito`
4. Cognito User Pool: Select `EmployeeUserPool`
5. Token source: `Authorization`
6. Click **Create**.

### Create Resources & Methods:

#### Resource 1: `/employees`
1. Click **Actions** (or **Create resource**).
2. Resource Name: `employees`, Resource Path: `/employees`. Check **Enable API Gateway CORS**.
3. Create Methods under `/employees`:
   - **POST**: Integrate with Lambda `CreateEmployee`. Check **Use Lambda Proxy integration**.
   - **GET**: Integrate with Lambda `GetEmployees`. Check **Use Lambda Proxy integration**.

#### Resource 2: `/employees/{id}`
1. Under `/employees`, create child resource: Resource Name: `id`, Resource Path: `{id}`. Enable CORS.
2. Create Methods under `/employees/{id}`:
   - **GET**: Integrate with Lambda `GetEmployees`. Check **Use Lambda Proxy integration**.
   - **PUT**: Integrate with Lambda `UpdateEmployee`. Check **Use Lambda Proxy integration**.
   - **DELETE**: Integrate with Lambda `DeleteEmployee`. Check **Use Lambda Proxy integration**.

#### Resource 3: `/employees/upload-url`
1. Under `/employees`, create child resource: Resource Name: `upload-url`, Resource Path: `upload-url`. Enable CORS.
2. Create Method under `/employees/upload-url`:
   - **POST**: Integrate with Lambda `GetUploadUrl`. Check **Use Lambda Proxy integration**.

### Enable CORS on All Resources:
1. Select `/employees`, click **Enable CORS** -> Default settings -> **Save**.
2. Repeat for `/employees/{id}` and `/employees/upload-url`.

### Deploy API:
1. Click **Deploy API**.
2. Deployment stage: Select `[New Stage]`, Stage name: `prod`.
3. Click **Deploy**.
4. Copy the **Invoke URL** (e.g., `https://xyz123.execute-api.us-east-1.amazonaws.com/prod`).

---

## Step 7: Connect & Test Web Application

1. Open [`frontend/aws-config.js`](file:///c:/Users/Prateek/Documents/azure-terraform-setup/aws-employee-management-system/frontend/aws-config.js) or open the web app in your browser and click **AWS Config** settings.
2. Enter your:
   - **API Gateway Base URL**: `https://<api-id>.execute-api.<region>.amazonaws.com/prod`
   - **Cognito User Pool ID**: `<region>_xxxxxxxxx`
   - **Cognito Client ID**: `xxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **S3 Bucket Name**: `employee-management-photos-<your-aws-account-id>`
3. Toggle mode switch to **AWS Live API Mode**.
4. You are ready! Test creating, listing, updating, deleting employees and uploading profile photos directly to AWS S3.
