const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

function sendMail(to, subject, text) {
  return transporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject,
    text
  });
}

module.exports = { sendMail };
