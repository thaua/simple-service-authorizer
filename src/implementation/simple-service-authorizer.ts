import { ISimpleServiceAuthorizerConfig } from '../interfaces/simple-service-authorizer-config.interface';
import { ISimpleServiceAuthorizer } from '../interfaces/simple-service-authorizer.interface';

export class SimpleServiceAuthorizer implements ISimpleServiceAuthorizer {
  constructor(private readonly config: ISimpleServiceAuthorizerConfig) {
    this.config = config;
  }

  generateToken(): string {
    return 'generated-token';
  }

  validateToken(token: string): boolean {
    return true;
  }
}
