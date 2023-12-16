import * as jwt from 'jsonwebtoken';
import { TokenExpiredError } from 'jsonwebtoken';
import { ISimpleServiceTokenValidatorConfig } from '../definitions/config/simple-service-token-validator-config.interface';
import { IAuthorizationObject } from '../definitions/core/authorization-object.interface';
import { SimpleServiceTokenValidatorStatus } from '../definitions/core/simple-service-token-validator-state.enum';
import { ISimpleServiceTokenValidator } from '../definitions/simple-service-token-validator.interface';

export class SimpleServiceTokenValidator implements ISimpleServiceTokenValidator {
  public state?: SimpleServiceTokenValidatorStatus;

  constructor(public readonly config: ISimpleServiceTokenValidatorConfig) {
    this.config = config;
  }

  validate(serviceName: string, token: string): boolean {
    let result: IAuthorizationObject;

    try {
      result = jwt.verify(token, this.config.secretWord) as IAuthorizationObject;
    } catch (e) {
      this.state =
        e instanceof TokenExpiredError
          ? SimpleServiceTokenValidatorStatus.EXPIRED
          : SimpleServiceTokenValidatorStatus.ERROR;

      return false;
    }

    if (this.isServiceNameValid(serviceName, result?.serviceName)) {
      this.state = SimpleServiceTokenValidatorStatus.VALID;
      return true;
    }

    this.state = SimpleServiceTokenValidatorStatus.INVALID;
    return false;
  }

  private isServiceNameValid(serviceName: string, tokenServiceName: string): boolean {
    const isTokenConsistent = tokenServiceName === serviceName;

    const isTokenOnAllowedList =
      this.config.allowedServiceNames.length === 0 ||
      this.config.allowedServiceNames.includes(tokenServiceName);

    return isTokenConsistent && isTokenOnAllowedList;
  }
}
