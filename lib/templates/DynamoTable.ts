import { CfnOutput, RemovalPolicy, Tags } from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';


interface DynamoTableProps {
    id: string,
    primaryKey: string,
    primaryKeyType: dynamodb.AttributeType,
    sortKey?: string
    sortKeyType?: dynamodb.AttributeType
}

interface Tag {
    [key: string]: string
}


export class DynamoTable extends Construct {

    public table: dynamodb.TableV2;

    constructor(scope: Construct, id: string, props: DynamoTableProps) {
        super(scope, id)

        // if there's no sort Key being passed in, make a table w/o one
        if (props.sortKey == undefined) {
            const dynamo_table = new dynamodb.TableV2(this, props.id, {
                partitionKey: {
                    name: props.primaryKey,
                    type: props.primaryKeyType
                },

                billing: dynamodb.Billing.onDemand(),
                timeToLiveAttribute: "expireTime",
                removalPolicy: RemovalPolicy.RETAIN,
                deletionProtection: true

            });

            this.table = dynamo_table;
        } // if there is a sort key being passed in, make a table w/ one
        else {
            const dynamo_table = new dynamodb.TableV2(this, props.id, {
                partitionKey: {
                    name: props.primaryKey,
                    type: props.primaryKeyType
                },
                sortKey: {
                    name: props.sortKey!,
                    type: props.sortKeyType!
                },
                billing: dynamodb.Billing.onDemand(),
                timeToLiveAttribute: "expireTime",
                removalPolicy: RemovalPolicy.RETAIN,
                deletionProtection: true
            });
            this.table = dynamo_table;
        }

        const addTags = (tags: Tag[]) => {
            tags.map((tag) => {
                Tags.of(this.table).add(tag.key, tag.value)
            })
        }

        new CfnOutput(this, `${id} table name: `, { value: this.table.tableName });
        new CfnOutput(this, `${id} table arn: `, { value: this.table.tableArn });

    }
}