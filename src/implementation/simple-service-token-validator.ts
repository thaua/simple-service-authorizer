import * as jwt from 'jsonwebtoken';
import { IAuthorizationObject } from '../interfaces/core/authorization-object.interface';
import { ISimpleServiceTokenValidator } from '../interfaces/simple-service-token-validator.interface';
import { ISimpleServiceValidatorConfig } from '../interfaces/config/simple-service-token-validator-config.interface';

export class SimpleServiceTokenValidator implements ISimpleServiceTokenValidator {
  constructor(public readonly config: ISimpleServiceValidatorConfig) {
    this.config = config;
  }

  validate(serviceName: string, token: string): boolean {
    return (
      (jwt.verify(token, this.config.secretWord) as IAuthorizationObject).serviceName ===
      serviceName
    );
  }
}
