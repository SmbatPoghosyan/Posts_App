const forgot_password_template = `Reset password <table class="wrapper" width="100%" cellpadding="0" cellspacing="0">
    <tr>
        <td align="center">
            <table class="main" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td> 
                        <h1>Hi \${name}! Recover your password</h1>
                        <p>To change your password follow the link!
                            
                            <p style="font-size: 24px; font-weight: 600">\${resetPasswordURL}</p>
                            Go to our website to change your password. 
                            If you have any questions, send us an email [email to your support team].
                            We're glad you're here!
                        </p>
                            
                        <p>If you didn't send any request to change your password, please ignore this email.
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

module.exports = forgot_password_template;
