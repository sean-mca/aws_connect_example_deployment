#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CCaaSStack } from '../lib/ccaas';

const app = new cdk.App();
new CCaaSStack(app, 'CCaaSStack', {
  env: { account: '000000000000', region: 'us-east-1' },

});