import * as jwt from 'jsonwebtoken';
import { TokenExpiredError } from 'jsonwebtoken';
import { ISimpleServiceValidatorConfig } from '../../dist/interfaces/config/simple-service-token-validator-config.interface';
import { IAuthorizationObject } from '../definitions/core/authorization-object.interface';
import { SimpleServiceTokenValidatorStatus } from '../definitions/core/simple-service-token-validator-state.enum';
import { ISimpleServiceTokenValidator } from '../definitions/simple-service-token-validator.interface';

export class SimpleServiceTokenValidator implements ISimpleServiceTokenValidator {
  public state?: SimpleServiceTokenValidatorStatus;

  constructor(public readonly config: ISimpleServiceValidatorConfig) {
    this.config = config;
  }

  validate(serviceName: string, token: string): boolean {
    try {
      const result: IAuthorizationObject = jwt.verify(
        token,
        this.config.secretWord,
      ) as IAuthorizationObject;

      if (result?.serviceName === serviceName) {
        this.state = SimpleServiceTokenValidatorStatus.VALID;
        return true;
      } else {
        this.state = SimpleServiceTokenValidatorStatus.INVALID;
        return false;
      }
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        this.state = SimpleServiceTokenValidatorStatus.EXPIRED;
      } else {
        this.state = SimpleServiceTokenValidatorStatus.ERROR;
      }

      return false;
    }
  }
}
