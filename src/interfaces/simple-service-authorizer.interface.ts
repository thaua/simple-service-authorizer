export interface ISimpleServiceAuthorizer {
  generateToken(): string;

  validateToken(serviceName: string, token: string): boolean;
}
