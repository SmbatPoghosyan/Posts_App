const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const { v4: uuidv4 } = require("uuid");

const email_verification_template = require("../html_templates/email_verification");

const sendEmail = async (recipient, verification_code) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL, //"daniilakopyan221@gmail.com",
      pass: process.env.APP_PASSWORD, //"nwjw fidr nttr sars",
    },
  });

  const mailOptions = {
    from: `"Daniel Hakobyan" <daniilakopyan221@gmail.com>`,
    to: `${recipient}`,
    subject: "Verification code for Post_Application",
    html: email_verification_template.replace(
      "${verification_code}",
      verification_code
    ),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
  } catch (error) {
    throw error(error);
  }
};

const sendVerificationEmail = async (recipient) => {
  const verification_code = uuidv4();
  try {
    await sendEmail(recipient, verification_code);
    return verification_code;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { sendVerificationEmail };
