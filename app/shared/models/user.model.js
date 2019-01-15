const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({
    email: String,
    password: String,
});

userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.statics.count = function (email) {
    return this.countDocuments({ email });
};

userSchema.statics.createUserAndSave = async function (data) {
    const newUser = new this(data);
    newUser.password = newUser.generateHash(data.password);
    await newUser.save();
    return newUser;
};

module.exports = mongoose.model('User', userSchema);
