import { ISimpleServiceAuthorizerConfig } from './simple-service-authorizer-config.interface';

export interface ISimpleServiceTokenValidatorConfig extends ISimpleServiceAuthorizerConfig {
  allowedServiceNames: string[];
}
