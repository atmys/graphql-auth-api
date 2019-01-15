const jwt = require('jsonwebtoken');
const { string } = require('body-cleaner');
const { User } = require('../shared/models');
const { isLoggedIn } = require('../shared/guards');
const { emailShouldNotExist, shouldBeString, shouldBeValid } = require('../shared/error');
const { JWTSecret } = require('../../config');

module.exports = {

	user: async function (args) {
		const id = string(args.id);
		const user = await User.findById(id);
		shouldBeValid(user);
		return user;
	},

	users: async function () {
		const users = await User.find();
		return users;
	},

	login: async function (args) {
		const email = string(args.email);
		const password = args.password;
		shouldBeString(password);
		const user = await User.findOne({ email });
		shouldBeValid(user);
		shouldBeValid(user.validPassword(password));
		return signedUser(user);
	},

	signup: async function (args) {
		const email = string(args.email);
		const password = args.password;
		shouldBeString(password);
		const count = await User.count(email);
		emailShouldNotExist(count);
		const newUser = await User.createUserAndSave({
			email,
			password
		});
		return signedUser(newUser);
	},

	changeEmail: async function (args, ctx) {
		const user = ctx.user;
		isLoggedIn(user);
		const email = string(args.email);
		const count = await User.count(email);
		emailShouldNotExist(count);
		user.email = email;
		await user.save();
		return signedUser(user);
	},

	changePassword: async function (args, ctx) {
		const user = ctx.user;
		isLoggedIn(user);
		const oldPassword = args.oldPassword;
		const newPassword = args.newPassword;
		shouldBeString(oldPassword);
		shouldBeString(newPassword);
		shouldBeValid(user.validPassword(oldPassword));
		user.password = user.generateHash(newPassword);
		await user.save();
		return signedUser(user);
	}
}

function signedUser(user) {
	const userId = user.id;
	user = user.toObject();
	user.id = userId;
	delete user.password;
	user.token = jwt.sign({ id: user.id }, JWTSecret);
	return user;
}