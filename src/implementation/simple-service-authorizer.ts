import * as jwt from 'jsonwebtoken';
import { IAuthorizationObject } from '../interfaces/authorization-object.interface';
import { ISimpleServiceAuthorizerConfig } from '../interfaces/simple-service-authorizer-config.interface';
import { ISimpleServiceAuthorizer } from '../interfaces/simple-service-authorizer.interface';

export class SimpleServiceAuthorizer implements ISimpleServiceAuthorizer {
  constructor(private readonly config: ISimpleServiceAuthorizerConfig) {
    this.config = config;
  }

  generateToken(): string {
    return jwt.sign(
      { serviceName: this.config.serviceName } as IAuthorizationObject,
      this.config.secretWord,
      {
        expiresIn: this.config.tokenExpirationInSeconds,
      },
    );
  }

  validateToken(serviceName: string, token: string): boolean {
    return (
      (jwt.verify(token, this.config.secretWord) as IAuthorizationObject).serviceName ===
      serviceName
    );
  }
}
