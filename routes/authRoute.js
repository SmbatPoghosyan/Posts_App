const express = require("express");
const router = express.Router();
const createResponseObj = require("../utils/createResponseObj");
const validate = require("../vallidations");
const {
  signinSchema,
  signupSchema,
  resetPasswordSchema,
} = require("../vallidations/authValidations");
const { signin, signup, resetPassword } = require("../services/authService");
const emailTemplate = require("../html_templates/reset_password");

const { sendVerificationEmail } = require("../services/verificationService");
const User = require("../models/userModel");
const { Query } = require("pg");

router.post("/signup", validate(signupSchema), async (req, res) => {
  const data = req.body;
  const { email, password, username } = data;

  try {
    const currentCode = await sendVerificationEmail(data.email, data.username);
    const newUser = await signup(email, password, username, currentCode);
    newUser.verification_code = currentCode;

    let responseObj;
    responseObj = createResponseObj(
      newUser,
      { message: "You succesfully registered." },
      200
    );
    res.status(200).send(responseObj);
  } catch (err) {
    console.error("error", err);
    res.status(500).send({
      message: "User with this username or email already exsists!",
    });
  }
});

router.post("/signin", validate(signinSchema), async (req, res) => {
  const data = req.body;
  const { email, password, username } = data;
  try {
    const { user, token } = await signin(email, password, username);
    const resObj = createResponseObj(
      user,
      { message: "You successfully loged in", token },
      200
    );
    res.status(200).send(resObj);
  } catch (err) {
    let errorMessage;
    if (email) {
      errorMessage = "Wrong email or password!";
    } else if (username) {
      errorMessage = "Wrong username or password!";
    }
    console.error("error", err);
    res.status(500).send({
      message: "Something went wrong.",
    });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const code = req.body.code;
    if (!code) {
      return res.status(401).send({ message: "Code is empty" });
    }
    const user = await User.query().findOne({ verification_code: code });
    if (!user) {
      return res.status(401).send({ message: "Invalid code" });
    } else {
      await User.query().patchAndFetchById(user.id, { is_active: true });

      const resObj = createResponseObj(
        {},
        { message: "You successfully verified your email." },
        200
      );

      res.status(200).send(resObj);
    }
  } catch (err) {
    console.error("error", err);
    res.status(500).send({
      message: "Something went wrong.",
    });
  }
});

router.post("/forgot", validate(resetPasswordSchema), async (req, res) => {
  try {
    const recipient = req.body.email;
    const userQuery = User.query();
    if (recipient) {
      userQuery.where("email", recipient);
    }
    const user = await userQuery.first();
    const recipient_name = user.username;
    const sendSucces = await resetPassword(
      recipient,
      recipient_name,
      emailTemplate
    );
    if (sendSucces) {
      res.status(200).send({ message: "Email was succesfully send." });
    } else {
      res.status(500).send({ message: "Email was not send!" });
    }
  } catch (err) {
    console.log("error", err);
    res.status(500).send({ message: "Something went wrong" });
  }
});

module.exports = router;
