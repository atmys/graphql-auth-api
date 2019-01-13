const { admin } = require('./email');

describe('Email', () => {

  describe('when sending admin email', () => {

    it('should do nothing for a test', () => {
      expect(admin('subject', 'message')).toBeUndefined();
    });
  });

});