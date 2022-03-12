const Mail = require('nodemailer');

const sender = {
    type: 'login',
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
};

const mail = {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
}

exports.send = (receiver = "", subject = "", message = "") => {
    var transporter = Mail.createTransport({
        pool: true,
        host: mail.host,
        port: mail.port,
        secure: false, //use TLS
        auth: {
            ...sender
        },
        logger: false,
        debug: false,
    });
    
    var mailOptions = {
        from: process.env.EMAIL_SENDER,
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