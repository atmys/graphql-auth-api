const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/../.env/.spec.env' });
const { port } = require('../config');
const app = require('./app');
const mongoose = require('mongoose');
const request = require('request');
const baseUrl = `http://localhost:${port}/api`;

beforeAll(done => {
    // FIRST WE CONNECT TO DB, CLEAN IT & START THE APP
    mongoose.connect(`mongodb://localhost/spec`, { useNewUrlParser: true }).then(() => {
        mongoose.connection.db.dropDatabase();
        this.server = app.listen(port);
        done();
    });
});

// TESTING BY COMPONENTS
describe('User', () => {

    this.legitUser = {};
    this.legitUserEmail = 'john@doe.com';
    this.legitUserPass = 'johndoe';

    describe('when creating account', () => {
        it('should return signed user with all rights', done => {
            req({
                method: 'POST',
                uri: '/users/signup',
                body: { email: this.legitUserEmail, password: this.legitUserPass }
            }).then(res => {
                const user = res.body;
                expect(user._id).toBeDefined();
                expect(user.token).toBeDefined();
                this.legitUser = user;
                done();
            });
        });
    });
    describe('when login', () => {
        it('should return signed user', done => {
            req({
                method: 'POST',
                uri: '/users/login',
                body: { email: this.legitUserEmail, password: this.legitUserPass }
            }).then(res => {
                const user = res.body;
                expect(user._id).toEqual(this.legitUser._id);
                this.legitUser = user;
                done();
            });
        });
    });
    describe('when changing email', () => {

        it('should fail if same email', done => {
            // this.legitUserEmail = 'john@doe.com';
            req({
                method: 'PUT',
                uri: '/users/email',
                body: { email: this.legitUserEmail },
                auth: true
            }).then(res => {
                expect(res.statusCode).toBe(409);
                done();
            });
        });

        it('should fail if wrong token', done => {
            const savedToken = this.legitUser.token;
            this.legitUser.token = 'fake token';
            req({
                method: 'PUT',
                uri: '/users/email',
                body: { email: this.legitUserEmail },
                auth: true
            }).then(res => {
                expect(res.statusCode).toBe(500);
                this.legitUser.token = savedToken;
                done();
            });
        });

        it('should return signed user', done => {
            this.legitUserEmail = 'john@doe.fr';
            req({
                method: 'PUT',
                uri: '/users/email',
                body: { email: this.legitUserEmail },
                auth: true
            }).then(res => {
                const user = res.body;
                expect(user._id).toBe(this.legitUser._id);
                expect(user.token).toBeDefined();
                expect(user.email).toBe(this.legitUserEmail);
                this.legitUser = user;
                done();
            });
        });
    });
    describe('when changing password', () => {
        it('should save and return signed user', done => {
            const newLegitUserPass = 'doejohn';
            req({
                method: 'PUT',
                uri: '/users/password',
                body: { oldPassword: this.legitUserPass, newPassword: newLegitUserPass },
                auth: true
            }).then(res => {
                const user = res.body;
                expect(user._id).toBe(this.legitUser._id);
                expect(user.token).toBeDefined();
                expect(user.email).toBe(this.legitUserEmail);
                this.legitUserPass = newLegitUserPass;
                this.legitUser = user;
                done();
            });
        });
    });
});

afterAll(done => {
    mongoose.disconnect();
    this.server.close();
    done();
});

// CUSTOM REQ FUNCTION
const req = o => {
    const options = {
        method: o.method,
        uri: o.uri,
        baseUrl,
        json: true,
        body: o.body
    }
    if (o.auth && this.legitUser) {
        options.headers = {
            'jwtauth': this.legitUser.token
        };
    }
    return new Promise((resolve, reject) => {
        request(options, function (error, response, body) {
            /* istanbul ignore if */
            if (error) {
                reject(error);
            } else {
                resolve({
                    body,
                    statusCode: response.statusCode
                });
            }
        });
    });
}