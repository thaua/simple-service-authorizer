export interface ISimpleServiceAuthorizerConfig {
  serviceName: string;
  secretWord: string;
  tokenExpirationInSeconds: number;
  allowedServiceNames: string[];
}
