const nodemailer = require("nodemailer");

module.exports.sendMail = async function sendMail(email, subject, message) {

    let mailTransporter =
        nodemailer.createTransport(
            {
                service: 'gmail',
                auth: {
                    user: process.env.NODEMAILER_USER,
                    pass: process.env.NODEMAILER_PASSWORD
                }
            }
        );

    let mailDetails = {
        from: 'No-Reply || ChitChat',
        to: email,
        subject: subject,
        html: `<body>
        <h3>Chit-Chat Password Reset Email</h3>
            ${message}
        </body>`
    };

    mailTransporter
        .sendMail(mailDetails,
            function (err, data) {
                if (err) {
                    console.log(`Error Occurs: ${err}`);
                }
            });
};
