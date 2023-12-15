import { ISimpleServiceTokenValidatorConfig } from './config/simple-service-token-validator-config.interface';
import { SimpleServiceTokenValidatorStatus } from './core/simple-service-token-validator-state.enum';

export interface ISimpleServiceTokenValidator {
  readonly config: ISimpleServiceTokenValidatorConfig;
  state?: SimpleServiceTokenValidatorStatus;

  validate(serviceName: string, token: string): boolean;
}
