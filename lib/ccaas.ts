import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { DeploymentStage } from './cicd/stage';


export class CCaaSStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'IaCDeployment',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.connection('owner/repo', 'main', {
          connectionArn: 'codestarARN',
        }),
        commands: ['npm ci', 'npm run build', 'npx cdk synth']
      })
    });


    // const devWave = pipeline.addWave('devWave');


    // devWave.addStage(new DeploymentStage(this, 'deepveilUSEAST', {
    //   env: { account: '000000000000', region: 'us-east-1' }
    // }));

  }
}