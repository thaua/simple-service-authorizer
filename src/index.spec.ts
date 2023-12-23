import {
  SimpleServiceTokenGenerator,
  SimpleServiceTokenValidator,
  SimpleServiceTokenValidatorStatus,
} from './index';

describe('exports', () => {
  it('export SimpleServiceTokenGenerator', () => {
    expect(SimpleServiceTokenGenerator).toBeDefined();
    expect(typeof SimpleServiceTokenGenerator).toBe('function');
  });

  it('export SimpleServiceTokenValidator', () => {
    expect(SimpleServiceTokenValidator).toBeDefined();
    expect(typeof SimpleServiceTokenValidator).toBe('function');
  });

  it('export SimpleServiceTokenValidatorStatus', () => {
    expect(SimpleServiceTokenValidatorStatus).toBeDefined();
    expect(typeof SimpleServiceTokenValidatorStatus).toBe('object');
  });
});
