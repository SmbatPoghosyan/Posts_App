const express = require("express");
const express = require("express");
const router = express.Router();
const createResponseObj = require("../utils/createResponseObj");
const validate = require("../vallidations");
const {
  signinSchema,
  signupSchema,
} = require("../vallidations/authValidations");
const { signin, signup } = require("../services/authService");
const { sendVerificationEmail } = require("../services/verificationService");

let currentCode;
let newUser;

router.post("/signup", validate(signupSchema), async (req, res) => {
  const data = req.body;
  let responseObj;
  const { email, password, username } = data;

  try {
    currentCode = await sendVerificationEmail(data.email);
    console.log(currentCode);
    newUser = await signup(email, password, username, currentCode);

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

router.post("/signin", validate(signinSchema), async (req, res) => {});

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
      errorMessage = "Wrong username or password";
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
    console.log(req.body.code);
    if (code === currentCode) {
      console.log(req.user);
      newUser.is_active = true;
      const resObj = createResponseObj(
        {},
        { message: "You successfully verified your email." },
        200
      );

      res.status(200).send(resObj);

      responseObj = createResponseObj(
        newUser,
        { message: "You succesfully registered." },
        200
      );

      res.status(200).send(responseObj);
    }
  } catch (err) {
    console.error("error", err);
    res.status(500).send({
      message: "Something went wrong.",
    });
  }
});

module.exports = router;
