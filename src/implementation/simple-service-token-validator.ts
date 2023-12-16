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
    try {
      const result: IAuthorizationObject = jwt.verify(
        token,
        this.config.secretWord,
      ) as IAuthorizationObject;

      const tokenServiceName = result?.serviceName;
      const isTokenConsistent = tokenServiceName === serviceName;

      const isTokenOnAllowedList =
        this.config.allowedServiceNames.length === 0 ||
        this.config.allowedServiceNames.includes(tokenServiceName);

      if (isTokenConsistent && isTokenOnAllowedList) {
        this.state = SimpleServiceTokenValidatorStatus.VALID;
        return true;
      }
    } catch (e) {
      this.state =
        e instanceof TokenExpiredError
          ? SimpleServiceTokenValidatorStatus.EXPIRED
          : SimpleServiceTokenValidatorStatus.ERROR;

      return false;
    }

    this.state = SimpleServiceTokenValidatorStatus.INVALID;
    return false;
  }
}
