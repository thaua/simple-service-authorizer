import * as jwt from 'jsonwebtoken';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import * as NodeTimersPromises from 'node:timers/promises';
import { IAuthorizationObject } from '../interfaces/core/authorization-object.interface';
import { SimpleServiceTokenValidator } from './simple-service-token-validator';

describe('SimpleServiceTokenValidator', () => {
  const mockedServiceName = 'unit-test';
  const mockedSecret = 'secretWord';
  const mockedExpirationInSeconds = 30;
  let validator: SimpleServiceTokenValidator;

  beforeEach(() => {
    validator = new SimpleServiceTokenValidator({
      allowedServiceNames: [],
      secretWord: mockedSecret,
    });
  });

  describe('validateToken', () => {
    let result: boolean;

    beforeEach(() => {});

    describe('with invalid serviceName', () => {
      const wrongServiceName: string = 'unit-test-2';

      beforeEach(() => {
        const testToken = jwt.sign({ serviceName: mockedServiceName }, mockedSecret, {
          expiresIn: mockedExpirationInSeconds,
        });

        result = validator.validate(wrongServiceName, testToken);
      });

      // TODO: should throw
      it('returns false', () => {
        assert.equal(result, false);
      });
    });

    describe('with invalid token', () => {
      let testToken: any;

      beforeEach(() => {
        testToken = jwt.sign(
          { serviceName: mockedServiceName } as IAuthorizationObject,
          mockedSecret + 'different',
          {
            expiresIn: mockedExpirationInSeconds,
          },
        );
      });

      it('throws error', () => {
        return assert.rejects(async () => {
          return validator.validate(mockedServiceName, testToken);
        }, JsonWebTokenError);
      });
    });

    describe('with expired token', () => {
      let testToken: any;

      beforeEach(async () => {
        testToken = jwt.sign(
          { serviceName: mockedServiceName } as IAuthorizationObject,
          mockedSecret,
          {
            expiresIn: 1,
          },
        );

        await NodeTimersPromises.setTimeout(2000);
      });

      it('throws error', () => {
        return assert.rejects(async () => {
          return validator.validate(mockedServiceName, testToken);
        }, TokenExpiredError);
      });
    });

    describe('with valid token', () => {
      beforeEach(() => {
        const testToken = jwt.sign(
          { serviceName: mockedServiceName } as IAuthorizationObject,
          mockedSecret,
          {
            expiresIn: mockedExpirationInSeconds,
          },
        );

        result = validator.validate(mockedServiceName, testToken);
      });

      it('returns true', () => {
        assert.equal(result, true);
      });
    });
  });
});
