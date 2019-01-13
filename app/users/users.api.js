const jwt = require('jsonwebtoken');
const { Router } = require('express');
const router = Router();
const usersBLL = require('./users.bll');
const { isLoggedIn } = require('../shared/guards');
const { JWTSecret } = require('../../config');

// LOGIN

router.post('/signup', function (req, res, next) {
    usersBLL.signup(req.body).then(user => res.json(signedUser(user))).catch(next);
});

router.post('/login', function (req, res, next) {
    usersBLL.login(req.body).then(user => res.json(signedUser(user))).catch(next);
});

// SETTINGS

router.put('/email', isLoggedIn, function (req, res, next) {
    usersBLL.changeEmail(req.user, req.body).then(user => res.json(signedUser(user))).catch(next);
    // try {
    //     const user = await usersBLL.changeEmail(req.user, req.body);
    //     res.json(signedUser(user));
    // } catch (err) {
    //     next(err);
    // }
});

router.put('/password', isLoggedIn, function (req, res, next) {
    usersBLL.changePassword(req.user, req.body).then(user => res.json(signedUser(user))).catch(next);
});

module.exports = router;

function signedUser(user) {
    user = user.toJSON();
    delete user.password;
    user.token = jwt.sign({ _id: user._id }, JWTSecret);
    return user;
}