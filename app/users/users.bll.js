const usersDAL = require('./users.dal');
const { string } = require('body-cleaner');
const { emailShouldNotExist, shouldBeString, shouldBeValid } = require('../shared/error');

module.exports = {

	signup: async function (params) {
		const email = string(params.email);
		const password = params.password;
		shouldBeString(password);
		const count = await usersDAL.count(email);
		emailShouldNotExist(count);
		const newUser = await usersDAL.createUserAndSave({
			email,
			password
		});
		return newUser;
	},

	login: async function (params) {
		const email = string(params.email);
		const password = params.password;
		shouldBeString(password);
		const user = await usersDAL.findOneByEmail(email);
		shouldBeValid(user);
		shouldBeValid(user.validPassword(password));
		delete user.password;
		return user;
	},

	changeEmail: async function (user, params) {
		const email = string(params.email);
		const count = await usersDAL.count(email);
		emailShouldNotExist(count);
		user.email = email;
		await usersDAL.save(user);
		return user;
	},

	changePassword: async function (user, params) {
		const oldPassword = params.oldPassword;
		const newPassword = params.newPassword;
		shouldBeString(oldPassword);
		shouldBeString(newPassword);
		shouldBeValid(user.validPassword(oldPassword));
		user.password = user.generateHash(newPassword);
		await usersDAL.save(user);
		return user;
	}
}