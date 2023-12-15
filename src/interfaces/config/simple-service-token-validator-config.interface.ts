import { ISimpleServiceAuthorizerConfig } from './simple-service-authorizer-config.interface';

export interface ISimpleServiceValidatorConfig extends ISimpleServiceAuthorizerConfig {
  allowedServiceNames: string[];
}
