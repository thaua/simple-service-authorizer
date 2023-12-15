import * as jwt from 'jsonwebtoken';
import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import { SimpleServiceTokenGenerator } from './simple-service-token-generator';

describe('SimpleServiceTokenGenerator', () => {
  const mockedServiceName = 'unit-test';
  const mockedSecret = 'secretWord';
  const mockedExpirationInSeconds = 30;
  let generator: SimpleServiceTokenGenerator;

  beforeEach(() => {
    generator = new SimpleServiceTokenGenerator({
      secretWord: mockedSecret,
      serviceName: mockedServiceName
    });
  });

  describe('generating token', () => {
    let generatedToken: string;

    beforeEach(() => {
      generatedToken = generator.generate(mockedExpirationInSeconds);
    });

    it('returns token generated from jsonwebtoken', () => {
      const generatedTokenObjectDecoded = jwt.verify(generatedToken, mockedSecret) as any;
      const iat = generatedTokenObjectDecoded.iat;

      assert.ok(iat);
      assert.equal(generatedTokenObjectDecoded.serviceName, mockedServiceName);
      assert.equal(generatedTokenObjectDecoded.exp, Number(iat) + mockedExpirationInSeconds);
    });
  });
});
