import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { IRepository, Repository } from 'aws-cdk-lib/aws-ecr';
import { Duration, Tags } from 'aws-cdk-lib';


interface EnvironmentVars {
    [key: string]: string
}


interface LambdaFunctionProps {
    id: string,
    environment: EnvironmentVars
    mem?: number
}



export class LambdaFunction extends Construct {


    public function: lambda.Function;



    constructor(scope: Construct, id: string, props: LambdaFunctionProps) {
        super(scope, id)


        const lambda_function = new lambda.DockerImageFunction(this, `${props.id}-function`, {
            code: lambda.DockerImageCode.fromEcr(
                Repository.fromRepositoryName(this, 'myRepo', `repo-name/${props.id}`), {
            }),
            architecture: lambda.Architecture.ARM_64,
            timeout: Duration.seconds(30),
            memorySize: props.mem ? props.mem : 128,
            environment: props.environment
        });

        this.function = lambda_function;




    }
}