import * as jwt from 'jsonwebtoken';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { IAuthorizationObject } from '../definitions/core/authorization-object.interface';
import { SimpleServiceTokenValidatorStatus } from '../definitions/core/simple-service-token-validator-state.enum';
import { SimpleServiceTokenValidator } from './simple-service-token-validator';

jest.mock('jsonwebtoken');

describe('SimpleServiceTokenValidator', () => {
  const mockedServiceName = 'unit-test';
  const mockedSecret = 'secretWord';
  let validator: SimpleServiceTokenValidator;

  beforeEach(() => {
    validator = new SimpleServiceTokenValidator({
      allowedServiceNames: [],
      secretWord: mockedSecret,
    });
  });

  describe('validateToken', () => {
    let result: boolean;

    describe('with expired token', () => {
      beforeEach(() => {
        jest.spyOn(jwt, 'verify').mockImplementation(() => {
          throw new TokenExpiredError('token expired', new Date());
        });

        result = validator.validate(mockedServiceName, 'anyToken');
      });

      it('returns false', () => {
        expect(result).toBeFalsy();
      });

      it('set state as expired', () => {
        expect(validator.state).toEqual(SimpleServiceTokenValidatorStatus.EXPIRED);
      });
    });

    describe('with malformed token', () => {
      beforeEach(() => {
        jest.spyOn(jwt, 'verify').mockImplementation(() => {
          throw new JsonWebTokenError('malformed token');
        });

        result = validator.validate(mockedServiceName, 'anyToken');
      });

      it('returns false', () => {
        expect(result).toBeFalsy();
      });

      it('set state as error', () => {
        expect(validator.state).toEqual(SimpleServiceTokenValidatorStatus.ERROR);
      });
    });

    describe('with unknown response format', () => {
      beforeEach(() => {
        jest.spyOn(jwt, 'verify').mockReturnValue([] as any);

        result = validator.validate(mockedServiceName, 'anyToken');
      });

      it('returns false', () => {
        expect(result).toBeFalsy();
      });

      it('set state as invalid', () => {
        expect(validator.state).toEqual(SimpleServiceTokenValidatorStatus.INVALID);
      });
    });

    describe('with unknown response object', () => {
      beforeEach(() => {
        jest.spyOn(jwt, 'verify').mockReturnValue({} as any);

        result = validator.validate(mockedServiceName, 'anyToken');
      });

      it('returns false', () => {
        expect(result).toBeFalsy();
      });

      it('set state as invalid', () => {
        expect(validator.state).toEqual(SimpleServiceTokenValidatorStatus.INVALID);
      });
    });

    describe('with null response', () => {
      beforeEach(() => {
        jest.spyOn(jwt, 'verify').mockReturnValue(null as any);

        result = validator.validate(mockedServiceName, 'anyToken');
      });

      it('returns false', () => {
        expect(result).toBeFalsy();
      });

      it('set state as invalid', () => {
        expect(validator.state).toEqual(SimpleServiceTokenValidatorStatus.INVALID);
      });
    });

    describe('with valid response', () => {
      beforeEach(() => {
        jest.spyOn(jwt, 'verify').mockReturnValue({
          serviceName: mockedServiceName,
        } as IAuthorizationObject as any);
      });

      describe('with invalid/inconsistency serviceName', () => {
        beforeEach(() => {
          result = validator.validate(mockedServiceName + '_wrong', 'anyToken');
        });

        it('returns false', () => {
          expect(result).toBeFalsy();
        });

        it('set state as invalid', () => {
          expect(validator.state).toEqual(SimpleServiceTokenValidatorStatus.INVALID);
        });
      });

      describe('with not allowed serviceName', () => {
        describe('with no service-names restriction', () => {
          beforeEach(() => {
            validator.config.allowedServiceNames = [];

            result = validator.validate(mockedServiceName, 'anyToken');
          });

          it('returns true', () => {
            expect(result).toBeTruthy();
          });

          it('set state as valid', () => {
            expect(validator.state).toEqual(SimpleServiceTokenValidatorStatus.VALID);
          });
        });

        describe('with service-names restriction', () => {
          beforeEach(() => {
            validator.config.allowedServiceNames = ['any-other-service-a', 'any-other-service-b'];

            result = validator.validate(mockedServiceName, 'anyToken');
          });

          it('returns false', () => {
            expect(result).toBeFalsy();
          });

          it('set state as invalid', () => {
            expect(validator.state).toEqual(SimpleServiceTokenValidatorStatus.INVALID);
          });
        });
      });

      describe('with valid token', () => {
        beforeEach(() => {
          result = validator.validate(mockedServiceName, 'anyToken');
        });

        it('returns true', () => {
          expect(result).toBeTruthy();
        });

        it('set state as valid', () => {
          expect(validator.state).toEqual(SimpleServiceTokenValidatorStatus.VALID);
        });
      });
    });
  });
});
