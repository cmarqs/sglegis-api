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
        host: mail.host,
        port: mail.port,
        secure: false, // use tls
        requireTLS: true,
        auth: {
            ...sender
        },
        tls: {
            ciphers: 'SSLv3',
            rejectUnauthorized: false,
        },
        logger: false,
        debug: false,
    });
    
    var mailOptions = {
        from: 'sglegis@200.systems',
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