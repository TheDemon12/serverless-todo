import type { AWS } from "@serverless/typescript";

import {
	getTodos,
	hello,
	generateUploadUrl,
	createTodo,
} from "@functions/http";

const serverlessConfiguration: AWS = {
	service: "todo-app",
	frameworkVersion: "2",
	custom: {
		webpack: {
			webpackConfig: "./webpack.config.js",
			includeModules: true,
		},
	},
	plugins: ["serverless-webpack"],
	provider: {
		name: "aws",
		runtime: "nodejs14.x",

		stage: "${opt:stage, 'dev'}",
		// @ts-ignore
		region: "${opt:region, 'ap-south-1'}",

		apiGateway: {
			minimumCompressionSize: 1024,
			shouldStartNameWithService: true,
		},
		environment: {
			AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
			TODOS_TABLE: "Todos-${self:provider.stage}",
			ATTACHMENTS_BUCKET: "kartik-todos-attachments-${self:provider.stage}",
		},
		lambdaHashingVersion: "20201221",

		iamRoleStatements: [
			{
				Effect: "Allow",
				Action: ["dynamodb:Scan", "dynamodb:PutItem", "dynamodb:GetItem"],
				Resource:
					"arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.TODOS_TABLE}",
			},
			{
				Effect: "Allow",
				Action: ["s3:PutObject", "s3:GetObject"],
				Resource:
					"arn:aws:s3:::${self:provider.environment.ATTACHMENTS_BUCKET}/*",
			},
		],
	},

	// import the function via paths
	functions: { hello, getTodos, generateUploadUrl, createTodo },

	resources: {
		Resources: {
			TodosDynamoDBTable: {
				Type: "AWS::DynamoDB::Table",
				Properties: {
					AttributeDefinitions: [
						{ AttributeName: "todoId", AttributeType: "S" },
						{ AttributeName: "createdAt", AttributeType: "S" },
					],
					KeySchema: [
						{ AttributeName: "todoId", KeyType: "HASH" },
						{ AttributeName: "createdAt", KeyType: "RANGE" },
					],
					BillingMode: "PAY_PER_REQUEST",
					TableName: "${self:provider.environment.TODOS_TABLE}",
				},
			},
			AttachmentsBucket: {
				Type: "AWS::S3::Bucket",
				Properties: {
					BucketName: "${self:provider.environment.ATTACHMENTS_BUCKET}",
					CorsConfiguration: {
						CorsRules: [
							{
								AllowedOrigins: ["*"],
								AllowedHeaders: ["*"],
								AllowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
								MaxAge: "3000",
							},
						],
					},
				},
			},

			AttachmentsBucketPolicy: {
				Type: "AWS::S3::BucketPolicy",
				Properties: {
					PolicyDocument: {
						Id: "MyPolicy",
						Version: "2012-10-17",
						Statement: [
							{
								Sid: "PublicReadForGetBucketObjects",
								Effect: "Allow",
								Principal: "*",
								Action: "s3:GetObject",
								Resource:
									"arn:aws:s3:::${self:provider.environment.ATTACHMENTS_BUCKET}/*",
							},
						],
					},
					Bucket: {
						Ref: "AttachmentsBucket",
					},
				},
			},
		},
	},
};

module.exports = serverlessConfiguration;
