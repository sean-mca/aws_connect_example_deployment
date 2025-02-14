import { Construct } from 'constructs';
import * as apig from 'aws-cdk-lib/aws-apigateway';

type Type<T> = T;

interface ApiSubResource extends Type<{
    subResource: string,
    method: "GET" | "POST" | "DELETE" | "PUT",
    integration: apig.Integration,
    authHandler?: apig.AuthorizationType
}> { }
interface ApiResourceTree extends Type<{
    branch: string,
    leaves: ApiSubResource[]
}> { }



interface ApiProps {
    id: string,
    resourceTree: ApiResourceTree[]
}


export class Api extends Construct {

    public api: apig.RestApi


    constructor(scope: Construct, id: string, props: ApiProps) {
        super(scope, id)


        const api_root = new apig.RestApi(this, `${props.id}`, {});

        for (const key in props.resourceTree) {
            // first create the resource we need off of the API root
            let branch = api_root.root.addResource(props.resourceTree[key].branch);

            props.resourceTree[key].leaves.map((tree) => {
                let subResource = branch.addResource(tree.subResource);
                if (tree.authHandler !== undefined) {
                    subResource.addMethod(tree.method, tree.integration, {
                        authorizationType: apig.AuthorizationType.CUSTOM,
                        //@ts-ignore
                        authorizer: tree.authHandler
                    })
                } else {
                    subResource.addMethod(tree.method, tree.integration)
                }
            });
        }
        this.api = api_root;


    }
}