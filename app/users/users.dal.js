const { User } = require('../shared/models');

module.exports = {

    count: function (email) {
        return User.countDocuments({ email });
    },

    findOneByEmail: function (email) {
        return User.findOne({ email });
    },

    createUserAndSave: async function (data) {
        const newUser = new User(data);
        newUser.password = newUser.generateHash(data.password);
        await newUser.save();
        return newUser;
    },

    save: function (document) {
        return document.save();
    }
}