import { Construct } from "constructs";
import { aws_connect as connect } from 'aws-cdk-lib';


interface PhoneNumberProps {
    create_or_import: "CREATE" | "IMPORT",
    targetArn: string,
    sourcePhoneNumberArn?: string,
    countryCode?: string,
    description?: string,
    type?: "TOLL_FREE" | "DID" | "UIFN" | "SHARED" | "THIRD_PARTY_DID" | "THIRD_PARTY_TF" | "SHORT_CODE"
}


export class PhoneNumber extends Construct {

    public phone_number: connect.CfnPhoneNumber;

    constructor(scope: Construct, id: string, props: PhoneNumberProps) {
        super(scope, id)

        if (props.create_or_import == "CREATE") {

            const phone_num = new connect.CfnPhoneNumber(this, "MyPhoneNumber", {
                targetArn: props.targetArn,
                countryCode: props.countryCode ? props.countryCode : undefined,
                description: props.description ? props.description : undefined,
                type: props.type ? props.type : undefined
            });


            this.phone_number = phone_num



        } else if (props.create_or_import == "IMPORT") {
            const phone_num = new connect.CfnPhoneNumber(this, "MyPhoneNumber", {
                targetArn: props.targetArn,
                sourcePhoneNumberArn: props.sourcePhoneNumberArn
            });


            this.phone_number = phone_num
        }



    }
}