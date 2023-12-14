import { ISimpleServiceAuthorizer } from "./interfaces/simple-service-authorizer.interface";
import { ISimpleServiceAuthorizerConfig } from "./interfaces/simple-service-authorizer-config.interface";
export declare class SimpleServiceAuthorizer implements ISimpleServiceAuthorizer {
    private readonly config;
    constructor(config: ISimpleServiceAuthorizerConfig);
    generateToken(): string;
    validateToken(token: string): boolean;
}
