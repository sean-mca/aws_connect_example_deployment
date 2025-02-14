import { Construct } from "constructs";
import { aws_connect as connect } from 'aws-cdk-lib';
import { S3Bucket } from "./S3Bucket";
import { FirehoseTemplate } from "./Firehose";
import { KinesisStreamTemplate } from "./KinesisStream";


interface ConnectStorageConfigProps {
    instanceArn: string,
    chat_transcripts: boolean,
    call_recordings: boolean,
    scheduled_reports: boolean,
    media_streams: boolean,
    contract_trace_records: boolean,
    agent_events: boolean
};



export class ConnectStorageConfig extends Construct {


    public storage_config: object;


    constructor(scope: Construct, id: string, props: ConnectStorageConfigProps) {
        super(scope, id)


        const config_dict: Record<string, object> = {};


        if (props.chat_transcripts == true) {
            const chat_transcripts_bucket = new S3Bucket(this, "ChatBucket", {
                id: "chat_transcripts"
            })
            const chat_transcript_storage = new connect.CfnInstanceStorageConfig(this, "ExampleChatStorageConfig", {
                instanceArn: props.instanceArn,
                resourceType: "CHAT_TRANSCRIPTS",
                storageType: "S3",
                s3Config: {
                    bucketName: chat_transcripts_bucket.bucket.bucketName,
                    bucketPrefix: "chat-transcripts-raw",
                }
            });

            config_dict.chat_transcripts = {
                storage_config: chat_transcript_storage,
                bucket: chat_transcripts_bucket.bucket
            }
        }

        if (props.call_recordings == true) {
            const call_recording_bucket = new S3Bucket(this, 'CallRecordingsBucket', {
                id: "call-recordings"
            });

            const call_recording_storage = new connect.CfnInstanceStorageConfig(this, "ExampleCallRecording", {
                instanceArn: props.instanceArn,
                resourceType: "CALL_RECORDINGS",
                storageType: "S3",
                s3Config: {
                    bucketName: call_recording_bucket.bucket.bucketName,
                    bucketPrefix: "call-recordings-raw",
                }
            });

            config_dict.call_recordings = {
                storage_config: call_recording_storage,
                bucket: call_recording_bucket.bucket
            }
        }


        if (props.scheduled_reports == true) {
            const scheduled_reports_bucket = new S3Bucket(this, 'ScheduledReportsBucket', {
                id: "scheduled-reports"
            });

            const schedule_reports_storage = new connect.CfnInstanceStorageConfig(this, 'ExampleScheduledReports', {
                instanceArn: props.instanceArn,
                resourceType: "SCHEDULED_REPORTS",
                storageType: "S3",
                s3Config: {
                    bucketName: scheduled_reports_bucket.bucket.bucketName,
                    bucketPrefix: "scheduled-reports"
                }
            });

            config_dict.scheduled_reports = {
                storage_config: schedule_reports_storage,
                bucket: scheduled_reports_bucket.bucket
            }
        }


        if (props.media_streams == true) {
            const media_streams_storage = new connect.CfnInstanceStorageConfig(this, 'ExampleMediaStreams', {
                instanceArn: props.instanceArn,
                resourceType: "MEDIA_STREAMS",
                storageType: "KINESIS_VIDEO_STREAM",
                kinesisVideoStreamConfig: {
                    encryptionConfig: {
                        encryptionType: 'encryptionType',
                        keyId: 'keyId',
                    },
                    prefix: 'prefix',
                    retentionPeriodHours: 123,

                }
            });

            config_dict.media_streams = {
                storage_config: media_streams_storage
            }
        }


        if (props.contract_trace_records == true) {

            const contact_trace_records_bucket = new S3Bucket(this, "ContactTraceRecords", {
                id: "contract_trace_records"
            })

            const contract_trace_records_firehose = new FirehoseTemplate(this, "ExampleContactTrace", {
                bucket: contact_trace_records_bucket.bucket
            })

            const contract_trace_records_storage = new connect.CfnInstanceStorageConfig(this, "ContractTraceRecords", {
                instanceArn: props.instanceArn,
                resourceType: "CONTACT_TRACE_RECORDS",
                storageType: "KINESIS_FIREHOSE",
                kinesisFirehoseConfig: {
                    firehoseArn: contract_trace_records_firehose.stream.deliveryStreamArn
                }
            });

            config_dict.contact_trace_records = {
                storage_config: contract_trace_records_storage,
                bucket: contact_trace_records_bucket.bucket,
                firehose: contract_trace_records_firehose.stream
            }
        }


        if (props.agent_events == true) {

            const agent_events_bucket = new S3Bucket(this, "AgentEventsBucket", {
                id: "agnet_events"
            });

            const agent_events_stream = new KinesisStreamTemplate(this, "AgentEventsStream", {
                bucket: agent_events_bucket.bucket,
                error_prefix: "agent-events-errors"
            });

            const agent_events_storage = new connect.CfnInstanceStorageConfig(this, "AgentEvents", {
                instanceArn: props.instanceArn,
                resourceType: "AGENT_EVENTS",
                storageType: "KINESIS_STREAM",
                kinesisStreamConfig: {
                    streamArn: agent_events_stream.stream.streamArn
                }
            });

            config_dict.agent_events = {
                storage_config: agent_events_storage,
                bucket: agent_events_bucket.bucket,
                stream: {
                    raw_stream: agent_events_stream.stream,
                    firehose: agent_events_stream.firehose
                }
            }
        }

        this.storage_config = config_dict;


    }
}