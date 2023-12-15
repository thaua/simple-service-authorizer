import * as jwt from 'jsonwebtoken';
import { ISimpleServiceTokenGeneratorConfig } from '../definitions/config/simple-service-token-generator-config.interface';
import { IAuthorizationObject } from '../definitions/core/authorization-object.interface';
import { ISimpleServiceTokenGenerator } from '../definitions/simple-service-token-generator.interface';

export class SimpleServiceTokenGenerator implements ISimpleServiceTokenGenerator {
  constructor(public readonly config: ISimpleServiceTokenGeneratorConfig) {}

  generate(tokenExpirationInSeconds: number): string {
    return jwt.sign(
      { serviceName: this.config.serviceName } as IAuthorizationObject,
      this.config.secretWord,
      {
        expiresIn: tokenExpirationInSeconds,
      },
    );
  }
}
