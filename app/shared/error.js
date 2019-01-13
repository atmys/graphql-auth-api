const util = require('util');
const email = require('./email');
const serializeError = require('serialize-error');
const { production, test } = require('../../config')

const newError = function (code, description, skipEmail) {
    const err = new Error(`${code} - ${description}`);
    err.description = description;
    err.code = code;
    err.skipEmail = skipEmail;
    return err;
}
exports.newError = newError;

exports.shouldExist = function (data) {
    if (!data) {
        throw newError(409, 'Should exist', false);
    }
}

exports.shouldBeAuthorized = function (check) {
    if (!check) {
        throw newError(403, 'Forbidden', false);
    }
}

exports.emailShouldNotExist = function (count) {
    if (count) {
        throw newError(409, 'Email already exists', true);
    }
}

exports.shouldBeString = function (check) {
    if (!check || check.constructor !== String) {
        throw newError(400, 'Should be a string', false);
    }
}

exports.shouldBeValid = function (check) {
    if (!check) {
        throw newError(422, 'Validation failure', true);
    }
}


exports.handleError = function (err, data) {
    const error = `ERROR:\n ${util.inspect(serializeError(err))}\n\nDATA:\n${util.inspect(data)}`;
    /* istanbul ignore next */
    if (test) {
        console.error(err);
        /* istanbul ignore next */
    } else if (production && !err.skipEmail) {
        email.admin('RPS error!', error);
        /* istanbul ignore next */
    } else if (!production || err.log) {
        console.error(error);
    }
}
