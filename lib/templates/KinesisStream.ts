import { Construct } from "constructs";
import * as kinesis from 'aws-cdk-lib/aws-kinesis';
import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';
import { Bucket } from "aws-cdk-lib/aws-s3";

interface KinesisStreamProps {
    bucket: Bucket,
    error_prefix: string
};


export class KinesisStreamTemplate extends Construct {

    public stream: kinesis.Stream;
    public firehose: firehose.DeliveryStream;


    constructor(scope: Construct, id: string, props: KinesisStreamProps) {
        super(scope, id)

        const stream = new kinesis.Stream(this, "ExampleStream", {
            streamMode: kinesis.StreamMode.ON_DEMAND,
        });


        const firehose_to_s3 = new firehose.DeliveryStream(this, "DeliveryStreamviaKinesis", {
            source: new firehose.KinesisStreamSource(stream),
            destination: new firehose.S3Bucket(props.bucket, {
                compression: firehose.Compression.GZIP,
                errorOutputPrefix: props.error_prefix
            })
        });


        this.stream = stream;
        this.firehose = firehose_to_s3;


    }
}