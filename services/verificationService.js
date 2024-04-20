const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const { v4: uuidv4 } = require("uuid");
const verification_code = uuidv4();

const sendEmail = async (recipient) => {
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
    html: `<table class="wrapper" width="100%" cellpadding="0" cellspacing="0">
    <tr>
        <td align="center">
            <table class="main" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td>
                        <h1>Hi [name],! Verify your email</h1>
                        <p>Thank you for signing up!
                            
                            Your verification code is  <p style="font-size: 24px; font-weight: 600">${verification_code}</p>
                            
                            Enter this code in our [website or app] to activate your [customer portal] account.
                            
                            If you have any questions, send us an email [email to your support team].
                            
                            We're glad you're here!
                            </p>
                       
                        <p>If you didn't create an account with this email, please ignore this email.
                            It will be deleted in 24 hours.
                        </p>
                        <p>Thanks,<br>The team</p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<table class="footer" width="100%" cellpadding="0" cellspacing="0" align="center">
    <tr>
        <td align="center">
            <p>
                <a href="https://heroco.am/">heroco.am</a> |
                <a href="mailto:support@example.com">support@example.com</a>
            </p>
        </td>
    </tr>
</table> `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
  } catch (error) {
    console.error(error);
  }
};

const sendVerificationEmail = async (recipient) => {
  try {
    await sendEmail(recipient);
    return verification_code;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { sendVerificationEmail, verification_code };
