const Mail = require('nodemailer');

const sender = {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
};

const mail = {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
}

exports.send = (receiver = "", subject = "", message = "") => {
    var transporter = Mail.createTransport({
        // service: "Outlook365",
        host: mail.host,
        port: mail.port,
        auth: {
            ...sender
        },
        tls: {
            secure: false,
            ignoreTLS: true,
            rejectUnauthorized: false
        },
        logger: true,
        debug: true,
    });
    
    var mailOptions = {
        from: process.env.EMAIL_USER,
        to: receiver,
        subject: subject,
        text: message
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info);
            }
        });
    })
}