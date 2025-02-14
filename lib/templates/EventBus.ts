import { CfnOutput, RemovalPolicy, Tags } from 'aws-cdk-lib';
import * as eb from 'aws-cdk-lib/aws-events';
import { Effect, PolicyDocument, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

interface EventBusProps {
    id: string
    iamStatements: PolicyStatement[]
}



export class EventBus extends Construct {

    public bus: eb.EventBus;


    constructor(scope: Construct, id: string, props: EventBusProps) {
        super(scope, id)


        const bus = new eb.EventBus(this, `${id}-bus`, {
            eventBusName: props.id
        });

        this.bus = bus;


        const eventBusRole = new Role(this, `${props.id}-bus-role`, {
            assumedBy: new ServicePrincipal("events.amazonaws.com"),
            inlinePolicies: {
                PolicyStatement: new PolicyDocument({
                    statements: props.iamStatements,
                }),
            },
        });



        new CfnOutput(this, `${props.id} bus name: `, { value: bus.eventBusName });
        new CfnOutput(this, `${props.id} bus arn: `, { value: bus.eventBusArn });

    }
}