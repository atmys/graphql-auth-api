const { newError } = require('./error');

exports.isLoggedIn = function (user) {
	if (!user) {
		throw newError(401, 'Unauthorized', true);
	}
}