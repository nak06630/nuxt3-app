# Nuxt3 deploy(aws-lambda)

## 環境構築

### nuxt.config.ts

- 以下のように修正

  ```typescript
  nitro: {
    preset: "aws-lambda";
  }
  ```

- build

  ```bash
  npm run build
  ```

### serverless インストール

- install

  ```bash
  npm install -D serverless
  ```

- serevrless.yml を以下のように作成

  ```
  service: nuxt3-app
  frameworkVersion: '3'
  provider:
  name: aws
  stage: dev
  region: ap-northeast-1
  runtime: nodejs18.x
  package:
  patterns:
      - '!**'
      - '.output/**'
  functions:
  NuxtSsrEngine:
      handler: '.output/server/index.handler'
      url: true
  ```

- .gitignore

  - .serverless を追加

### .output/server deploy (Lambda)

- cloudfront 設定前に一度 Lambda をデプロイ

  ```
  npm run build
  npx serverless deploy
  ```

## cloudfront と public のデプロイ先 S3 の設定

- cdn.yml を以下のとおり作成

  ```
  AWSTemplateFormatVersion: "2010-09-09"
  Description: Nuxt3 application distribution template

  Parameters:
  NuxtSsrEnginDomain:
      Type: String
      Description: Lambda Function URL Domain

  Resources:
  # 静的リソース配信用のS3バケット
  StaticResourceBucket:
      Type: AWS::S3::Bucket
      Properties:
      # グローバルで一意な名前を指定してください
      BucketName: nuxt3-sample-public-bucket
      AccessControl: Private
      PublicAccessBlockConfiguration:
          BlockPublicAcls: true
          BlockPublicPolicy: true
          IgnorePublicAcls: true
          RestrictPublicBuckets: true
  # CloudFront -> S3のアクセスコントロール
  StaticResourceOriginAccessControl:
      Type: AWS::CloudFront::OriginAccessControl
      Properties:
      OriginAccessControlConfig:
          Name: "nuxt3-sample-oac"
          OriginAccessControlOriginType: s3
          SigningBehavior: always
          SigningProtocol: sigv4
  # S3バケットポリシー(CloudFrontからのみを許可)
  StaticResourceBucketPolicy:
      Type: AWS::S3::BucketPolicy
      Properties:
      Bucket: !Ref StaticResourceBucket
      PolicyDocument:
          Version: 2012-10-17
          Statement:
          Sid: AllowCloudFrontServicePrincipalReadOnly
          Effect: Allow
          Principal:
              Service: cloudfront.amazonaws.com
          Action: s3:GetObject
          Resource: !Sub "arn:aws:s3:::${StaticResourceBucket}/*"
          Condition:
              StringEquals:
              AWS:SourceArn: !Sub "arn:aws:cloudfront::${AWS::AccountId}:distribution/${NuxtSampleAppDistribution}"
  # CloudFrontディストリビューション
  NuxtSampleAppDistribution:
      Type: AWS::CloudFront::Distribution
      Properties:
      DistributionConfig:
          Enabled: true
          HttpVersion: http2
          CacheBehaviors:
          - PathPattern: "/_nuxt/*"
              TargetOriginId: "nuxt-static-resources"
              ViewerProtocolPolicy: redirect-to-https
              # AWS Managed Cache Policy(CachingOptimized)
              CachePolicyId: 658327ea-f89d-4fab-a63d-7e88639e58f6
          DefaultCacheBehavior:
          TargetOriginId: "nuxt-ssr-engine"
          # AWS Managed Cache Policy(CachingDisabled)
          CachePolicyId: 4135ea2d-6df8-44a3-9df3-4b5a84be39ad
          ViewerProtocolPolicy: redirect-to-https
          Origins:
          - Id: "nuxt-static-resources"
              DomainName: !GetAtt StaticResourceBucket.RegionalDomainName
              OriginAccessControlId: !GetAtt StaticResourceOriginAccessControl.Id
              S3OriginConfig: {}
          - Id: "nuxt-ssr-engine"
              DomainName: !Ref NuxtSsrEnginDomain
              CustomOriginConfig:
              OriginProtocolPolicy: https-only
  Outputs:
  CloudFrontDomain:
      Value: !GetAtt NuxtSampleAppDistribution.DomainName
  ```

### cfn 実行

- Lambda のデプロイ先を設定し、S3 を決めて実行

  - aws の方は、serverless の実行結果を参照。https:// を含めないので注意

  ```
  aws cloudformation deploy --template-file cfn.yml --stack-name nuxt-distribution --parameter-overrides "NuxtSsrEngineDomain=********" "NuxtStaticResourceBucket=*********"
  ```

## deploy

```
npm run build
npx serverless deploy
npx aws s3 sync --delete .output/public s3://*******
```

## 参考

設定確認

- ID の確認

  ```bash
  $ aws cloudfront list-distributions | jq -r '.DistributionList.Items[].Id'
  **************
  ```

- Domain の確認

  ```bash
  $ aws cloudfront get-distribution --id ************** | jq -r .Distribution.DistributionConfig.Origins.Items[].DomainName
  ********************************.lambda-url.ap-northeast-1.on.aws
  ********************************.s3.ap-northeast-1.amazonaws.com
  ```
