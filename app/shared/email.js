const nodemailer = require('nodemailer');
const { emailConfig } = require('../../config');
const { handleError } = require('./error');

const transporter = nodemailer.createTransport({
    service: 'MailGun',
    auth: {
        user: emailConfig.user,
        pass: emailConfig.pass
    }
});

exports.admin = function (subject, message) {
    const mailOptions = {
        from: emailConfig.sender,
        to: emailConfig.admin,
        subject,
        text: message,
        // html: message
    };
    sendMail(mailOptions);
}

/* istanbul ignore next */
function sendMail(mailOptions) {
    if (emailConfig.user && emailConfig.pass && emailConfig.sender && emailConfig.admin) {
        transporter.sendMail(mailOptions, (err, info) => {
            err.skipEmail = true;
            err.log = true;
            handleError(err, info);
        });
    }
}