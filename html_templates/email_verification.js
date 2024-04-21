const email_verification_template = `verification <table class="wrapper" width="100%" cellpadding="0" cellspacing="0">
    <tr>
        <td align="center">
            <table class="main" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td>
                        <h1>Hi [name],! Verify your email</h1>
                        <p>Thank you for signing up!
                            
                            Your verification code is  <p style="font-size: 24px; font-weight: 600">\${verification_code}</p>
                            
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
</table>`;

module.exports = email_verification_template;
