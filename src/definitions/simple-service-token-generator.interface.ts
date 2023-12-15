import { ISimpleServiceTokenGeneratorConfig } from './config/simple-service-token-generator-config.interface';

export interface ISimpleServiceTokenGenerator {
  readonly config: ISimpleServiceTokenGeneratorConfig;

  generate(tokenExpirationInSeconds: number): string;
}
