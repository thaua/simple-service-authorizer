export interface ISimpleServiceTokenValidator {
  validate(serviceName: string, token: string): boolean;
}
