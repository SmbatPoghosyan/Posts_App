const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendEmail = async (recipient, sendingEmail, recipient_name, template) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SENDING_SERVICE, //gmail
    auth: {
      user: process.env.EMAIL_ADDRESS, //"yurakhachatryan3@gmail.com",
      pass: process.env.EMAIL_APPLICATION_PASSWORD, //"Example-Password-123!!!",
    },
  });

  const mailOptions = {
    from: `"Yura Khachatryan" <yurakhachatryan3@gmail.com>`,
    to: `${recipient}`,
    subject: "URL for reset password for Post_Application",
    html: template
      .replace("${resetPasswordURL}", sendingEmail)
      .replace("${name}", recipient_name),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
    return true;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { sendEmail };
