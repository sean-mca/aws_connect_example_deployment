import { CfnOutput, RemovalPolicy, Tags } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';


interface S3BucketProps {
    id: string
}


export class S3Bucket extends Construct {

    public bucket: s3.Bucket;


    constructor(scope: Construct, id: string, props: S3BucketProps) {
        super(scope, id)


        const s3_bucket = new s3.Bucket(this, props.id, {
            accessControl: s3.BucketAccessControl.PRIVATE,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            removalPolicy: RemovalPolicy.RETAIN,
            encryption: s3.BucketEncryption.S3_MANAGED,
            publicReadAccess: false,
        });


        this.bucket = s3_bucket;

        new CfnOutput(this, `${id} bucketName: `, { value: s3_bucket.bucketName });
        new CfnOutput(this, `${id} bucketArn: `, { value: s3_bucket.bucketArn });
    }
}