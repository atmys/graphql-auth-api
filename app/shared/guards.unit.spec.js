const { isLoggedIn } = require('./guards');

describe('Guards', () => {

  describe('when checking isLoggedIn', () => {

    it('should fail if !user', () => {
      expect(function () {
        isLoggedIn()
      }).toThrow();
    });

    it('should pass if user', () => {
      expect(isLoggedIn({})).toBeUndefined();
    });
  });
});