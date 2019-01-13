const { newError, shouldExist, shouldBeAuthorized, shouldBeString, shouldBeValid, emailShouldNotExist, handleError } = require('./error');

describe('Errors', () => {

  let err = '';

  describe('when creating error', () => {
    it('should return a new error', () => {
      err = newError();
      expect(err).toBeTruthy();
    });
  });

  describe('when handling error', () => {
    it('should not throw', () => {
      expect(handleError(err)).toBeUndefined();
    });
  });

  describe('when testing errors', () => {

    it('should throw with wrong param', () => {
      expect(function () {
        shouldExist();
      }).toThrow();

      expect(function () {
        shouldBeAuthorized(false);
      }).toThrow();

      expect(function () {
        shouldBeString();
      }).toThrow();

      expect(function () {
        shouldBeString([]);
      }).toThrow();

      expect(function () {
        shouldBeValid(false);
      }).toThrow();

      expect(function () {
        emailShouldNotExist(1);
      }).toThrow();
    });

    it('should do nothing with right param', () => {
      expect(shouldExist({})).toBeUndefined();

      expect(shouldBeAuthorized(true)).toBeUndefined();

      expect(shouldBeString('string')).toBeUndefined();

      expect(shouldBeValid(true)).toBeUndefined();

      expect(emailShouldNotExist(0)).toBeUndefined();
    });
  });
});