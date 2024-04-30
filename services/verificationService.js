const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const { v4: uuidv4 } = require("uuid");

const email_verification_template = require("../html_templates/email_verification");

const sendEmail = async (recipient, verification_code, recipient_name) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SENDING_SERVICE, //gmail
    auth: {
      user: process.env.EMAIL_ADDRESS, //"daniilakopyan221@gmail.com",
      pass: process.env.EMAIL_APPLICATION_PASSWORD, //"nwjw fidr nttr sars",
    },
  });

  const mailOptions = {
    from: `"Yura Khachatryan" <yurakhachatryan3@gmail.com>`,
    to: `${recipient}`,
    subject: "Verification code for Post_Application",
    html: email_verification_template
      .replace("${verification_code}", verification_code)
      .replace("${name}", recipient_name),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
  } catch (error) {
    throw new Error(error);
  }
};

const sendVerificationEmail = async (recipient, recipient_name) => {
  const verification_code = uuidv4();

  try {
    await sendEmail(recipient, verification_code, recipient_name);
    return verification_code;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { sendVerificationEmail };
