import { Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import { ApplicationTier } from '../tiers/Application';


export class DeploymentStage extends Stage {
    constructor(scope: Construct, id: string, props?: StageProps) {
        super(scope, id, props);


        // const appTier = new ApplicationTier(this, 'dv-applicationtier', {});



    }
}