import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class MyCdkProjectStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define constants for naming
    const studentId = '8945124';
    const name = 'martin';
    const resourcePrefix = `${name}-${studentId}`;

    // Create S3 bucket
    const myBucket = new s3.Bucket(this, 'MyFirstBucket', {
      versioned: true,
      bucketName: `${resourcePrefix}-bucket`, // Adding unique identifier
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Only for dev/test environments
      autoDeleteObjects: true, // Automatically delete objects when bucket is removed
    });

    // Create Lambda function
    const myLambda = new lambda.Function(this, 'MyLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      functionName: `${resourcePrefix}-lambda`, // Adding unique identifier
      code: lambda.Code.fromInline(`
        exports.handler = async function(event) {
          console.log('Lambda invoked by ${name} (${studentId})!');
          return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              message: 'Hello, World!',
              owner: '${name}',
              studentId: '${studentId}'
            })
          };
        }
      `),
      environment: {
        BUCKET_NAME: myBucket.bucketName,
        OWNER: name,
        STUDENT_ID: studentId,
      },
    });

    // Grant Lambda permissions to access S3 bucket
    myBucket.grantRead(myLambda);

    // Create DynamoDB table
    const myTable = new dynamodb.Table(this, 'MyTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      tableName: `${resourcePrefix}-table`, // Adding unique identifier
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Only for dev/test environments
    });

    // Grant Lambda permissions to access DynamoDB table
    myTable.grantReadWriteData(myLambda);

    // Add environment variable for DynamoDB table name to Lambda
    myLambda.addEnvironment('TABLE_NAME', myTable.tableName);

    // Output the resource names
    new cdk.CfnOutput(this, 'BucketName', {
      value: myBucket.bucketName,
      description: `The name of the S3 bucket (Owner: ${name})`,
    });

    new cdk.CfnOutput(this, 'LambdaFunctionName', {
      value: myLambda.functionName,
      description: `The name of the Lambda function (Owner: ${name})`,
    });

    new cdk.CfnOutput(this, 'DynamoDBTableName', {
      value: myTable.tableName,
      description: `The name of the DynamoDB table (Owner: ${name})`,
    });

    // Tag all resources
    cdk.Tags.of(this).add('Owner', name);
    cdk.Tags.of(this).add('StudentId', studentId);
  }
} 