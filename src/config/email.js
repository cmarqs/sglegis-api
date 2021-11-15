const Mail = require('nodemailer');

const sender = {
    user: "cleiton.marques@200.systems",
    pass: 'P@$$m0rd!v7b1k9dm100grilo'
};

/*.createTransport({
    host: "my.smtp.host",
    port: 465,
    secure: true, // use TLS
    auth: {
      user: "username",
      pass: "pass",
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  });*/

exports.send = (receiver = "", subject = "", message = "") => {
    var transporter = Mail.createTransport({
        host: "smtp.dreamhost.com",
        port: 465,
        secure: true, // use TLS
        auth: {
            ...sender
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false,
        },
    });
    
    var mailOptions = {
        from: sender.user,
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