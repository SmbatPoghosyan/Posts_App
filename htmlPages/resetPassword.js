const resetPasswordHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Password</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background-color: #f4f4f4;
                }

                .container {
                    width: 350px;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }

                h2 {
                    text-align: center;
                }

                form {
                    display: flex;
                    flex-direction: column;
                }

                label {
                    margin-bottom: 5px;
                }

                input[type="password"] {
                    padding: 10px;
                    margin-bottom: 10px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                }

                button[type="submit"] {
                    padding: 10px;
                    border: none;
                    border-radius: 5px;
                    background-color: #007bff;
                    color: #fff;
                    cursor: pointer;
                }

                button[type="submit"]:hover {
                    background-color: #0056b3;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Reset Password</h2>

                <form id="resetForm" action="/auth/recover-password/\${id}?code=\${code}" method="post">
                    <label for="newPassword">New Password:</label>
                    <input type="password" id="newPassword" name="newPassword" required><br><br>
                    <label for="repeatPassword">Repeat New Password:</label>
                    <input type="password" id="repeatPassword" name="repeatPassword" required><br><br>
                    <button type="submit">Reset Password</button>
                </form>

                <div id="message"></div>
            </div>

            <script src="resetPassword.js"></script>
        </body>
        </html>
    `;

module.exports = resetPasswordHTML;
