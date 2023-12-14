import * as jwt from 'jsonwebtoken';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import { IAuthorizationObject } from '../interfaces/authorization-object.interface';
import { SimpleServiceAuthorizer } from './simple-service-authorizer';
import * as NodeTimersPromises from 'node:timers/promises';

describe('SimpleServiceAuthorizer', () => {
  const mockedServiceName = 'unit-test';
  const mockedSecret = 'secretWord';
  const mockedExpirationInSeconds = 30;
  let ssa: SimpleServiceAuthorizer;

  beforeEach(() => {
    ssa = new SimpleServiceAuthorizer({
      allowedServiceNames: [],
      secretWord: mockedSecret,
      serviceName: mockedServiceName,
      tokenExpirationInSeconds: mockedExpirationInSeconds,
    });
  });

  describe('generateToken', () => {
    let generatedToken: string;

    beforeEach(() => {
      generatedToken = ssa.generateToken();
    });

    it('returns token generated from jsonwebtoken', () => {
      const generatedTokenObjectDecoded = jwt.verify(generatedToken, 'secretWord') as any;
      const iat = generatedTokenObjectDecoded.iat;

      assert.equal(generatedTokenObjectDecoded.serviceName, mockedServiceName);
      assert.ok(iat);
      assert.equal(generatedTokenObjectDecoded.exp, Number(iat) + mockedExpirationInSeconds);
    });
  });

  describe('validateToken', () => {
    let result: boolean;

    beforeEach(() => {});

    describe('with invalid serviceName', () => {
      const wrongServiceName: string = 'unit-test-2';

      beforeEach(() => {
        result = ssa.validateToken(
          wrongServiceName,
          jwt.sign({ serviceName: mockedServiceName }, mockedSecret, {
            expiresIn: mockedExpirationInSeconds,
          }),
        );
      });

      it('returns false', () => {
        assert.equal(result, false);
      });
    });

    describe('with invalid token', () => {
      let token: any;

      beforeEach(() => {
        token = jwt.sign(
          { serviceName: mockedServiceName } as IAuthorizationObject,
          mockedSecret + 'different',
          {
            expiresIn: mockedExpirationInSeconds,
          },
        );
      });

      it('throws error', () => {
        return assert.rejects(async () => {
          return ssa.validateToken(mockedServiceName, token);
        }, JsonWebTokenError);
      });
    });

    describe('with expired token', () => {
      let token: any;

      beforeEach(async () => {
        token = jwt.sign({ serviceName: mockedServiceName } as IAuthorizationObject, mockedSecret, {
          expiresIn: 1,
        });

        await NodeTimersPromises.setTimeout(2000)
      });

      it('throws error', () => {
        return assert.rejects(async () => {
          ssa.validateToken(mockedServiceName, token);
        }, TokenExpiredError);
      });
    });

    describe('with valid token', () => {
      beforeEach(() => {
        result = ssa.validateToken(
          mockedServiceName,
          jwt.sign({ serviceName: mockedServiceName } as IAuthorizationObject, mockedSecret, {
            expiresIn: mockedExpirationInSeconds,
          }),
        );
      });

      it('returns true', () => {
        assert.equal(result, true);
      });
    });
  });
});
