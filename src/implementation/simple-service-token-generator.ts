import * as jwt from 'jsonwebtoken';
import { IAuthorizationObject } from '../interfaces/core/authorization-object.interface';
import { ISimpleServiceTokenGenerator } from '../interfaces/simple-service-token-generator.interface';
import {
  ISimpleServiceTokenGeneratorConfig
} from '../interfaces/config/simple-service-token-generator-config.interface';

export class SimpleServiceTokenGenerator implements ISimpleServiceTokenGenerator {
  constructor(public readonly config: ISimpleServiceTokenGeneratorConfig) {
  }

  generate(tokenExpirationInSeconds: number): string {
    return jwt.sign(
      { serviceName: this.config.serviceName } as IAuthorizationObject,
      this.config.secretWord,
      {
        expiresIn: tokenExpirationInSeconds
      }
    );
  }
}
