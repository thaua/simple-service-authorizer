import { ISimpleServiceAuthorizerConfig } from './simple-service-authorizer-config.interface';

export interface ISimpleServiceTokenGeneratorConfig extends ISimpleServiceAuthorizerConfig {
  serviceName: string;
}
