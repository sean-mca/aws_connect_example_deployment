import { Construct } from "constructs";
import { ConnectStorageConfig } from "../../templates/StorageConfig";
import { CoreInstance } from "../../templates/CoreInstance";
import { PhoneNumber } from "../../templates/PhoneNumber";
import { Hoop } from "../../templates/HOOP";
import { NestedStack, Stack } from "aws-cdk-lib";

interface ApplicationTierProps { };

export class ApplicationTier extends NestedStack {
    constructor(scope: Construct, id: string, props: ApplicationTierProps) {
        super(scope, id);


        // the core AWS Connect instance 
        const core_instance = new CoreInstance(this, 'CoreInstance', {
            identityManagementType: "CONNECT_MANAGED"
        });


        //the storageConfig we want to attach to this instance
        const connect_storage_config = new ConnectStorageConfig(this, "ExampleStorageConfig", {
            instanceArn: core_instance.core_instance.attrArn,
            chat_transcripts: true,
            call_recordings: true,
            scheduled_reports: true,
            media_streams: false,
            contract_trace_records: true,
            agent_events: true
        });


        connect_storage_config.node.addDependency(core_instance.core_instance)


        //phone number - can let connect get one for you or if you have a number from another aws service, import it via sourcePhoneNumberArn
        const phone_number = new PhoneNumber(this, 'ExamplePhoneNum', {
            targetArn: core_instance.core_instance.attrArn,
            create_or_import: "CREATE"
        });

    }
}