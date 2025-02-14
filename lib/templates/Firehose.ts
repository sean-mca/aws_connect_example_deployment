import { Construct } from "constructs";
import * as firehose from "aws-cdk-lib/aws-kinesisfirehose";
import { Bucket } from "aws-cdk-lib/aws-s3";

interface FirehoseTemplateProps {
    bucket: Bucket
};


export class FirehoseTemplate extends Construct {

    public stream: firehose.DeliveryStream;

    constructor(scope: Construct, id: string, props: FirehoseTemplateProps) {
        super(scope, id)

        const deliveryStream = new firehose.DeliveryStream(this, "ExampleStream", {
            encryption: firehose.StreamEncryption.awsOwnedKey(),
            destination: new firehose.S3Bucket(props.bucket, {
                compression: firehose.Compression.GZIP
            })
        });


        this.stream = deliveryStream;

    }
}