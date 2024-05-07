const bcrypt = require("bcrypt");
const { ROLE_ID } = require("../constants");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { sendEmail } = require("../services/sendEmailService");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const signin = async (email, password, username) => {
  try {
    const userQuery = User.query();
    if (email) {
      userQuery.where("email", email);
    } else if (username) {
      userQuery.where("username", username);
    }

    const user = await userQuery.first();

    const hashedPassword = user.password;

    const isSame = await bcrypt.compare(password, hashedPassword);

    if (isSame) {
      delete user.password;
      const token = jwt.sign(
        {
          user_id: user.id,
          email: user.email,
          username: user.username,
          role: user.role_id,
        },
        JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      delete user.password;
      return { user, token };
    }
  } catch (err) {
    console.error(err, err.message);
    throw new Error(err);
  }
};

const signup = async (
  email,
  password,
  username,
  verification_code,
  is_active = false
) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userObject = {
      email,
      password: hashedPassword,
      username,
      role_id: ROLE_ID.USER,
      verification_code,
      is_active,
    };
    const newUser = await User.query().insert(userObject);
    return newUser;
  } catch (err) {
    console.error(err, err.message);
    throw new Error(err);
  }
};

const resetPassword = async (
  recipient,
  recipient_name,
  emailTemplate,
  code
) => {
  const resetPasswordURL = `http://localhost:3000/auth/recover-password?code=${code}`;
  try {
    const sendSucces = await sendEmail(
      recipient,
      resetPasswordURL,
      recipient_name,
      emailTemplate
    );
    return sendSucces;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  signin,
  signup,
  resetPassword,
};
