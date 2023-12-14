import {ISimpleServiceAuthorizer} from "./interfaces/simple-service-authorizer.interface";
import {ISimpleServiceAuthorizerConfig} from "./interfaces/simple-service-authorizer-config.interface";

export class SimpleServiceAuthorizer implements ISimpleServiceAuthorizer {
  constructor(private readonly config: ISimpleServiceAuthorizerConfig) {
    this.config = config;
  }

  generateToken(): string {
    // Implement token generation logic here
    return "generated-token";
  }

  validateToken(token: string): boolean {
    // Implement token validation logic here
    return true;
  }
}
