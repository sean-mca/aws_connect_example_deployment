import { Construct } from "constructs";
import { aws_connect as connect } from 'aws-cdk-lib';

interface CoreInstanceProps {
    identityManagementType: "SAML" | "CONNECT_MANAGED" | "EXISTING_DIRECTORY",
    instanceAlias?: string,
    autoResolveBestVoices?: boolean,
    contactflowLogs?: boolean,
    contactLens?: boolean,
    earlyMedia?: boolean,
    useCustomTtsVoices?: boolean,
}



export class CoreInstance extends Construct {

    public core_instance: connect.CfnInstance;

    constructor(scope: Construct, id: string, props: CoreInstanceProps) {
        super(scope, id)


        const core_instance = new connect.CfnInstance(this, "ExampleCfnInstance", {
            attributes: {
                inboundCalls: true,
                outboundCalls: true,
                autoResolveBestVoices: props.autoResolveBestVoices ? props.autoResolveBestVoices : false,
                contactflowLogs: props.contactflowLogs ? props.contactflowLogs : true,
                contactLens: props.contactLens ? props.contactLens : true,
                earlyMedia: props.earlyMedia ? props.earlyMedia : false,
                useCustomTtsVoices: props.useCustomTtsVoices ? props.useCustomTtsVoices : false
            },

            identityManagementType: props.identityManagementType,
            instanceAlias: props.identityManagementType == "EXISTING_DIRECTORY" ? undefined : props.instanceAlias
        });


        this.core_instance = core_instance
    }
}