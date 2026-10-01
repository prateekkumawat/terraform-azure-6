# AWS Serverless Employee Management Application System

A production-ready serverless Employee Management Application System built on AWS cloud services: **DynamoDB**, **Amazon S3**, **AWS Lambda**, **Amazon API Gateway**, and **Amazon Cognito**, with an integrated visual dashboard and step-by-step manual deployment instructions.

![AWS Serverless Architecture](https://img.shields.io/badge/AWS-Serverless-orange?logo=amazon-aws)
![DynamoDB](https://img.shields.io/badge/Database-DynamoDB-blue)
![S3](https://img.shields.io/badge/Storage-Amazon%20S3-green)
![Lambda](https://img.shields.io/badge/Compute-AWS%20Lambda-amber)
![Cognito](https://img.shields.io/badge/Auth-Amazon%20Cognito-purple)

---

## 🌟 Key Features

- **DynamoDB NoSQL Data Store**: High-performance, scalable `Employees` table with pay-per-request billing.
- **Amazon S3 Presigned URL Photo Uploads**: Direct browser-to-S3 secure image uploads without proxying heavy binary data through Lambda.
- **AWS Lambda Microservices**: Modular Node.js handlers for CRUD actions (`createEmployee`, `getEmployees`, `updateEmployee`, `deleteEmployee`, `getUploadUrl`).
- **Amazon API Gateway REST API**: Complete CORS-enabled RESTful API with Cognito JWT Authorization.
- **Amazon Cognito Authentication**: Secure User Pool & App Client for HR/Admin sign-in authentication.
- **Modern Glassmorphism Web SPA**:
  - Analytics cards (Employee Count, Active Departments, Annual Payroll, S3 Uploads).
  - Search & filter by department, sorting by joining date, salary, or name.
  - Interactive grid and table views with glassmorphic cards.
  - S3 drag & drop photo upload with real-time preview.
  - **Dual Mode Toggle**: Instantly test in **Demo Mode** (local mock data) or connect live to your **AWS API Gateway** backend.

---

## 📁 Project Structure

```
aws-employee-management-system/
├── backend/
│   ├── lambda/
│   │   ├── createEmployee.js       # Lambda: Create employee record in DynamoDB
│   │   ├── getEmployees.js         # Lambda: List all or fetch employee by ID
│   │   ├── updateEmployee.js       # Lambda: Update employee details
│   │   ├── deleteEmployee.js       # Lambda: Delete employee record
│   │   └── getUploadUrl.js         # Lambda: Generate S3 presigned PUT URL
│   └── dynamodb/
│       └── dynamodb-schema.json    # DynamoDB table schema & index definitions
├── frontend/
│   ├── index.html                  # Main Web App HTML markup
│   ├── styles.css                  # Dark glassmorphism CSS design system
│   ├── app.js                      # Application state, UI events & API client
│   └── aws-config.js               # AWS endpoint configuration template
├── docs/
│   └── manual-deployment-guide.md  # Detailed AWS Console step-by-step guide
├── deployment/
│   ├── aws-deploy.ps1              # PowerShell AWS CLI deployment script
│   ├── aws-deploy.sh               # Bash AWS CLI deployment script
│   └── cloudformation.yaml         # CloudFormation 1-click stack template
└── README.md                       # Main documentation
```

---

## 🚀 Quick Start Guide

### 1. Run Web App Locally (Demo Mode)
No AWS account required to start! You can immediately open and preview the web dashboard:

Option A: Double-click [`frontend/index.html`](file:///c:/Users/Prateek/Documents/azure-terraform-setup/aws-employee-management-system/frontend/index.html) in your web browser.
Option B: Serve via standard HTTP server:
```bash
npx http-server frontend -p 3000
```
Open `http://localhost:3000` in your browser.

---

### 2. Manual AWS Deployment Guide

Follow the complete step-by-step visual deployment guide in [`docs/manual-deployment-guide.md`](file:///c:/Users/Prateek/Documents/azure-terraform-setup/aws-employee-management-system/docs/manual-deployment-guide.md):

1. **DynamoDB**: Create `Employees` table with partition key `empId` (String).
2. **S3**: Create bucket `employee-management-photos-<account-id>` and apply CORS policy.
3. **IAM**: Create `EmployeeAppLambdaRole` with basic Lambda execution, DynamoDB, and S3 permissions.
4. **Lambda**: Create 5 Lambda functions pasting code from `backend/lambda/`.
5. **Cognito**: Create `EmployeeUserPool` and `EmployeeAppClient` (No client secret).
6. **API Gateway**: Create REST API `EmployeeManagementAPI` with `/employees` resources, CORS, and Cognito Authorizer.
7. **Frontend Config**: Update [`frontend/aws-config.js`](file:///c:/Users/Prateek/Documents/azure-terraform-setup/aws-employee-management-system/frontend/aws-config.js) or paste endpoints into the browser UI's **AWS Config** panel!

---

### 3. Automated CLI Deployment (Optional)

If you have the AWS CLI configured (`aws configure`), you can automate resource creation:

**Windows PowerShell:**
```powershell
.\deployment\aws-deploy.ps1 -Region us-east-1
```

**Linux / macOS Bash:**
```bash
chmod +x ./deployment/aws-deploy.sh
./deployment/aws-deploy.sh us-east-1
```

---

## 🔒 Security Best Practices Implemented

- **Principle of Least Privilege**: IAM roles restricted to specific DynamoDB & S3 operations.
- **Pre-signed S3 URLs**: Expire automatically after 5 minutes (300 seconds); no broad public write access needed.
- **CORS Restricted Headers**: Explicit CORS responses configured across API Gateway, Lambda headers, and S3 bucket rules.
- **Cognito JWT Token Validation**: API Gateway Authorizer verifies incoming Bearer tokens before triggering Lambda logic.
