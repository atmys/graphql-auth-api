const { isLoggedIn } = require('./guards');

describe('Guards', () => {

  // MOCK REQ RES NEXT
  const req = {};
  const next = function () {
    return true
  };
  const res = {
    sendStatus: function () { }
  };

  describe('when checking isLoggedIn', () => {

    it('should fail if !req.user', () => {
      expect(isLoggedIn(req, res, next)).toBeUndefined();
    });

    it('should pass if req.user', () => {
      req.user = {};
      expect(isLoggedIn(req, res, next)).toBeTruthy();
    });
  });
});