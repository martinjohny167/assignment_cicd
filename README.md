# My CDK Project

This project creates an AWS infrastructure using CDK with the following resources:
- S3 Bucket (versioned)
- Lambda Function
- DynamoDB Table

## Prerequisites

- Node.js (v14.x or later)
- AWS CLI configured with appropriate credentials
- AWS CDK CLI installed (`npm install -g aws-cdk`)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Build the TypeScript code:
```bash
npm run build
```

## Deployment

1. Bootstrap your AWS environment (if you haven't already):
```bash
cdk bootstrap
```

2. Synthesize the CloudFormation template:
```bash
cdk synth
```

3. Deploy the stack:
```bash
cdk deploy
```

## Cleanup

To destroy the stack and all resources:
```bash
cdk destroy
```

## Stack Details

- The S3 bucket is versioned and configured to auto-delete objects when removed
- The Lambda function has permissions to read from the S3 bucket and read/write to the DynamoDB table
- The DynamoDB table uses on-demand (pay per request) billing mode
- All resources have removal policies set to DESTROY (suitable for development/testing only)

## Output

After deployment, the following information will be displayed:
- S3 Bucket name
- Lambda function name
- DynamoDB table name 