import { Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AllTiers } from '../tiers/AllTiers';



export class DeploymentStage extends Stage {
    constructor(scope: Construct, id: string, props?: StageProps) {
        super(scope, id, props);


        const all_tiers = new AllTiers(this, 'examplestage', {});



    }
}