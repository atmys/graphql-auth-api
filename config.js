exports.port = process.env.PORT || 8081;
exports.production = process.env.NODE_ENV === 'production';
exports.test = process.env.NODE_ENV === 'test';

exports.JWTSecret = process.env.JWT_SECRET || 'secret';

exports.DBUrl = process.env.DB_URL || 'mongodb://localhost:27017/dev';

exports.emailConfig = {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    sender: process.env.EMAIL_SENDER,
    admin: process.env.EMAIL_ADMIN
};

exports.adminId = process.env.ADMIN_ID