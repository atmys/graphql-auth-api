/* istanbul ignore file */
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/../.env/.spec.env' });
const { port } = require('../config');
const app = require('./app');
const mongoose = require('mongoose');
const request = require('request');
const endPoint = `http://localhost:${port}/graphql`;

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
            const query = `mutation {
                signup(email: "${this.legitUserEmail}", password: "${this.legitUserPass}") {
                    id
                    email
                    token
                }
            }`;
            req(query).then(data => {
                const user = data.signup;
                expect(typeof user.id).toBe('string');
                expect(typeof user.email).toBe('string');
                expect(typeof user.token).toBe('string');
                this.legitUser = user;
                done();
            }).catch(err => {
                done.fail(err);
            });
        });
    });
    describe('when login', () => {
        it('should return signed user', done => {
            const query = `query {
                login(email: "${this.legitUserEmail}", password: "${this.legitUserPass}") {
                    id
                    token
                    email
                }
            }`;
            req(query).then(data => {
                const user = data.login;
                expect(user.id).toEqual(this.legitUser.id);
                expect(user.email).toEqual(this.legitUser.email);
                expect(typeof user.token).toBe('string');
                this.legitUser = user;
                done();
            }).catch(err => {
                done.fail(err);
            });
        });
    });
    describe('when changing email', () => {

        it('should fail if same email', done => {
            // this.legitUserEmail = 'john@doe.com';
            const query = `mutation {
                changeEmail(email: "${this.legitUserEmail}") {
                    id
                    token
                    email
                }
            }`;
            req(query).then(() => {
                done.fail();
            }).catch(err => {
                expect(err.length).toBe(1);
                expect(err[0].code).toBe(409);
                done();
            });
        });

        it('should fail if wrong token', done => {
            const savedToken = this.legitUser.token;
            this.legitUser.token = 'fake token';
            const query = `mutation {
                changeEmail(email: "${this.legitUserEmail}") {
                    id
                    token
                    email
                }
            }`;
            req(query).then(() => {
                done.fail();
            }).catch(err => {
                expect(err.code).toBe(500);
                this.legitUser.token = savedToken;
                done();
            });
        });

        it('should return signed user', done => {
            this.legitUserEmail = 'john@doe.fr';
            const query = `mutation {
                changeEmail(email: "${this.legitUserEmail}") {
                    id
                    token
                    email
                }
            }`;
            req(query).then(data => {
                const user = data.changeEmail;
                expect(user.id).toBe(this.legitUser.id);
                expect(typeof user.token).toBe('string');
                expect(user.email).toBe(this.legitUserEmail);
                this.legitUser = user;
                done();
            }).catch(err => {
                done.fail(err);
            });
        });
    });
    describe('when changing password', () => {
        it('should save and return signed user', done => {
            const newLegitUserPass = 'doejohn';
            const query = `mutation {
                changePassword(oldPassword: "${this.legitUserPass}", newPassword: "${newLegitUserPass}") {
                    id
                    token
                    email
                }
            }`;
            req(query).then(data => {
                const user = data.changePassword;
                expect(user.id).toBe(this.legitUser.id);
                expect(typeof user.token).toBe('string');
                expect(user.email).toBe(this.legitUserEmail);
                this.legitUserPass = newLegitUserPass;
                this.legitUser = user;
                done();
            }).catch(err => {
                done.fail(err);
            });
        });
    });
    describe('when loading one user', () => {

        it('should load user details', done => {
            const query = `query {
                user(id: "${this.legitUser.id}") {
                    id
                    password
                    email
                }
            }`;
            req(query).then(data => {
                const user = data.user;
                expect(user.id).toBe(this.legitUser.id);
                expect(typeof user.password).toBe('string');
                expect(user.email).toBe(this.legitUserEmail);
                done();
            }).catch(err => {
                done.fail(err);
            });
        });
    });

    describe('when loading all users', () => {

        it('should load user details', done => {
            const query = `query {
                users {
                    id
                    password
                    email
                }
            }`;
            req(query).then(data => {
                const users = data.users;
                expect(users.length).toBe(1);
                done();
            }).catch(err => {
                done.fail(err);
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
const req = query => {
    const options = {
        method: 'POST',
        uri: endPoint,
        json: true,
        body: { query }
    }
    if (this.legitUser) {
        options.headers = {
            'jwtauth': this.legitUser.token
        };
    }
    return new Promise((resolve, reject) => {
        request(options, function (error, response, body) {
            const err = error || body.error || body.errors;
            /* istanbul ignore if */
            if (err) {
                reject(err, response.statusCode);
            } else {
                resolve(body.data);
            }
        });
    });
}