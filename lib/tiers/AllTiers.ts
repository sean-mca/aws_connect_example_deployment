import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { ApplicationTier } from "./application/Application";


export class AllTiers extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props)


        const applicationTier = new ApplicationTier(this, 'apptier', {});




    }
}